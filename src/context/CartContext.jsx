import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext({});

const STORAGE_KEY = 'livra_cart_items';
const COUPON_KEY = 'livra_applied_coupon';

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem(COUPON_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [shippingCep, setShippingCep] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Erro ao salvar carrinho no localStorage:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
      } else {
        localStorage.removeItem(COUPON_KEY);
      }
    } catch (e) {
      console.error('Erro ao salvar cupom no localStorage:', e);
    }
  }, [coupon]);

  const addToCart = (book, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.book.id === book.id);
      if (existing) {
        addToast(`Quantidade de "${book.title}" atualizada no carrinho!`, 'success');
        return prev.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        addToast(`"${book.title}" adicionado ao carrinho!`, 'success');
        return [...prev, { book, quantity }];
      }
    });
  };

  const removeFromCart = (bookId) => {
    setItems(prev => {
      const item = prev.find(i => i.book.id === bookId);
      if (item) {
        addToast(`"${item.book.title}" removido do carrinho.`, 'info');
      }
      return prev.filter(i => i.book.id !== bookId);
    });
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setShippingCost(0);
    setShippingCep('');
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'LIVRA10') {
      setCoupon({ code: 'LIVRA10', percentage: 10, description: '10% de desconto de boas-vindas' });
      addToast('Cupom LIVRA10 aplicado com sucesso! (10% OFF)', 'success');
      return true;
    } else if (clean === 'LEITURA15') {
      setCoupon({ code: 'LEITURA15', percentage: 15, description: '15% de desconto especial' });
      addToast('Cupom LEITURA15 aplicado com sucesso! (15% OFF)', 'success');
      return true;
    } else {
      addToast('Cupom inválido ou expirado.', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast('Cupom removido.', 'info');
  };

  const calculateShipping = async (cep) => {
    const rawCep = cep.replace(/\D/g, '');
    if (rawCep.length !== 8) {
      addToast('Informe um CEP válido com 8 dígitos.', 'error');
      return;
    }

    setIsCalculatingShipping(true);
    setShippingCep(cep);

    // Simula cálculo de frete baseado no total e região
    setTimeout(() => {
      setIsCalculatingShipping(false);
      if (subtotal >= 120) {
        setShippingCost(0);
        addToast('Parabéns! Você ganhou Frete Grátis!', 'success');
      } else {
        setShippingCost(14.90);
        addToast('Frete calculado: R$ 14,90 (Entrega em 3 a 5 dias úteis)', 'info');
      }
    }, 400);
  };

  const subtotal = items.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const discountAmount = coupon ? (subtotal * coupon.percentage) / 100 : 0;
  const effectiveShipping = subtotal >= 120 && items.length > 0 ? 0 : shippingCost;
  const total = Math.max(0, subtotal - discountAmount + effectiveShipping);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItemsCount,
        coupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        shippingCep,
        shippingCost: effectiveShipping,
        isCalculatingShipping,
        calculateShipping,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
