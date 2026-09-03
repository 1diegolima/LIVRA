import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Mail, Lock, Check, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      addToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      addToast('As senhas não coincidem.', 'error');
      return;
    }
    if (!formData.acceptTerms) {
      addToast('Você deve aceitar os termos de uso para continuar.', 'error');
      return;
    }

    register(formData.name, formData.email, formData.password);
    navigate('/perfil');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl border border-paper-200 p-8 shadow-paper space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-ink-900 text-amber-500 flex items-center justify-center mx-auto shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">
            Crie sua conta LIVRA
          </h1>
          <p className="text-xs text-ink-500">
            Junte-se à maior comunidade de apaixonados por livros.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo"
            id="register-name"
            required
            icon={User}
            value={formData.name}
            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
            placeholder="Ex: Helena Duarte"
          />

          <Input
            label="E-mail"
            id="register-email"
            type="email"
            required
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
            placeholder="seu@email.com"
          />

          <Input
            label="Senha"
            id="register-password"
            type="password"
            required
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
            placeholder="Mínimo 6 caracteres"
          />

          <Input
            label="Confirmar Senha"
            id="register-confirm-password"
            type="password"
            required
            icon={Lock}
            value={formData.confirmPassword}
            onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
            placeholder="Repita sua senha"
          />

          <label className="flex items-start gap-2.5 pt-2 text-xs text-ink-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData(p => ({ ...p, acceptTerms: e.target.checked }))}
              className="mt-0.5 rounded border-paper-300 text-amber-600 focus:ring-amber-500"
            />
            <span>
              Li e concordo com os{' '}
              <a href="#" className="font-semibold text-amber-800 underline">
                Termos de Uso
              </a>{' '}
              e a{' '}
              <a href="#" className="font-semibold text-amber-800 underline">
                Política de Privacidade
              </a>.
            </span>
          </label>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full shadow-md font-bold rounded-xl"
            icon={ArrowRight}
          >
            Criar Minha Conta
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-paper-100">
          <p className="text-xs text-ink-600">
            Já possui uma conta?{' '}
            <Link to="/login" className="font-bold text-amber-800 hover:underline">
              Fazer login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
