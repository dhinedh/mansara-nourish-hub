import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Pencil, Plus, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/api';
import { toast } from 'sonner';

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
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [orderPlaced, setOrderPlaced] = React.useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Address State
  const [address, setAddress] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    whatsapp: string;
    addressLine: string;
    city: string;
    pincode: string;
  }>({
    firstName: user?.name || '',
    lastName: '',
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    addressLine: '',
    city: '',
    pincode: ''
  });
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(true); // Now controls "List View" (false) vs "Form View" (true) if addresses exist
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    // Fetch user details to get addresses
    const loadUserAddress = async () => {
      if (user?.id) {
        try {
          const { fetchUser } = await import('@/lib/api');
          const userData = await fetchUser(user.id);

          if (userData.addresses && userData.addresses.length > 0) {
            setSavedAddresses(userData.addresses);

            // Find default address or use the first one
            const defaultAddress = userData.addresses.find((addr: any) => addr.isDefault) || userData.addresses[0];

            setAddress({
              firstName: userData.name || '',
              lastName: '',
              phone: userData.phone || '',
              whatsapp: userData.whatsapp || '',
              addressLine: defaultAddress.street || '',
              city: defaultAddress.city || '',
              pincode: defaultAddress.zip || ''
            });

            // If we have addresses, default to List View
            setIsEditing(false);
            setIsAddressSaved(true);
            setEditingAddressId(null); // Not editing any specific address initially
          } else {
            // No addresses, show form
            setIsEditing(true);
            setEditingAddressId(null); // Not editing any specific address
          }
        } catch (error) {
          console.error("Failed to load user addresses", error);
        }
      }
    };

    loadUserAddress();
  }, [isAuthenticated, navigate, user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectAddress = (addr: any) => {
    setAddress(prev => ({
      ...prev,
      addressLine: addr.street,
      city: addr.city,
      pincode: addr.zip
      // Keep name/phone/whatsapp as currently set or from user profile, don't overwrite with blank if not in addr
    }));
  };

  const handleEditExistingAddress = (addr: any) => {
    setEditingAddressId(addr._id);
    setAddress(prev => ({
      ...prev,
      addressLine: addr.street,
      city: addr.city,
      pincode: addr.zip
    }));
    setIsEditing(true);
  };

  const handleSaveAddress = async () => {
    // Basic validation
    if (!address.firstName || !address.phone || !address.addressLine || !address.pincode) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    try {
      const { addAddress, updateAddress } = await import('@/lib/api');

      // Prepare address object for backend
      const addressData = {
        street: address.addressLine,
        city: address.city,
        state: '', // Add state input if needed
        zip: address.pincode,
        type: 'Home', // Default
        isDefault: savedAddresses.length === 0 // Make default if it's the first one
      };

      let updatedUser;
      if (editingAddressId) {
        updatedUser = await updateAddress(user!.id, editingAddressId, addressData);
      } else {
        updatedUser = await addAddress(user!.id, addressData);
      }

      // Update local list with the newly returned addresses
      if (updatedUser && updatedUser.addresses) {
        setSavedAddresses(updatedUser.addresses);
      }

      setIsAddressSaved(true);
      setIsEditing(false); // Go back to list view
      setEditingAddressId(null); // Reset edit state
      setStep(2); // Auto-advance to next step
      toast.success(editingAddressId ? "Address updated and selected!" : "Address saved and selected!");

    } catch (error) {
      console.error("Failed to save address", error);
      toast.error("Failed to save address. Continuing to payment.");
      setStep(2); // Allow continuing even if save fails, or handle error
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditAddress = () => {
    setIsEditing(true);
  };

  const handleAddNewAddress = () => {
    // Keep name/phone/whatsapp, just clear address fields
    setAddress(prev => ({
      ...prev,
      addressLine: '',
      city: '',
      pincode: ''
    }));
    setEditingAddressId(null); // Ensure we are in "add mode"
    setIsEditing(true); // Show form
  };

  const handleDeliverHere = () => {
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!address.phone) {
      toast.error("Phone number is required");
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('mansara-token');
      if (!token) throw new Error("No auth token found");

      // Sync Profile Data (Phone/WhatsApp) if changed
      const { updateProfile } = await import('@/lib/api');
      try {
        await updateProfile({
          name: address.firstName, // Update name if changed
          phone: address.phone,
          whatsapp: address.whatsapp
        }, token);
      } catch (err) {
        console.warn("Could not sync profile data", err);
      }

      const orderData = {
        items: items.map(item => ({
          product: item.id, // Assuming item.id is the product ID
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: getCartTotal(),
        paymentMethod: 'Cash on Delivery',
        deliveryAddress: {
          firstName: address.firstName,
          lastName: address.lastName,
          street: address.addressLine,
          city: address.city,
          zip: address.pincode,
          state: '', // Add state if needed
          phone: address.phone,
          whatsapp: address.whatsapp
        }
      };

      await createOrder(orderData, token);

      setOrderPlaced(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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

              {savedAddresses.length > 0 && !isEditing ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {savedAddresses.map((addr, index) => (
                      <div key={index} className={`p-4 border rounded-lg relative ${address.addressLine === addr.street && address.pincode === addr.zip ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        {addr.isDefault && (
                          <div className="absolute top-2 right-2 bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold">
                            Default
                          </div>
                        )}
                        <h3 className="font-bold text-lg mb-1">{user?.name}</h3>
                        <p className="text-slate-600 text-sm">{addr.street}</p>
                        <p className="text-slate-600 text-sm">{addr.city} - {addr.zip}</p>
                        <p className="text-slate-600 text-sm mt-1">{addr.state}</p>

                        <div className="flex gap-2 mt-3">
                          <Button
                            className="flex-1"
                            variant={address.addressLine === addr.street && address.pincode === addr.zip ? "default" : "outline"}
                            onClick={() => handleSelectAddress(addr)}
                          >
                            {address.addressLine === addr.street && address.pincode === addr.zip ? "Selected" : "Deliver Here"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditExistingAddress(addr);
                            }}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Pencil size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleAddNewAddress} variant="outline" className="w-full gap-2 border-dashed">
                    <Plus size={16} /> Add New Address
                  </Button>

                  {/* Only show Continue if an address is selected (which implies address state is populated) */}
                  <Button onClick={() => setStep(2)} className="w-full mt-4" size="lg">
                    Continue with Selected Address
                  </Button>
                </div>
              ) : (
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
                    <label className="block text-sm font-medium mb-2">WhatsApp Number (Optional)</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={address.whatsapp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                      placeholder="For order updates"
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
                  <div className="flex gap-3 mt-6">
                    {savedAddresses.length > 0 && (
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                        Cancel
                      </Button>
                    )}
                    <Button onClick={handleSaveAddress} className="flex-1" size="lg" disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="animate-spin mr-2" /> : null}
                      Save & Deliver Here
                    </Button>
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
                <Button onClick={handlePlaceOrder} className="flex-1" size="lg" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
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
