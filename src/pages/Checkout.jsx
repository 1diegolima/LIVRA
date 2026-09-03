import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  CreditCard,
  QrCode,
  FileText,
  ArrowRight,
  ArrowLeft,
  Lock,
  PackageCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { api } from '../services/api';
import { formatCurrency, formatCPF, formatCEP, formatCardNumber } from '../utils/formatters';

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, discountAmount, shippingCost, total, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cpf: user?.cpf || '',
    phone: user?.phone || '',
    cep: user?.addresses?.[0]?.cep || '01310-100',
    street: user?.addresses?.[0]?.street || 'Avenida Paulista',
    number: user?.addresses?.[0]?.number || '1578',
    complement: user?.addresses?.[0]?.complement || 'Apto 42B',
    neighborhood: user?.addresses?.[0]?.neighborhood || 'Bela Vista',
    city: user?.addresses?.[0]?.city || 'São Paulo',
    state: user?.addresses?.[0]?.state || 'SP',
    cardNumber: '',
    cardHolder: '',
    cardExpiry: '',
    cardCvv: '',
    installments: '1'
  });

  const handleInputChange = (field, value) => {
    let formatted = value;
    if (field === 'cpf') formatted = formatCPF(value);
    if (field === 'cep') formatted = formatCEP(value);
    if (field === 'cardNumber') formatted = formatCardNumber(value);

    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const handleNextStep = (e) => {
    e?.preventDefault();
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.cpf) {
        addToast('Preencha os campos obrigatórios de identificação.', 'error');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.cep || !formData.street || !formData.number || !formData.city) {
        addToast('Preencha o endereço completo de entrega.', 'error');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleFinishOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        items,
        subtotal,
        discountAmount,
        shippingCost,
        total,
        paymentMethod,
        customer: {
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          phone: formData.phone
        },
        shippingAddress: {
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state
        }
      };

      const order = await api.createOrder(orderPayload);
      setConfirmedOrder(order);
      clearCart();
      setCurrentStep(4);
      addToast('Pedido realizado com sucesso!', 'success');
    } catch (err) {
      addToast('Erro ao processar o pedido. Tente novamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: 'Identificação' },
    { number: 2, label: 'Endereço' },
    { number: 3, label: 'Pagamento' },
    { number: 4, label: 'Confirmação' },
  ];

  if (items.length === 0 && currentStep !== 4) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-serif font-bold text-ink-900 mb-2">Seu carrinho está vazio</h2>
        <p className="text-sm text-ink-600 mb-6">Adicione livros antes de prosseguir para o checkout.</p>
        <Link to="/livros">
          <Button variant="primary">Ir para o Catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <Breadcrumb items={[{ label: 'Carrinho', href: '/carrinho' }, { label: 'Finalizar Compra' }]} />

      {/* Steps Indicator */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-paper-200 shadow-2xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep > step.number
                      ? 'bg-emerald-600 text-white'
                      : currentStep === step.number
                      ? 'bg-ink-900 text-amber-400 ring-4 ring-amber-500/20'
                      : 'bg-paper-200 text-ink-400'
                  }`}
                >
                  {currentStep > step.number ? <CheckCircle className="w-4 h-4" /> : step.number}
                </div>
                <span
                  className={`text-xs font-semibold whitespace-nowrap ${
                    currentStep >= step.number ? 'text-ink-900' : 'text-ink-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                    currentStep > step.number ? 'bg-emerald-600' : 'bg-paper-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Step (Step 4) */}
      {currentStep === 4 && confirmedOrder ? (
        <div className="bg-white rounded-3xl border border-paper-200 p-8 sm:p-12 shadow-paper text-center space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <PackageCheck className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Compra Confirmada com Sucesso
            </span>
            <h1 className="font-serif text-3xl font-bold text-ink-900 mt-1">
              Obrigado por comprar na LIVRA!
            </h1>
            <p className="text-sm text-ink-600 mt-2">
              Seu pedido foi registrado e enviamos a confirmação com o código de rastreamento para <strong>{confirmedOrder.customer.email}</strong>.
            </p>
          </div>

          <div className="p-4 bg-paper-50 rounded-2xl border border-paper-200 text-left space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-paper-200">
              <span className="text-ink-500 font-medium">Número do Pedido</span>
              <span className="font-mono font-bold text-ink-900">{confirmedOrder.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-paper-200">
              <span className="text-ink-500 font-medium">Forma de Pagamento</span>
              <span className="font-bold text-ink-900 uppercase">{confirmedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-paper-200">
              <span className="text-ink-500 font-medium">Endereço de Entrega</span>
              <span className="font-medium text-ink-900 text-right">
                {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.number} — {confirmedOrder.shippingAddress.city}/{confirmedOrder.shippingAddress.state}
              </span>
            </div>
            <div className="flex justify-between py-1 pt-2 font-bold text-sm">
              <span className="text-ink-900">Total Pago</span>
              <span className="text-amber-800">{formatCurrency(confirmedOrder.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link to="/perfil?aba=pedidos">
              <Button variant="primary" size="md">
                Ver Meus Pedidos
              </Button>
            </Link>
            <Link to="/livros">
              <Button variant="secondary" size="md">
                Continuar Navegando
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Steps 1, 2, 3 Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Step Form Area */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-paper-200 p-6 sm:p-8 shadow-paper space-y-6">
            
            {/* STEP 1: IDENTIFICAÇÃO */}
            {currentStep === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="border-b border-paper-200 pb-3">
                  <h2 className="font-serif font-bold text-xl text-ink-900">1. Identificação do Comprador</h2>
                  <p className="text-xs text-ink-500">Utilizaremos estes dados para a emissão da nota fiscal e atualizações de entrega.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Nome Completo"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ex: Helena Duarte"
                    />
                  </div>

                  <div>
                    <Input
                      label="E-mail"
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <Input
                      label="CPF"
                      id="cpf"
                      required
                      value={formData.cpf}
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      label="Telefone / Celular (WhatsApp)"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(11) 98765-4321"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="primary" size="md" icon={ArrowRight}>
                    Prosseguir para Endereço
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 2: ENDEREÇO */}
            {currentStep === 2 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="border-b border-paper-200 pb-3">
                  <h2 className="font-serif font-bold text-xl text-ink-900">2. Endereço de Entrega</h2>
                  <p className="text-xs text-ink-500">Onde você deseja receber os seus livros?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Input
                      label="CEP"
                      id="cep"
                      required
                      value={formData.cep}
                      onChange={(e) => handleInputChange('cep', e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      label="Rua / Avenida"
                      id="street"
                      required
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      placeholder="Ex: Avenida Paulista"
                    />
                  </div>

                  <div>
                    <Input
                      label="Número"
                      id="number"
                      required
                      value={formData.number}
                      onChange={(e) => handleInputChange('number', e.target.value)}
                      placeholder="123"
                    />
                  </div>

                  <div>
                    <Input
                      label="Complemento"
                      id="complement"
                      value={formData.complement}
                      onChange={(e) => handleInputChange('complement', e.target.value)}
                      placeholder="Apto 42B (Opcional)"
                    />
                  </div>

                  <div>
                    <Input
                      label="Bairro"
                      id="neighborhood"
                      required
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      placeholder="Bela Vista"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      label="Cidade"
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="São Paulo"
                    />
                  </div>

                  <div>
                    <Input
                      label="Estado (UF)"
                      id="state"
                      required
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="SP"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setCurrentStep(1)}
                    icon={ArrowLeft}
                  >
                    Voltar
                  </Button>

                  <Button type="submit" variant="primary" size="md" icon={ArrowRight}>
                    Prosseguir para Pagamento
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 3: PAGAMENTO */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-paper-200 pb-3">
                  <h2 className="font-serif font-bold text-xl text-ink-900">3. Forma de Pagamento</h2>
                  <p className="text-xs text-ink-500">Escolha como prefere pagar pelo pedido.</p>
                </div>

                {/* Method selector pills */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-amber-600 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-paper-300 bg-white text-ink-700 hover:bg-paper-100'
                    }`}
                  >
                    <QrCode className="w-6 h-6 text-amber-600" />
                    <span>PIX (5% OFF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-amber-600 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-paper-300 bg-white text-ink-700 hover:bg-paper-100'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-amber-600" />
                    <span>Cartão de Crédito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('boleto')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all ${
                      paymentMethod === 'boleto'
                        ? 'border-amber-600 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-paper-300 bg-white text-ink-700 hover:bg-paper-100'
                    }`}
                  >
                    <FileText className="w-6 h-6 text-amber-600" />
                    <span>Boleto Bancário</span>
                  </button>
                </div>

                {/* Method content */}
                {paymentMethod === 'pix' && (
                  <div className="p-5 bg-paper-50 rounded-2xl border border-paper-200 text-center space-y-4 animate-in fade-in">
                    <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Pague com Pix e garanta a aprovação imediata
                    </p>
                    <div className="w-44 h-44 mx-auto bg-white p-3 rounded-xl border border-paper-300 shadow-sm flex items-center justify-center">
                      <QrCode className="w-full h-full text-ink-900" />
                    </div>
                    <p className="text-xs text-ink-600 max-w-sm mx-auto">
                      Abra o aplicativo do seu banco, escolha a opção <strong>Pix com QR Code</strong> ou Copia e Cola.
                    </p>
                  </div>
                )}

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4 p-5 bg-paper-50 rounded-2xl border border-paper-200 animate-in fade-in">
                    <Input
                      label="Número do Cartão"
                      id="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="0000 0000 0000 0000"
                    />

                    <Input
                      label="Nome Impresso no Cartão"
                      id="cardHolder"
                      required
                      value={formData.cardHolder}
                      onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                      placeholder="Como está no cartão"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Validade (MM/AA)"
                        id="cardExpiry"
                        required
                        value={formData.cardExpiry}
                        onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                        placeholder="12/28"
                      />
                      <Input
                        label="CVV"
                        id="cardCvv"
                        required
                        value={formData.cardCvv}
                        onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                        placeholder="123"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'boleto' && (
                  <div className="p-5 bg-paper-50 rounded-2xl border border-paper-200 text-center space-y-3 animate-in fade-in text-xs text-ink-600">
                    <FileText className="w-8 h-8 text-amber-700 mx-auto" />
                    <p className="font-bold text-ink-900">Boleto com vencimento em 3 dias úteis</p>
                    <p>O comprovante de pagamento será enviado diretamente para seu e-mail após a emissão.</p>
                  </div>
                )}

                <div className="pt-4 flex justify-between">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setCurrentStep(2)}
                    icon={ArrowLeft}
                  >
                    Voltar
                  </Button>

                  <Button
                    type="button"
                    variant="accent"
                    size="lg"
                    onClick={handleFinishOrder}
                    loading={isSubmitting}
                    className="shadow-xl"
                  >
                    Confirmar e Finalizar Pedido
                  </Button>
                </div>
              </div>
            )}

          </div>

          {/* Checkout Summary Card (Right) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-paper-200 p-5 shadow-paper space-y-4">
            <h3 className="font-serif font-bold text-base text-ink-900 border-b border-paper-200 pb-3">
              Itens do Pedido ({items.length})
            </h3>

            <div className="max-h-60 overflow-y-auto divide-y divide-paper-100 pr-1">
              {items.map(({ book, quantity }) => (
                <div key={book.id} className="py-2.5 flex items-center gap-3 text-xs">
                  <img src={book.image} alt={book.title} className="w-10 h-14 object-cover rounded shrink-0 border border-paper-200" />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-ink-900 truncate">{book.title}</p>
                    <p className="text-[10px] text-ink-500">{quantity}x • {book.condition}</p>
                    <p className="font-bold text-ink-900">{formatCurrency(book.price * quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-paper-200 space-y-2 text-xs">
              <div className="flex justify-between text-ink-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>Desconto</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-600">
                <span>Frete</span>
                <span>{shippingCost === 0 ? 'Grátis' : formatCurrency(shippingCost)}</span>
              </div>
              <div className="pt-2 border-t border-paper-200 flex justify-between text-base font-serif font-bold text-ink-900">
                <span>Total a Pagar</span>
                <span className="text-amber-900">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="p-3 bg-paper-100 rounded-xl flex items-center gap-2 text-[11px] text-ink-600">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Seus dados são protegidos por criptografia de ponta a ponta.</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
