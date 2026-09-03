import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  BookOpen,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { SearchBar } from './SearchBar';
import { CategoryMenu } from './CategoryMenu';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { totalItemsCount } = useCart();
  const { favoritesCount } = useFavorites();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-paper-300">
      {/* Top Banner */}
      <div className="bg-ink-900 text-paper-200 text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Frete Grátis para todo o Brasil em compras a partir de R$ 120 | Cupom <strong>LIVRA10</strong></span>
        </span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 md:gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-ink-900 text-amber-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-ink-900">
                LIVRA
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-ink-500 font-semibold -mt-1">
                Livraria & Sebo
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <SearchBar />
          </div>

          {/* Actions: Favorites, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Favoritos */}
            <Link
              to="/favoritos"
              className="relative p-2.5 rounded-full text-ink-700 hover:text-ink-900 hover:bg-paper-200/80 transition-colors"
              title="Meus Favoritos"
              aria-label="Favoritos"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-in zoom-in-75">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Conta do Usuário / Login */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-paper-200/80 transition-colors"
                    aria-expanded={userDropdownOpen}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-paper-400"
                    />
                    <span className="hidden lg:block text-xs font-semibold text-ink-800 truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-paper-200 py-1 z-50 animate-in fade-in zoom-in-95"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-paper-100">
                        <p className="text-xs font-bold text-ink-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-ink-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/perfil"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-ink-700 hover:bg-paper-100 hover:text-ink-900"
                      >
                        <User className="w-3.5 h-3.5" />
                        Meu Perfil
                      </Link>
                      <Link
                        to="/perfil?aba=pedidos"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-ink-700 hover:bg-paper-100 hover:text-ink-900"
                      >
                        <Package className="w-3.5 h-3.5" />
                        Meus Pedidos
                      </Link>
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ink-800 hover:text-ink-950 hover:bg-paper-200/80 rounded-full transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Entrar</span>
                </Link>
              )}
            </div>

            {/* Carrinho */}
            <Link
              to="/carrinho"
              className="relative flex items-center gap-2 px-3 py-2 bg-ink-900 text-white rounded-full hover:bg-ink-800 transition-all duration-200 shadow-sm"
              title="Ver carrinho"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">{totalItemsCount}</span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-ink-700 hover:bg-paper-200"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (under logo on mobile) */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Category Horizontal Navigation */}
      <CategoryMenu />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-paper-300 px-4 py-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4">
            <Link
              to="/livros"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-ink-900 py-2 border-b border-paper-100"
            >
              <Layers className="w-4 h-4 text-amber-600" />
              Ver Catálogo Completo
            </Link>
            <Link
              to="/favoritos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-ink-900 py-2 border-b border-paper-100"
            >
              <Heart className="w-4 h-4 text-red-500" />
              Favoritos ({favoritesCount})
            </Link>
            <Link
              to="/perfil"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-ink-900 py-2 border-b border-paper-100"
            >
              <User className="w-4 h-4 text-ink-700" />
              Minha Conta / Pedidos
            </Link>
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm font-medium text-red-600 py-2 text-left"
              >
                <LogOut className="w-4 h-4" />
                Sair da conta
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
