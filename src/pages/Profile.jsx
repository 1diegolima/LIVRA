import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Edit2,
  Check,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { formatCurrency, formatCPF, formatCEP } from '../utils/formatters';

export const Profile = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('aba') || 'perfil';

  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { favorites } = useFavorites();

  const [orders, setOrders] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cpf: user?.cpf || ''
  });

  const [newAddressModalOpen, setNewAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Casa',
    recipient: user?.name || '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Carregar pedidos do localStorage
    try {
      const savedOrders = JSON.parse(localStorage.getItem('livra_orders') || '[]');
      setOrders(savedOrders);
    } catch {
      setOrders([]);
    }
  }, [isAuthenticated, navigate]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(editData);
    setIsEditingProfile(false);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const updatedAddresses = [
      ...(user.addresses || []),
      { id: 'addr-' + Date.now(), ...newAddress, isDefault: (user.addresses || []).length === 0 }
    ];
    updateProfile({ addresses: updatedAddresses });
    setNewAddressModalOpen(false);
    setNewAddress({
      label: 'Trabalho',
      recipient: user?.name || '',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    });
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Área do Cliente' }]} />

      <div className="flex items-center justify-between pb-4 border-b border-paper-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">
            Minha Conta
          </h1>
          <p className="text-xs sm:text-sm text-ink-500">
            Gerencie seus dados pessoais, pedidos e endereços de entrega.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR NAVIGATION (Left) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-paper-200 p-5 shadow-paper space-y-6">
          
          {/* User mini badge */}
          <div className="flex items-center gap-3.5 pb-5 border-b border-paper-100">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/40 shadow-xs"
            />
            <div className="overflow-hidden">
              <h3 className="font-serif font-bold text-base text-ink-900 truncate">{user.name}</h3>
              <p className="text-xs text-ink-500 truncate">{user.email}</p>
              <p className="text-[10px] text-amber-800 font-semibold mt-0.5">Membro desde {user.memberSince}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setSearchParams({ aba: 'perfil' })}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                activeTab === 'perfil'
                  ? 'bg-ink-900 text-white'
                  : 'text-ink-700 hover:bg-paper-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Meu Perfil</span>
            </button>

            <button
              onClick={() => setSearchParams({ aba: 'pedidos' })}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                activeTab === 'pedidos'
                  ? 'bg-ink-900 text-white'
                  : 'text-ink-700 hover:bg-paper-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Meus Pedidos</span>
              </div>
              {orders.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-ink-950 font-bold text-[10px] flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/favoritos')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-ink-700 hover:bg-paper-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Favoritos</span>
              </div>
              <span className="text-xs text-ink-400 font-normal">({favorites.length})</span>
            </button>

            <button
              onClick={() => setSearchParams({ aba: 'enderecos' })}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                activeTab === 'enderecos'
                  ? 'bg-ink-900 text-white'
                  : 'text-ink-700 hover:bg-paper-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Endereços Salvos</span>
            </button>

            <div className="pt-4 border-t border-paper-100">
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da Conta</span>
              </button>
            </div>
          </nav>

        </div>

        {/* MAIN CONTENT AREA (Right) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-paper-200 p-6 sm:p-8 shadow-paper">
          
          {/* TAB 1: MEU PERFIL */}
          {activeTab === 'perfil' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-paper-200">
                <div>
                  <h2 className="font-serif font-bold text-xl text-ink-900">Dados Pessoais</h2>
                  <p className="text-xs text-ink-500">Mantenha suas informações cadastrais atualizadas.</p>
                </div>
                {!isEditingProfile && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                    icon={Edit2}
                  >
                    Editar Dados
                  </Button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <Input
                    label="Nome Completo"
                    id="edit-name"
                    required
                    value={editData.name}
                    onChange={(e) => setEditData(d => ({ ...d, name: e.target.value }))}
                  />
                  <Input
                    label="E-mail"
                    id="edit-email"
                    type="email"
                    required
                    value={editData.email}
                    onChange={(e) => setEditData(d => ({ ...d, email: e.target.value }))}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="CPF"
                      id="edit-cpf"
                      value={editData.cpf}
                      onChange={(e) => setEditData(d => ({ ...d, cpf: formatCPF(e.target.value) }))}
                    />
                    <Input
                      label="Telefone / Celular"
                      id="edit-phone"
                      value={editData.phone}
                      onChange={(e) => setEditData(d => ({ ...d, phone: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" size="sm" onClick={() => setIsEditingProfile(false)}>
                      Cancelar
                    </Button>
                    <Button variant="primary" size="sm" type="submit" icon={Check}>
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="p-4 bg-paper-50 rounded-xl border border-paper-200">
                    <p className="text-ink-400 font-semibold uppercase tracking-wider mb-1">Nome Completo</p>
                    <p className="font-bold text-ink-900 text-sm">{user.name}</p>
                  </div>
                  <div className="p-4 bg-paper-50 rounded-xl border border-paper-200">
                    <p className="text-ink-400 font-semibold uppercase tracking-wider mb-1">E-mail</p>
                    <p className="font-bold text-ink-900 text-sm">{user.email}</p>
                  </div>
                  <div className="p-4 bg-paper-50 rounded-xl border border-paper-200">
                    <p className="text-ink-400 font-semibold uppercase tracking-wider mb-1">CPF</p>
                    <p className="font-bold text-ink-900 text-sm">{user.cpf || 'Não informado'}</p>
                  </div>
                  <div className="p-4 bg-paper-50 rounded-xl border border-paper-200">
                    <p className="text-ink-400 font-semibold uppercase tracking-wider mb-1">Telefone</p>
                    <p className="font-bold text-ink-900 text-sm">{user.phone || 'Não informado'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MEUS PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-paper-200">
                <h2 className="font-serif font-bold text-xl text-ink-900">Histórico de Pedidos</h2>
                <p className="text-xs text-ink-500">Acompanhe suas compras e códigos de rastreamento.</p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-12 h-12 text-ink-300 mx-auto" />
                  <h3 className="font-serif font-bold text-base text-ink-900">Você ainda não realizou pedidos</h3>
                  <p className="text-xs text-ink-500 max-w-sm mx-auto">
                    Assim que concluir uma compra na LIVRA, ela aparecerá detalhada nesta seção.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-5 rounded-2xl border border-paper-200 bg-paper-50/50 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-paper-200 text-xs">
                        <div>
                          <span className="font-mono font-bold text-ink-900 text-sm">{order.id}</span>
                          <span className="text-ink-500 ml-2">
                            • {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                          {order.status || 'Confirmado'}
                        </span>
                      </div>

                      {/* Items list */}
                      <div className="divide-y divide-paper-100">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img src={item.book.image} alt={item.book.title} className="w-8 h-11 object-cover rounded shadow-2xs" />
                              <div>
                                <p className="font-bold text-ink-900">{item.book.title}</p>
                                <p className="text-[10px] text-ink-500">{item.quantity}x • {item.book.condition}</p>
                              </div>
                            </div>
                            <span className="font-bold text-ink-900">
                              {formatCurrency(item.book.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-paper-200">
                        <span className="text-ink-600">Total do Pedido</span>
                        <span className="font-serif text-base text-amber-900">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ENDEREÇOS */}
          {activeTab === 'enderecos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-paper-200">
                <div>
                  <h2 className="font-serif font-bold text-xl text-ink-900">Endereços Salvos</h2>
                  <p className="text-xs text-ink-500">Cadastre seus locais de entrega para compras rápidas.</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setNewAddressModalOpen(true)}
                  icon={Plus}
                >
                  Novo Endereço
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(user.addresses || []).map((addr) => (
                  <div key={addr.id} className="p-4 rounded-2xl border border-paper-200 bg-paper-50 relative space-y-1 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-ink-900 uppercase tracking-wider">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-ink-800">{addr.recipient}</p>
                    <p className="text-ink-600">{addr.street}, {addr.number} {addr.complement && `• ${addr.complement}`}</p>
                    <p className="text-ink-600">{addr.neighborhood} — {addr.city}/{addr.state}</p>
                    <p className="text-ink-400 font-mono">CEP: {addr.cep}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* New Address Modal */}
      <Modal
        isOpen={newAddressModalOpen}
        onClose={() => setNewAddressModalOpen(false)}
        title="Cadastrar Novo Endereço"
      >
        <form onSubmit={handleAddAddress} className="space-y-3">
          <Input
            label="Identificação (Ex: Casa, Trabalho)"
            id="new-label"
            required
            value={newAddress.label}
            onChange={(e) => setNewAddress(a => ({ ...a, label: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="CEP"
              id="new-cep"
              required
              value={newAddress.cep}
              onChange={(e) => setNewAddress(a => ({ ...a, cep: formatCEP(e.target.value) }))}
              placeholder="00000-000"
            />
            <Input
              label="Destinatário"
              id="new-recipient"
              required
              value={newAddress.recipient}
              onChange={(e) => setNewAddress(a => ({ ...a, recipient: e.target.value }))}
            />
          </div>
          <Input
            label="Rua / Avenida"
            id="new-street"
            required
            value={newAddress.street}
            onChange={(e) => setNewAddress(a => ({ ...a, street: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Número"
              id="new-number"
              required
              value={newAddress.number}
              onChange={(e) => setNewAddress(a => ({ ...a, number: e.target.value }))}
            />
            <Input
              label="Complemento"
              id="new-comp"
              value={newAddress.complement}
              onChange={(e) => setNewAddress(a => ({ ...a, complement: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Bairro"
              id="new-neigh"
              required
              value={newAddress.neighborhood}
              onChange={(e) => setNewAddress(a => ({ ...a, neighborhood: e.target.value }))}
            />
            <Input
              label="Cidade"
              id="new-city"
              required
              value={newAddress.city}
              onChange={(e) => setNewAddress(a => ({ ...a, city: e.target.value }))}
            />
            <Input
              label="UF"
              id="new-uf"
              required
              value={newAddress.state}
              onChange={(e) => setNewAddress(a => ({ ...a, state: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="secondary" size="sm" onClick={() => setNewAddressModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Salvar Endereço
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
