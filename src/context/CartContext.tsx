import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, Combo } from '@/data/products';
import { useAuth } from './AuthContext';
import { getCart, updateCart } from '@/lib/api';

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
  isLoading: boolean;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ========================================
// OPTIMIZED CART CONTEXT
// ========================================

const STORAGE_KEY = 'mansara-cart';

// Helper to get stored cart
const getStoredCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    // Sanitize stored data
    return parsed.map((item: any) => ({
      ...item,
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
      price: Number(item.price) || 0
    }));
  } catch (error) {
    console.error('[Cart] Failed to parse stored cart:', error);
    return [];
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);

  // ========================================
  // LOAD CART ON MOUNT & USER CHANGE
  // ========================================
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);

      if (user) {
        // User logged in - fetch from server
        try {
          const token = localStorage.getItem('mansara-token');
          if (!token) {
            setItems([]);
            setIsLoading(false);
            return;
          }

          const serverCart = await getCart(token);

          // Merge with local cart if user just logged in
          const localCart = getStoredCart();
          const mergedCart = mergeCarts(serverCart, localCart);

          setItems(mergedCart);

          // Save merged cart back to server if changed
          if (mergedCart.length !== serverCart.length) {
            await syncCartToServer(mergedCart, token);
          }

          console.log('[Cart] ✓ Loaded from server');
        } catch (error) {
          console.error('[Cart] ✗ Failed to load from server:', error);
          // Fallback to local storage
          setItems(getStoredCart());
        }
      } else {
        // Not logged in - use local storage
        setItems(getStoredCart());
        console.log('[Cart] ✓ Loaded from local storage');
      }

      setIsLoading(false);
    };

    loadCart();
  }, [user?.id]);

  // ========================================
  // SYNC TO SERVER (DEBOUNCED)
  // ========================================
  useEffect(() => {
    if (isLoading) return; // Don't sync during initial load

    // Save to local storage immediately
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    // Debounce server sync
    const syncToServer = async () => {
      if (!user) return;

      const token = localStorage.getItem('mansara-token');
      if (!token) return;

      // Don't sync if we just synced (within 1 second)
      const now = Date.now();
      if (now - lastSyncTime < 1000) return;

      setIsSyncing(true);
      try {
        await syncCartToServer(items, token);
        setLastSyncTime(now);
        console.log('[Cart] ✓ Synced to server');
      } catch (error) {
        console.error('[Cart] ✗ Sync failed:', error);
      } finally {
        setIsSyncing(false);
      }
    };

    const timer = setTimeout(syncToServer, 500);
    return () => clearTimeout(timer);
  }, [items, user, isLoading, lastSyncTime]);

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  // Merge local and server carts (prevent duplicates)
  const mergeCarts = (serverCart: CartItem[], localCart: CartItem[]): CartItem[] => {
    const merged = [...serverCart];

    localCart.forEach(localItem => {
      const existingIndex = merged.findIndex(item => item.id === localItem.id);
      if (existingIndex >= 0) {
        // Merge quantities
        merged[existingIndex].quantity = (Number(merged[existingIndex].quantity) || 0) + (Number(localItem.quantity) || 0);
      } else {
        // Add new item
        merged.push(localItem);
      }
    });

    return merged;
  };

  // Sync cart to server
  const syncCartToServer = async (cart: CartItem[], token: string) => {
    try {
      await updateCart(cart, token);
    } catch (error) {
      throw error;
    }
  };

  // ========================================
  // CART ACTIONS
  // ========================================

  const addToCart = useCallback((item: Product | Combo, type: 'product' | 'combo') => {
    setItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);

      if (existingItem) {
        // Update quantity
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: (parseInt(i.quantity as any) || 0) + 1 }
            : i
        );
      }

      // Calculate price
      const price = type === 'product'
        ? ((item as Product).offerPrice || (item as Product).price)
        : (item as Combo).comboPrice;

      // Add new item
      return [...prev, {
        id: item.id,
        type,
        quantity: 1,
        price,
        name: item.name,
        image: item.image || ''
      }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    // Ensure quantity is a valid number
    const newQuantity = Math.max(0, Math.floor(Number(quantity)));

    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }

    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, quantity: newQuantity } : i
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [items]);

  const getCartCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isLoading,
      isSyncing
    }}>
      {children}
    </CartContext.Provider>
  );
};

// ========================================
// HOOK
// ========================================
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};