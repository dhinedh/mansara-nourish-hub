import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Combo, getProductById } from '@/data/products';

export interface CartItem {
  id: string;
  type: 'product' | 'combo';
  quantity: number;
  price: number;
  name: string;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product | Combo, type: 'product' | 'combo') => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

import { useAuth } from './AuthContext';
import { getCart, updateCart } from '@/lib/api';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    // Only load from local storage if NO user is logged immediately (handled by effect)
    // or initially just load local to show something, then replace.
    const savedCart = localStorage.getItem('mansara-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync with server on login/logout
  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('mansara-token');
          if (!token) return;

          const serverCart = await getCart(token);

          // Strategy: Merge local items (if any, e.g. added before login) with server items
          // Then update server with merged list.
          // For simplicity & safety: If local has items and server has items, we append local to server
          // or we can just replace local with server if we assume login means "load my profile".
          // User requested: "visible only to that user only after relogin it should be their"
          // This implies getting the server state is priority.
          // However, keeping guest items is good UX.

          // Let's check if we have "guest" items that need saving
          const localCartJSON = localStorage.getItem('mansara-cart');
          const localItems = localCartJSON ? JSON.parse(localCartJSON) : [];

          // If we just logged in, we might want to merge.
          // For now, let's adopt a policy: Server is truth. 
          // BUT if we modified cart while logged out, maybe we should prompt? 
          // Simple approach: Server completely overwrites local on login.
          // IMPROVEMENT: If we want to support "add as guest then login to save", we need to merge.

          // Let's implement strict user separation as requested ("visible only to that user").
          setItems(serverCart);

        } catch (error) {
          console.error("Failed to sync cart", error);
        }
      } else {
        // Logged out: Clear items (User specific cart)
        setItems([]);
        // Optionally clear local storage to ensure "visible only to user"
        localStorage.removeItem('mansara-cart');
      }
      setIsLoaded(true);
    };

    syncCart();
  }, [user?.id]); // Depend on User ID change

  // Save to local storage (for persistence across refresh) AND Server (if logged in)
  useEffect(() => {
    if (!isLoaded) return; // Don't save empty/initial state back if we haven't loaded yet

    // Local Persistence (always, for refresh safety)
    localStorage.setItem('mansara-cart', JSON.stringify(items));

    // Server Persistence (debounced ideally, but direct for now)
    const saveToServer = async () => {
      if (user && items.length >= 0) { // allow saving empty array
        const token = localStorage.getItem('mansara-token');
        if (token) {
          try {
            await updateCart(items, token);
          } catch (err) {
            console.error("Failed to save cart to server", err);
          }
        }
      }
    };

    // Simple debounce to avoid too many API calls
    const timeout = setTimeout(saveToServer, 500);
    return () => clearTimeout(timeout);

  }, [items, user, isLoaded]);

  const addToCart = (item: Product | Combo, type: 'product' | 'combo') => {
    setItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      const price = type === 'product'
        ? ((item as Product).offerPrice || (item as Product).price)
        : (item as Combo).comboPrice;

      return [...prev, {
        id: item.id,
        type,
        quantity: 1,
        price,
        name: item.name,
        image: item.image
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
