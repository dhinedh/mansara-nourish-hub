import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  // Redirect logic removed in favor of ProtectedRoute or consistent public cart behavior
  // If Cart is meant to be public, we shouldn't redirect. 
  // If private, ProtectedRoute handles it.
  // The user wanted "continue where left off", implying they want to be logged in. 
  // However, forcing login on /cart might successfully block guest users. 
  // To avoid race condition, we rely on ProtectedRoute IF we wrap it.
  // BUT I didn't wrap /cart in App.tsx because usually Carts are public until Checkout.
  // Let's check the user request again: "after refresh it asking to login it should continue from where it left".
  // This likely happened on a protected page OR the cart which has this aggressive redirect.
  // I will Update this to wait for isLoading before redirecting.

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Optional: Only redirect if you really want to force login for Cart
      // navigate('/login', { state: { from: '/cart' } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }
    navigate('/checkout');
  };

  // Show loading state only on initial load
  if (isLoading) {
    return (
      <Layout>
        <section className="py-20 bg-background">
          <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-brand-blue" />
            <p className="mt-4 text-muted-foreground">Loading your cart...</p>
          </div>
        </section>
      </Layout>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <Layout>
        <section className="py-20 bg-background">
          <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto text-center">
            <div className="w-24 h-24 mx-auto bg-secondary rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-brand-blue mb-4">Your Cart is Empty</h1>
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
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-secondary py-8">
        <PageHero pageKey="cart" />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            <p className="text-muted-foreground">{items.length} item(s) in your cart</p>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.type}`}
                  className="bg-card rounded-xl p-4 shadow-card flex gap-4 relative"
                >
                  {/* Subtle loading indicator during sync */}
                  {isSyncing && (
                    <div className="absolute top-2 right-2">
                      <Loader2 className="h-4 w-4 animate-spin text-brand-blue opacity-50" />
                    </div>
                  )}

                  <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-heading font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-secondary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 font-semibold min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
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

              <button
                onClick={clearCart}
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
                    <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span className="text-accent">Free</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-heading font-bold text-lg">
                    <span>Total</span>
                    <span className="text-brand-blue">
                      ₹{getCartTotal().toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm mb-3 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Please login to place an order
                  </div>
                )}

                <Button
                  variant="default"
                  size="lg"
                  className="w-full mb-3"
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </Button>

                <Link to="/products">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;