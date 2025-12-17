import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const Checkout: React.FC = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const [step, setStep] = React.useState(1);
  const [orderPlaced, setOrderPlaced] = React.useState(false);

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <Layout>
        <section className="py-20 bg-background">
          <div className="container text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-brand-blue mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <Link to="/products">
              <Button variant="default" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <section className="py-20 bg-background">
          <div className="container text-center">
            <h1 className="font-heading text-2xl font-bold text-brand-blue mb-4">Your cart is empty</h1>
            <Link to="/products">
              <Button variant="default">Shop Now</Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-secondary py-8">
        <div className="container">
          <h1 className="font-heading text-3xl font-bold text-brand-blue">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            {['Address', 'Summary', 'Payment'].map((label, index) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step > index + 1 ? 'bg-accent text-accent-foreground' :
                  step === index + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-sm ${step === index + 1 ? 'font-semibold' : 'text-muted-foreground'}`}>
                  {label}
                </span>
                {index < 2 && <div className="w-8 h-0.5 bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container max-w-2xl">
          {step === 1 && (
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="font-heading text-xl font-bold text-brand-blue mb-6">Delivery Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-border bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-border bg-background" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-lg border border-border bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea className="w-full px-4 py-3 rounded-lg border border-border bg-background" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-border bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Pincode</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-border bg-background" />
                  </div>
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full mt-6" size="lg">
                Continue to Summary
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="font-heading text-xl font-bold text-brand-blue mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-border">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 font-heading font-bold text-lg">
                  <span>Total</span>
                  <span className="text-brand-blue">₹{getCartTotal()}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1" size="lg">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1" size="lg">
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="font-heading text-xl font-bold text-brand-blue mb-6">Payment</h2>
              <div className="space-y-4 mb-6">
                <div className="p-4 border border-primary rounded-lg bg-primary/5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="w-5 h-5" />
                    <span className="font-medium">Cash on Delivery</span>
                  </label>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="payment" className="w-5 h-5" />
                    <span className="font-medium">Online Payment</span>
                    <span className="text-sm text-muted-foreground">(Coming Soon)</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1" size="lg">
                  Back
                </Button>
                <Button onClick={handlePlaceOrder} className="flex-1" size="lg">
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
