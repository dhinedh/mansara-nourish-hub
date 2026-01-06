import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, Combo } from '@/data/products';
import { useAuth } from './AuthContext';
import { getCart, updateCart } from '@/lib/api';
import { toast } from 'sonner';

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

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // ========================================
  // LOAD CART FROM BACKEND
  // ========================================
  useEffect(() => {
    const loadCart = async () => {
      // If not authenticated, clear cart
      if (!isAuthenticated || !user) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const token = localStorage.getItem('mansara-token');
        if (!token) {
          console.warn('[Cart] No token found');
          setItems([]);
          setIsLoading(false);
          return;
        }

        // Fetch cart from backend
        const serverCart = await getCart(token);
        
        // Ensure it's an array and sanitize data
        const sanitizedCart = Array.isArray(serverCart) 
          ? serverCart.map((item: any) => ({
              id: item.id,
              type: item.type,
              name: item.name,
              price: Number(item.price) || 0,
              quantity: Math.max(1, Math.min(999, Number(item.quantity) || 1)),
              image: item.image || ''
            }))
          : [];

        setItems(sanitizedCart);
        console.log('[Cart] ✓ Loaded from server:', sanitizedCart.length, 'items');
      } catch (error: any) {
        console.error('[Cart] ✗ Failed to load cart:', error);
        // Don't show error toast on initial load, just clear cart
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user?.id, isAuthenticated]);

  // ========================================
  // SYNC TO BACKEND
  // ========================================
  const syncToBackend = useCallback(async (cartItems: CartItem[]) => {
    if (!isAuthenticated || !user) {
      console.log('[Cart] Not syncing - user not authenticated');
      return;
    }

    const token = localStorage.getItem('mansara-token');
    if (!token) {
      console.warn('[Cart] No token for sync');
      return;
    }

    setIsSyncing(true);
    try {
      await updateCart(cartItems, token);
      console.log('[Cart] ✓ Synced to server');
    } catch (error: any) {
      console.error('[Cart] ✗ Sync failed:', error);
      toast.error('Failed to update cart on server');
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, user]);

  // ========================================
  // CART ACTIONS
  // ========================================

  const addToCart = useCallback((item: Product | Combo, type: 'product' | 'combo') => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    setItems(prev => {
      const existingItem = prev.find(i => i.id === item.id && i.type === type);

      let newItems: CartItem[];

      if (existingItem) {
        // Update quantity
        newItems = prev.map(i =>
          i.id === item.id && i.type === type
            ? { ...i, quantity: Math.min(999, i.quantity + 1) }
            : i
        );
        toast.success('Cart updated');
      } else {
        // Calculate price
        const price = type === 'product'
          ? ((item as Product).offerPrice || (item as Product).price)
          : (item as Combo).comboPrice;

        // Add new item
        newItems = [...prev, {
          id: item.id,
          type,
          quantity: 1,
          price,
          name: item.name,
          image: item.image || ''
        }];
        toast.success('Added to cart');
      }

      // Sync to backend
      syncToBackend(newItems);
      return newItems;
    });
  }, [isAuthenticated, syncToBackend]);

  const removeFromCart = useCallback((id: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to manage cart');
      return;
    }

    setItems(prev => {
      const newItems = prev.filter(i => i.id !== id);
      syncToBackend(newItems);
      toast.success('Item removed from cart');
      return newItems;
    });
  }, [isAuthenticated, syncToBackend]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to manage cart');
      return;
    }

    // Ensure quantity is a valid number
    let newQuantity = Math.floor(Number(quantity));

    // Bounds check
    if (isNaN(newQuantity) || newQuantity < 0) newQuantity = 0;
    if (newQuantity > 999) newQuantity = 999;

    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }

    setItems(prev => {
      const newItems = prev.map(i =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      );
      syncToBackend(newItems);
      return newItems;
    });
  }, [isAuthenticated, removeFromCart, syncToBackend]);

  const clearCart = useCallback(() => {
    if (!isAuthenticated) {
      toast.error('Please login to manage cart');
      return;
    }

    setItems([]);
    syncToBackend([]);
    toast.success('Cart cleared');
  }, [isAuthenticated, syncToBackend]);

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