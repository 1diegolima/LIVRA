import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  Truck,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ConditionBadge } from '../components/book/ConditionBadge';
import { QuantitySelector } from '../components/book/QuantitySelector';
import { Button } from '../components/ui/Button';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency } from '../utils/formatters';

export const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    coupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    shippingCost,
    shippingCep,
    isCalculatingShipping,
    calculateShipping,
    total
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [cepInput, setCepInput] = useState(shippingCep || '');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  const handleCalculateShipping = (e) => {
    e.preventDefault();
    calculateShipping(cepInput);
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Carrinho de Compras' }]} />
        <EmptyState
          icon={ShoppingBag}
          title="Seu carrinho está vazio"
          description="Você ainda não adicionou nenhum exemplar ao seu carrinho. Explore nosso catálogo de novos e usados para encontrar sua próxima leitura!"
          actionText="Explorar Livros"
          actionLink="/livros"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Carrinho de Compras' }]} />

      <div className="flex items-center justify-between pb-4 border-b border-paper-200">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">
          Carrinho de Compras ({items.length} {items.length === 1 ? 'título' : 'títulos'})
        </h1>
        <Link
          to="/livros"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-ink-600 hover:text-amber-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Continuar Comprando
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List (Left) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-paper-200 shadow-paper divide-y divide-paper-100 overflow-hidden">
            {items.map(({ book, quantity }) => (
              <div key={book.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-paper-50/50 transition-colors">
                
                {/* Book Cover */}
                <Link to={`/livro/${book.id}`} className="shrink-0">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-20 sm:w-24 aspect-[3/4] object-cover rounded-lg border border-paper-200 shadow-2xs"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ConditionBadge
                      condition={book.condition}
                      conditionState={book.condition === 'Usado' ? book.conditionState : null}
                      size="sm"
                    />
                    <span className="text-[11px] text-ink-400">• {book.category}</span>
                  </div>

                  <Link to={`/livro/${book.id}`} className="block">
                    <h3 className="font-serif font-bold text-base text-ink-900 hover:text-amber-700 transition-colors line-clamp-1">
                      {book.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-ink-600 font-medium">
                    {book.author}
                  </p>

                  <p className="text-xs text-ink-400 font-mono">
                    ISBN: {book.isbn}
                  </p>

                  <div className="pt-2 sm:hidden flex items-center justify-between">
                    <span className="font-bold text-ink-900 text-sm">
                      {formatCurrency(book.price * quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(book.id)}
                      className="text-xs text-red-600 flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remover
                    </button>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="shrink-0 flex items-center gap-4">
                  <QuantitySelector
                    quantity={quantity}
                    onIncrease={() => updateQuantity(book.id, quantity + 1)}
                    onDecrease={() => updateQuantity(book.id, quantity - 1)}
                    size="sm"
                  />

                  <div className="hidden sm:block text-right min-w-[90px]">
                    <p className="font-bold text-ink-900 text-base">
                      {formatCurrency(book.price * quantity)}
                    </p>
                    {quantity > 1 && (
                      <p className="text-[10px] text-ink-400">
                        {formatCurrency(book.price)} cada
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(book.id)}
                    className="hidden sm:flex p-2 text-ink-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label={`Remover ${book.title}`}
                    title="Remover item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <Link
            to="/livros"
            className="sm:hidden flex items-center justify-center gap-1 text-xs font-semibold text-ink-700 py-3 bg-white border border-paper-200 rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Adicionar mais livros
          </Link>
        </div>

        {/* Order Summary (Right) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white rounded-2xl border border-paper-200 p-5 sm:p-6 shadow-paper space-y-5">
            <h2 className="font-serif font-bold text-lg text-ink-900 border-b border-paper-200 pb-3">
              Resumo do Pedido
            </h2>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-ink-600">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} itens)</span>
                <span className="font-medium text-ink-900">{formatCurrency(subtotal)}</span>
              </div>

              {coupon && (
                <div className="flex justify-between text-amber-700 bg-amber-50 p-2 rounded-lg font-medium text-xs">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Cupom {coupon.code} ({coupon.percentage}% OFF)
                  </span>
                  <div className="flex items-center gap-1">
                    <span>-{formatCurrency(discountAmount)}</span>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 hover:underline font-bold text-[10px] ml-1"
                    >
                      remover
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between text-ink-600">
                <span>Frete</span>
                <span className="font-medium text-ink-900">
                  {subtotal >= 120 ? (
                    <span className="text-emerald-700 font-bold">Grátis (Promoção)</span>
                  ) : shippingCost > 0 ? (
                    formatCurrency(shippingCost)
                  ) : (
                    <span className="text-xs text-ink-400">Calcular abaixo</span>
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-paper-200 flex justify-between items-baseline">
                <div>
                  <span className="font-serif font-bold text-lg text-ink-900">Total</span>
                  <p className="text-[10px] text-ink-400">Em até 6x sem juros</p>
                </div>
                <span className="font-serif text-2xl font-extrabold text-ink-900">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Button
              variant="accent"
              size="lg"
              onClick={() => navigate('/checkout')}
              className="w-full shadow-lg font-bold rounded-xl"
              icon={ArrowRight}
            >
              Continuar para Pagamento
            </Button>

            {/* Security note */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-ink-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ambiente 100% seguro e criptografado</span>
            </div>
          </div>

          {/* Coupon Input Card */}
          <div className="bg-white rounded-2xl border border-paper-200 p-4 shadow-2xs space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              Cupom de Desconto
            </label>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: LIVRA10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs uppercase bg-paper-100 border border-paper-300 rounded-lg focus:bg-white focus:outline-none focus:border-amber-600 text-ink-900 font-semibold"
              />
              <Button type="submit" variant="secondary" size="sm">
                Aplicar
              </Button>
            </form>
            <p className="text-[10px] text-ink-400">Dica: utilize <strong>LIVRA10</strong> para 10% de desconto.</p>
          </div>

          {/* Shipping CEP Calculation Card */}
          <div className="bg-white rounded-2xl border border-paper-200 p-4 shadow-2xs space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-700 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              Calcular Frete e Prazo
            </label>
            <form onSubmit={handleCalculateShipping} className="flex gap-2">
              <input
                type="text"
                placeholder="00000-000"
                value={cepInput}
                onChange={(e) => setCepInput(e.target.value)}
                maxLength={9}
                className="flex-1 px-3 py-2 text-xs bg-paper-100 border border-paper-300 rounded-lg focus:bg-white focus:outline-none focus:border-amber-600 text-ink-900"
              />
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                loading={isCalculatingShipping}
              >
                Calcular
              </Button>
            </form>
            {subtotal >= 120 ? (
              <p className="text-xs text-emerald-700 font-medium">✓ Frete Grátis ativado para este pedido!</p>
            ) : (
              <p className="text-[10px] text-ink-400">Frete grátis em compras acima de R$ 120.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
