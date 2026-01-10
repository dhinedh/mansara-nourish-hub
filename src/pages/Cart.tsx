import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

// ========================================
// OPTIMIZED CART PAGE
// ========================================
// Improvements:
// 1. Instant initial render with skeleton
// 2. Progressive loading (show layout first)
// 3. Optimistic UI updates
// 4. Debounced quantity changes
// 5. Better loading states
// ========================================

const Cart: React.FC = () => {
  const {
    items,
    isLoading,
    isSyncing,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    clearCart
  } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Local state for instant UI updates
  const [localItems, setLocalItems] = useState(items);
  
  // Sync local items with cart items
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // Optimistic quantity update
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    // Update local state immediately
    setLocalItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // Update cart (debounced in CartContext)
    updateQuantity(itemId, newQuantity);
  };

  // Optimistic remove
  const handleRemove = (itemId: string) => {
    // Remove from local state immediately
    setLocalItems(prev => prev.filter(item => item.id !== itemId));

    // Remove from cart
    removeFromCart(itemId);
  };

  // Calculate total from local items for instant updates
  const localTotal = useMemo(() => {
    return localItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [localItems]);

  const handleCheckout = () => {
    if (localItems.length === 0) return;
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    navigate('/checkout');
  };

  // Show layout immediately, then show loading inside
  const showInitialLoading = isLoading && items.length === 0;
  const showContent = !showInitialLoading || items.length > 0;

  return (
    <Layout>
      {/* Header - Always show */}
      <section className="bg-secondary py-8">
        <PageHero pageKey="cart" />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {showContent && (
              <p className="text-muted-foreground">
                {localItems.length} item(s) in your cart
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          {/* Initial Loading State */}
          {showInitialLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-brand-blue" />
              <p className="mt-4 text-muted-foreground">Loading your cart...</p>
            </div>
          ) : localItems.length === 0 ? (
            /* Empty Cart State */
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-secondary rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-brand-blue mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/products">
                <Button variant="default" size="lg">
                  Start Shopping
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          ) : (
            /* Cart Items Grid */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {localItems.map((item) => (
                  <div
                    key={`${item.id}-${item.type}`}
                    className="bg-card rounded-xl p-4 shadow-card flex gap-4 relative transition-opacity"
                    style={{ opacity: isSyncing ? 0.7 : 1 }}
                  >
                    {/* Syncing indicator */}
                    {isSyncing && (
                      <div className="absolute top-2 right-2">
                        <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-heading font-semibold text-foreground">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {item.type}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-secondary transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 font-semibold min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-secondary transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="font-heading font-bold text-brand-blue text-lg">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                      setLocalItems([]);
                      clearCart();
                    }
                  }}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
                  <h2 className="font-heading font-bold text-xl text-brand-blue mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-foreground">
                      <span>Subtotal</span>
                      <span>₹{localTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Shipping</span>
                      <span className="text-accent">Free</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-heading font-bold text-lg">
                      <span>Total</span>
                      <span className="text-brand-blue">
                        ₹{localTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Auth Warning */}
                  {!authLoading && !isAuthenticated && (
                    <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm mb-3 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Please login to place an order
                    </div>
                  )}

                  {/* Checkout Button */}
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full mb-3"
                    onClick={handleCheckout}
                    disabled={localItems.length === 0 || authLoading}
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : isAuthenticated ? (
                      'Proceed to Checkout'
                    ) : (
                      'Login to Checkout'
                    )}
                  </Button>

                  {/* Continue Shopping */}
                  <Link to="/products">
                    <Button variant="outline" size="lg" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Cart;