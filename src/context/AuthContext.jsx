import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext({});

const USER_KEY = 'livra_current_user';

const DEFAULT_USER = {
  id: 'usr-101',
  name: 'Helena Duarte',
  email: 'helena.duarte@email.com',
  cpf: '123.456.789-00',
  phone: '(11) 98765-4321',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  memberSince: 'Março de 2024',
  addresses: [
    {
      id: 'addr-1',
      isDefault: true,
      label: 'Casa',
      recipient: 'Helena Duarte',
      cep: '01310-100',
      street: 'Avenida Paulista',
      number: '1578',
      complement: 'Apto 42B',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP'
    }
  ]
};

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error('Erro ao persistir usuário:', e);
    }
  }, [user]);

  const login = (email, password) => {
    // Simulação de login
    const loggedUser = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
    };
    setUser(loggedUser);
    addToast(`Bem-vindo(a) de volta, ${loggedUser.name}!`, 'success');
    return true;
  };

  const register = (name, email, password) => {
    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email,
      cpf: '000.000.000-00',
      phone: '(11) 99999-9999',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      memberSince: 'Hoje',
      addresses: []
    };
    setUser(newUser);
    addToast(`Conta criada com sucesso! Seja bem-vindo(a), ${name}!`, 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    addToast('Você saiu da sua conta.', 'info');
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => ({
      ...prev,
      ...updatedFields
    }));
    addToast('Perfil atualizado com sucesso!', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
