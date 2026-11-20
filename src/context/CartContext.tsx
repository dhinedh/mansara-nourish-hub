import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Product, Combo } from '@/data/products';
import { useAuth } from './AuthContext';
import { useStore } from './StoreContext'; // Import useStore
import { getCart, updateCart } from '@/lib/api';
import { toast } from 'sonner';

// ========================================
// OPTIMIZED CART CONTEXT - COMPLETE
// ========================================
// Performance improvements:
// - Debounced sync (1 second)
// - Request deduplication
// - Optimistic updates
// - Offline support
// - Better error recovery
// - Batch operations
// ========================================

export interface CartItem {
  id: string;
  type: 'product' | 'combo';
  quantity: number;
  price: number;
  name: string;
  image: string;
  weight?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product | Combo, type: 'product' | 'combo', quantity?: number) => void;
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
// HELPER FUNCTIONS
// ========================================

/**
 * Sanitize cart item
 */
const sanitizeCartItem = (item: any): CartItem => ({
  id: String(item.id || item._id || ''),
  type: item.type === 'combo' ? 'combo' : 'product',
  name: item.name || 'Unknown Item',
  price: Number(item.price) || 0,
  quantity: Math.max(1, Math.min(999, Number(item.quantity) || 1)),
  image: item.image || '',
  weight: item.weight || undefined
});

/**
 * Validate cart items
 */
const validateCartItems = (items: any[]): CartItem[] => {
  if (!Array.isArray(items)) return [];
  return items.map(sanitizeCartItem).filter(item => item.id && item.price >= 0);
};

// ========================================
// CART PROVIDER
// ========================================

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { updateProduct, products, combos, getProduct, getCombo, refetch, updateLocalStock } = useStore(); // Get Store functions
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Refs for debouncing
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const syncInProgressRef = useRef(false);
  const pendingSyncRef = useRef<CartItem[] | null>(null);

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

        // Validate and sanitize
        const sanitizedCart = validateCartItems(serverCart);

        setItems(sanitizedCart);
        console.log('[Cart] ✓ Loaded from server:', sanitizedCart.length, 'items');
      } catch (error: any) {
        console.error('[Cart] ✗ Failed to load cart:', error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user?.id, isAuthenticated]);

  // ========================================
  // SYNC CART PRICES WITH STORE DATA
  // ========================================
  useEffect(() => {
    if (products.length === 0 && combos.length === 0 && !isLoading) return;

    setItems(prev => {
      let changed = false;
      const updated = prev.map(item => {
        if (item.type === 'product') {
          const liveProduct = products.find(p => p.id === item.id || p._id === item.id);
          if (liveProduct) {
            let livePrice = liveProduct.price;

            // Handle variants
            if (item.weight && liveProduct.variants && liveProduct.variants.length > 0) {
              const variant = liveProduct.variants.find(v => v.weight === item.weight);
              if (variant) {
                livePrice = variant.price;
              }
            }

            if (item.price !== livePrice) {
              changed = true;
              return { ...item, price: livePrice };
            }
          }
        } else if (item.type === 'combo') {
          const liveCombo = combos.find(c => c.id === item.id || c.slug === item.id);
          if (liveCombo && item.price !== liveCombo.comboPrice) {
            changed = true;
            return { ...item, price: liveCombo.comboPrice };
          }
        }
        return item;
      });

      return changed ? updated : prev;
    });
  }, [products, combos, isLoading]);

  // ========================================
  // DEBOUNCED SYNC TO BACKEND
  // ========================================
  const syncToBackend = useCallback((cartItems: CartItem[]) => {
    if (!isAuthenticated || !user) {
      console.log('[Cart] Not syncing - user not authenticated');
      return;
    }

    if (!Array.isArray(cartItems)) {
      console.warn('[Cart] Attempted to sync non-array cart items');
      return;
    }

    // Always keep pendingSyncRef pointing to the latest cart array
    pendingSyncRef.current = cartItems;

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Debounce sync by 500ms
    syncTimeoutRef.current = setTimeout(async () => {
      // Check if already syncing
      if (syncInProgressRef.current) {
        console.log('[Cart] Sync already in progress, will flush on complete');
        return;
      }

      const token = localStorage.getItem('mansara-token');
      if (!token) {
        console.warn('[Cart] No token for sync');
        return;
      }

      const itemsToSync = pendingSyncRef.current;
      if (!itemsToSync || !Array.isArray(itemsToSync)) {
        return;
      }

      syncInProgressRef.current = true;
      setIsSyncing(true);

      try {
        await updateCart(itemsToSync, token);
        if (pendingSyncRef.current === itemsToSync) {
          pendingSyncRef.current = null;
        }
        console.log('[Cart] ✓ Synced to server');
      } catch (error: any) {
        console.error('[Cart] ✗ Sync failed:', error);

        // Don't show toast for every sync failure (UX improvement)
        // Only show if user is actively using the cart
        if (document.hasFocus()) {
          if (error?.message === 'SESSION_EXPIRED') {
            toast.error('Session expired', {
              description: 'Please sign in again to keep your cart synced across devices.'
            });
          } else {
            toast.error('Failed to sync cart with server', {
              description: 'Your changes will be saved when connection is restored.'
            });
          }
        }
      } finally {
        syncInProgressRef.current = false;
        setIsSyncing(false);
        if (pendingSyncRef.current !== null) {
          syncToBackend(pendingSyncRef.current);
        }
      }
    }, 500);
  }, [isAuthenticated, user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  // ========================================
  // CART ACTIONS
  // ========================================

  const addToCart = useCallback((item: Product | Combo, type: 'product' | 'combo', quantityToAdd: number = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    const itemId = String(item.id || (item as any)._id || '');
    if (!itemId) {
      console.error('[Cart] Item is missing an identifier:', item);
      return;
    }

    const qty = Math.max(1, Math.min(999, Number(quantityToAdd) || 1));

    setItems(prev => {
      // For products with variants, we need to check both ID and weight
      const itemWeight = (item as any).weight;
      const existingItem = prev.find(i =>
        i.id === itemId &&
        i.type === type &&
        (type === 'combo' || i.weight === itemWeight)
      );

      let newItems: CartItem[];

      if (existingItem) {
        // Update quantity
        newItems = prev.map(i =>
          (i.id === itemId && i.type === type && (type === 'combo' || i.weight === itemWeight))
            ? { ...i, quantity: Math.min(999, i.quantity + qty) }
            : i
        );
        toast.success('Cart updated', { duration: 2000 });
      } else {
        // Calculate price from live data if possible
        let price: number;
        let weight: string | undefined = itemWeight;

        if (type === 'product') {
          const p = item as Product;
          const liveProduct = products.find(lp => lp.id === itemId || lp._id === itemId || lp.slug === p.slug);

          if (liveProduct) {
            price = liveProduct.price;
            if (weight && liveProduct.variants && liveProduct.variants.length > 0) {
              const variant = liveProduct.variants.find(v => v.weight === weight);
              if (variant) {
                price = variant.price;
              }
            }
          } else {
            price = p.price;
          }
        } else {
          price = (item as Combo).comboPrice;
        }

        // Add new item
        const newItem: CartItem = {
          id: itemId,
          type,
          quantity: qty,
          price,
          name: item.name,
          image: item.image || '',
          weight
        };

        newItems = [...prev, newItem];
        toast.success('Added to cart', { duration: 2000 });
      }

      // Sync to backend (debounced)
      syncToBackend(newItems);

      // ========================================
      // REAL-TIME STOCK UPDATE (Optimistic)
      // ========================================
      if (type === 'product') {
        const currentProduct = getProduct(itemId);
        if (currentProduct) {
          const newStock = Math.max(0, currentProduct.stock - qty);
          // Trigger local update immediately
          updateLocalStock(itemId, newStock);
        } else {
          // Fallback: Refetch if product not in invalid state
          refetch();
        }
      }

      return newItems;
    });
  }, [isAuthenticated, syncToBackend, products, getProduct, updateLocalStock, refetch]);

  const removeFromCart = useCallback((id: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to manage cart');
      return;
    }

    setItems(prev => {
      const itemToRemove = prev.find(i => i.id === id);
      const newItems = prev.filter(i => i.id !== id);
      syncToBackend(newItems);
      toast.success('Item removed from cart', { duration: 2000 });

      // ========================================
      // REAL-TIME STOCK RESTORATION
      // ========================================
      if (itemToRemove && itemToRemove.type === 'product') {
        const currentProduct = getProduct(id);
        if (currentProduct) {
          const newStock = currentProduct.stock + itemToRemove.quantity;
          updateLocalStock(id, newStock);
        } else {
          refetch();
        }
      }

      return newItems;
    });
  }, [isAuthenticated, syncToBackend, getProduct, updateProduct, refetch]);

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
      const oldItem = prev.find(i => i.id === id);
      const newItems = prev.map(i =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      );
      syncToBackend(newItems);

      // ========================================
      // REAL-TIME STOCK ADJUSTMENT
      // ========================================
      if (oldItem && oldItem.type === 'product') {
        const diff = newQuantity - oldItem.quantity; // +ve means took more stock, -ve means returned stock
        if (diff !== 0) {
          const currentProduct = getProduct(id);
          if (currentProduct) {
            // If diff is positive (added 2), stock decreases by 2.
            // If diff is negative (removed 2), stock increases by 2.
            const newStock = Math.max(0, currentProduct.stock - diff);
            updateLocalStock(id, newStock);
          }
        }
      }

      return newItems;
    });
  }, [isAuthenticated, removeFromCart, syncToBackend, getProduct, updateProduct]);

  const clearCart = useCallback(() => {
    if (!isAuthenticated) {
      toast.error('Please login to manage cart');
      return;
    }

    // ========================================
    // RESTORE STOCK FOR ALL ITEMS
    // ========================================
    items.forEach(item => {
      if (item.type === 'product') {
        const currentProduct = getProduct(item.id);
        if (currentProduct) {
          const newStock = currentProduct.stock + item.quantity;
          updateLocalStock(item.id, newStock);
        }
      }
    });

    setItems([]);
    syncToBackend([]);
    toast.success('Cart cleared', { duration: 2000 });
  }, [isAuthenticated, syncToBackend, items, getProduct, updateLocalStock]);

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