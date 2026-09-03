import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Por favor, preencha o e-mail e a senha.', 'error');
      return;
    }
    login(email, password);
    navigate('/perfil');
  };

  const handleGoogleLogin = () => {
    login('usuario.google@exemplo.com', 'google-auth');
    navigate('/perfil');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotEmail) {
      addToast(`Enviamos instruções de redefinição para ${forgotEmail}`, 'success');
      setForgotModalOpen(false);
      setForgotEmail('');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl border border-paper-200 p-8 shadow-paper space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-ink-900 text-amber-500 flex items-center justify-center mx-auto shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">
            Acesse sua conta
          </h1>
          <p className="text-xs text-ink-500">
            Entre para acompanhar seus pedidos e gerenciar sua estante de favoritos.
          </p>
        </div>

        {/* Google SSO button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-paper-300 rounded-xl text-xs font-semibold text-ink-800 hover:bg-paper-100 transition-colors shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continuar com Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-paper-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-semibold text-ink-400 uppercase">ou com e-mail</span>
          <div className="border-t border-paper-200 w-full" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail"
            id="login-email"
            type="email"
            required
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />

          <div className="space-y-1">
            <Input
              label="Senha"
              id="login-password"
              type="password"
              required
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <div className="text-right">
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-xs font-semibold text-amber-800 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full shadow-md font-bold rounded-xl" icon={ArrowRight}>
            Entrar
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-paper-100">
          <p className="text-xs text-ink-600">
            Não possui uma conta?{' '}
            <Link to="/cadastro" className="font-bold text-amber-800 hover:underline">
              Criar conta gratuita
            </Link>
          </p>
        </div>

      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Recuperação de Senha"
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <p className="text-xs text-ink-600">
            Digite o e-mail cadastrado na LIVRA para enviarmos um link seguro de redefinição de acesso.
          </p>
          <Input
            label="E-mail Cadastrado"
            id="forgot-email"
            type="email"
            required
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="seu@email.com"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setForgotModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Enviar Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
