import React, { createContext, useContext, useState, useEffect } from 'react';
import { TravelPackage, CartItem } from '../types';
import { cartOperations } from '../utils/storage';

interface CartContextType {
  cart: CartItem[];
  addToCart: (travelPackage: TravelPackage, quantity?: number) => void;
  removeFromCart: (packageId: string) => void;
  updateQuantity: (packageId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = cartOperations.get();
    setCart(savedCart);
  }, []);

  useEffect(() => {
    cartOperations.set(cart);
  }, [cart]);

  const addToCart = (travelPackage: TravelPackage, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.package.id === travelPackage.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.package.id === travelPackage.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { package: travelPackage, quantity }];
      }
    });
  };

  const removeFromCart = (packageId: string) => {
    setCart(prevCart => prevCart.filter(item => item.package.id !== packageId));
  };

  const updateQuantity = (packageId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(packageId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.package.id === packageId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    cartOperations.clear();
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.package.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};