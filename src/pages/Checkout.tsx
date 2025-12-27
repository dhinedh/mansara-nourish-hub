import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, MapPin, Pencil, Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

interface DeliveryAddress {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine: string;
  city: string;
  pincode: string;
}

const Checkout: React.FC = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const [step, setStep] = React.useState(1);
  const [orderPlaced, setOrderPlaced] = React.useState(false);

  // Address State
  const [address, setAddress] = useState<DeliveryAddress>({
    firstName: '',
    lastName: '',
    phone: '',
    addressLine: '',
    city: '',
    pincode: ''
  });
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = () => {
    // Basic validation
    if (!address.firstName || !address.phone || !address.addressLine || !address.pincode) {
      alert("Please fill in all required fields");
      return;
    }
    setIsAddressSaved(true);
    setIsEditing(false);
  };

  const handleEditAddress = () => {
    setIsEditing(true);
  };

  const handleAddNewAddress = () => {
    setAddress({
      firstName: '',
      lastName: '',
      phone: '',
      addressLine: '',
      city: '',
      pincode: ''
    });
    setIsEditing(true);
    setIsAddressSaved(false);
  };

  const handleDeliverHere = () => {
    setStep(2);
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <Layout>
        <section className="py-20 bg-background">
          <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto text-center max-w-lg mx-auto">
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
          <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto text-center">
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step > index + 1 ? 'bg-accent text-accent-foreground' :
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

              {!isAddressSaved || isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={address.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={address.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <textarea
                      name="addressLine"
                      value={address.addressLine}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={address.pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                        required
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveAddress} className="w-full mt-6" size="lg">
                    Save Address
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{address.firstName} {address.lastName}</h3>
                      <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold">
                        HOME
                      </div>
                    </div>
                    <p className="text-slate-600 mb-1">{address.addressLine}</p>
                    <p className="text-slate-600 mb-1">{address.city} - {address.pincode}</p>
                    <p className="text-slate-800 font-medium mt-2">Mobile: {address.phone}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button onClick={handleDeliverHere} className="w-full" size="lg">
                      Deliver Here
                    </Button>
                    <div className="flex gap-3">
                      <Button onClick={handleEditAddress} variant="outline" className="flex-1 gap-2">
                        <Pencil size={16} /> Edit Address
                      </Button>
                      <Button onClick={handleAddNewAddress} variant="outline" className="flex-1 gap-2">
                        <Plus size={16} /> Add New Address
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Delivery Address Summary */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-heading text-xl font-bold text-brand-blue">Delivery to:</h2>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-primary hover:text-primary/80">
                    Change
                  </Button>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{address.firstName} {address.lastName}</p>
                    <p>{address.addressLine}, {address.city} - {address.pincode}</p>
                    <p>Phone: {address.phone}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-heading text-xl font-bold text-brand-blue mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {items.map(item => {
                    // Calculate delivery date (today + 3-5 days)
                    const today = new Date();
                    const deliveryDate = new Date(today);
                    deliveryDate.setDate(today.getDate() + 4);

                    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
                    const formattedDate = deliveryDate.toLocaleDateString('en-US', options);

                    return (
                      <div key={item.id} className="flex justify-between items-start py-4 border-b border-border">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded bg-slate-100 overflow-hidden shrink-0 border border-border">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1 text-base">{item.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                            <div className="mt-2 text-sm flex items-center flex-wrap gap-x-2">
                              <span className="font-medium text-slate-900">Delivery by {formattedDate}</span>
                              <span className="text-slate-300">|</span>
                              <span className="text-green-600 font-medium">Free Delivery</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground mt-1">₹{item.price} each</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center pt-4 font-heading font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-brand-blue">₹{getCartTotal().toFixed(2)}</span>
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
            </div>
          )}

          {step === 3 && (
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="font-heading text-xl font-bold text-brand-blue mb-6">Payment</h2>
              <div className="space-y-4 mb-6">
                <div className="p-4 border border-primary rounded-lg bg-primary/5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-primary" />
                    <div>
                      <span className="font-medium block">Cash on Delivery</span>
                      <span className="text-sm text-muted-foreground">Pay when you receive your order</span>
                    </div>
                  </label>
                </div>
                <div className="p-4 border border-border rounded-lg opacity-60">
                  <label className="flex items-center gap-3 cursor-not-allowed">
                    <input type="radio" name="payment" disabled className="w-5 h-5 accent-primary" />
                    <div>
                      <span className="font-medium block">Online Payment</span>
                      <span className="text-sm text-muted-foreground">Currently unavailable</span>
                    </div>
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
