import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Pencil, Plus, Loader2, MessageSquare, CreditCard } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder, createPaymentOrder, verifyPayment } from '@/lib/api';
import { toast } from 'sonner';

interface DeliveryAddress {
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp: string;
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
  const [placedOrderId, setPlacedOrderId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('Online');

  // Address State
  const [address, setAddress] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    whatsapp: string;
    addressLine: string;
    city: string;
    state: string; // Added state field
    pincode: string;
    email: string; // Add email if it's missing in type
  }>({
    firstName: user?.name || '',
    lastName: '',
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    addressLine: '',
    city: '',
    state: 'Tamil Nadu', // Default to Tamil Nadu
    pincode: '',
    email: user?.email || ''
  });




  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
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

          // Construct base contact info from fresh user data
          const baseContactInfo = {
            firstName: userData.name || '',
            phone: userData.phone || '',
            whatsapp: userData.whatsapp || ''
          };

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
              state: defaultAddress.state || 'Tamil Nadu',
              pincode: defaultAddress.zip || '',
              email: userData.email || user?.email || ''
            });

            setIsEditing(false);
            setIsAddressSaved(true);
            setEditingAddressId(null);
          } else {
            setAddress(prev => ({
              ...prev,
              ...baseContactInfo
            }));
            setIsEditing(true);
            setEditingAddressId(null);
          }
        } catch (error) {
          console.error("Failed to load user addresses", error);
        }
      }
    };

    loadUserAddress();
  }, [isAuthenticated, navigate, user?.id]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectAddress = (addr: any) => {
    setAddress(prev => ({
      ...prev,
      addressLine: addr.street,
      city: addr.city,
      state: addr.state || 'Tamil Nadu',
      pincode: addr.zip
    }));
  };

  const handleEditExistingAddress = (addr: any) => {
    setEditingAddressId(addr._id);
    setAddress(prev => ({
      ...prev,
      addressLine: addr.street,
      city: addr.city,
      state: addr.state || 'Tamil Nadu',
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

    // Validate phone number
    if (address.phone.replace(/\D/g, '').length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsProcessing(true);
    try {
      const { addAddress, updateAddress } = await import('@/lib/api');

      // Prepare address object for backend
      const addressData = {
        street: address.addressLine,
        city: address.city,
        state: address.state || 'Tamil Nadu',
        zip: address.pincode,
        type: 'Home',
        isDefault: savedAddresses.length === 0
      };

      let updatedUser;
      if (editingAddressId) {
        updatedUser = await updateAddress(user!.id, editingAddressId, addressData);
      } else {
        updatedUser = await addAddress(user!.id, addressData);
      }

      if (updatedUser && updatedUser.addresses) {
        setSavedAddresses(updatedUser.addresses);
      }

      setIsAddressSaved(true);
      setIsEditing(false);
      setEditingAddressId(null);
      setStep(2);
      toast.success(editingAddressId ? "Address updated and selected!" : "Address saved and selected!");

    } catch (error) {
      console.error("Failed to save address", error);
      toast.error("Failed to save address. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddNewAddress = () => {
    setAddress(prev => ({
      ...prev,
      addressLine: '',
      city: '',
      state: 'Tamil Nadu',
      pincode: ''
    }));
    setEditingAddressId(null);
    setIsEditing(true);
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!address.phone) {
      toast.error("Phone number is required");
      return;
    }

    if (!address.addressLine || !address.pincode) {
      toast.error("Please complete your delivery address");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('mansara-token');
      if (!token) {
        toast.error("Please login to continue");
        navigate('/login');
        return;
      }

      // Sync Profile Data (Phone/WhatsApp) if changed
      const { updateProfile } = await import('@/lib/api');
      try {
        await updateProfile({
          name: address.firstName,
          phone: address.phone,
          whatsapp: address.whatsapp || address.phone
        }, token);
      } catch (err) {
        console.warn("Could not sync profile data", err);
      }

      const totalAmount = getCartTotal();

      // ==========================================
      // RAZORPAY PAYMENT FLOW
      // ==========================================
      let paymentInfo = null;

      if (paymentMethod === 'Online') {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          toast.error("Razorpay SDK failed to load. Check your internet connection.");
          setIsProcessing(false);
          return;
        }

        try {
          // 1. Create Razorpay Order
          const orderData = await createPaymentOrder(totalAmount);

          // 2. Open Razorpay Checktout
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder", // Replace with env var in real app
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Mansara Foods",
            description: "Healthy Living, Naturally",
            image: "https://mansarafoods.com/logo.png", // Add logo url
            order_id: orderData.id,
            handler: async function (response: any) {
              try {
                // 3. Verify Payment
                await verifyPayment(response);

                // 4. Place Order (Success Callback)
                paymentInfo = {
                  id: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  status: 'Paid'
                };

                await finalizeOrderPlacement(token, paymentInfo);
              } catch (err: any) {
                toast.error("Payment verification failed. Please contact support if money was deducted.");
                console.error(err);
                setIsProcessing(false);
              }
            },
            prefill: {
              name: `${address.firstName} ${address.lastName}`,
              email: user?.email,
              contact: address.phone
            },
            notes: {
              address: `${address.addressLine}, ${address.city}`
            },
            theme: {
              color: "#1F2A7C"
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
                toast.info("Payment cancelled");
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
          return; // Wait for handler to complete

        } catch (err: any) {
          console.error("Payment initialization failed", err);
          toast.error("Failed to initialize payment. Please try again.");
          setIsProcessing(false);
          return;
        }
      }

      // COD Flow
      await finalizeOrderPlacement(token, null);

    } catch (error: any) {
      console.error('[Checkout] Order placement failed:', error);
      toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  const finalizeOrderPlacement = async (token: string, paymentInfo: any) => {
    try {
      const orderData = {
        items: items.map(item => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: getCartTotal(),
        paymentMethod: paymentMethod === 'Online' ? 'Online Payment (Razorpay)' : 'Cash on Delivery',
        paymentInfo: paymentInfo,
        deliveryAddress: {
          firstName: address.firstName,
          lastName: address.lastName || '',
          street: address.addressLine,
          city: address.city,
          zip: address.pincode,
          state: address.state || 'Tamil Nadu',
          phone: address.phone,
          whatsapp: address.whatsapp || address.phone
        }
      };

      console.log('[Checkout] Placing order:', orderData);

      const response = await createOrder(orderData, token);

      console.log('[Checkout] Order placed successfully:', response);

      setPlacedOrderId(response.orderId || response._id);
      setOrderPlaced(true);
      clearCart();

      toast.success("Order placed successfully! Check your WhatsApp for confirmation.");
    } catch (error: any) {
      console.error('[Checkout] Order placement failed:', error);
      toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <Layout>
        <section className="py-20 bg-background">
          <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-brand-blue mb-4">
                Order Placed Successfully!
              </h1>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900 mb-2">
                  <strong>Order ID:</strong> {placedOrderId}
                </p>
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <MessageSquare className="h-5 w-5" />
                  <p className="text-sm font-medium">
                    Confirmation sent to your WhatsApp
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-2">
                Thank you for your order! We'll confirm it shortly and send you updates via WhatsApp.
              </p>
              <p className="text-sm text-slate-600 mb-8">
                You can track your order status in the Orders section.
              </p>
              <div className="flex gap-3 justify-center">
                <Link to="/orders">
                  <Button variant="outline" size="lg">
                    View Orders
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="default" size="lg">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
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
                  step === index + 1 ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
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
                      <div
                        key={index}
                        className={`p-4 border rounded-lg relative ${address.addressLine === addr.street && address.pincode === addr.zip
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                          }`}
                      >
                        {addr.isDefault && (
                          <div className="absolute top-2 right-2 bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold">
                            Default
                          </div>
                        )}
                        <h3 className="font-bold text-lg mb-1">{user?.name}</h3>
                        <p className="text-slate-600 text-sm">{addr.street}</p>
                        <p className="text-slate-600 text-sm">{addr.city} - {addr.zip}</p>
                        {addr.state && <p className="text-slate-600 text-sm mt-1">{addr.state}</p>}

                        <div className="mt-3 pt-3 border-t border-dashed">
                          <p className="text-xs text-muted-foreground font-medium">Contact:</p>
                          <p className="text-sm">{address.phone || user?.phone || 'No phone set'}</p>
                          {(address.whatsapp || user?.whatsapp) && (
                            <p className="text-sm text-green-600 flex items-center gap-1">
                              <MessageSquare size={14} />
                              <span>{address.whatsapp || user?.whatsapp}</span>
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button
                            className="flex-1"
                            variant={
                              address.addressLine === addr.street && address.pincode === addr.zip
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handleSelectAddress(addr)}
                          >
                            {address.addressLine === addr.street && address.pincode === addr.zip
                              ? "Selected"
                              : "Deliver Here"}
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

                  <Button
                    onClick={handleAddNewAddress}
                    variant="outline"
                    className="w-full gap-2 border-dashed"
                  >
                    <Plus size={16} /> Add New Address
                  </Button>

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
                      placeholder="9876543210"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <MessageSquare size={16} className="text-green-600" />
                      WhatsApp Number (For Order Updates)
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={address.whatsapp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                      placeholder="9876543210 (will use phone if not provided)"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      You'll receive order updates via WhatsApp
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <textarea
                      name="addressLine"
                      value={address.addressLine}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                      rows={3}
                      placeholder="House no., Building name, Street"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                        required
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
                        placeholder="600001"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                      placeholder="Tamil Nadu"
                      required
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    {savedAddresses.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      onClick={handleSaveAddress}
                      className="flex-1"
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                          Saving...
                        </>
                      ) : (
                        'Save & Deliver Here'
                      )}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(1)}
                    className="text-primary hover:text-primary/80"
                  >
                    Change
                  </Button>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">
                      {address.firstName} {address.lastName}
                    </p>
                    <p>{address.addressLine}, {address.city} - {address.pincode}</p>
                    <p className="mt-1">Phone: {address.phone}</p>
                    {address.whatsapp && (
                      <p className="text-green-600 flex items-center gap-1 mt-1">
                        <MessageSquare size={14} />
                        WhatsApp: {address.whatsapp}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-heading text-xl font-bold text-brand-blue mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {items.map(item => {
                    const today = new Date();
                    const deliveryDate = new Date(today);
                    deliveryDate.setDate(today.getDate() + 4);

                    const options: Intl.DateTimeFormatOptions = {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    };
                    const formattedDate = deliveryDate.toLocaleDateString('en-US', options);

                    return (
                      <div key={item.id} className="flex justify-between items-start py-4 border-b border-border">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded bg-slate-100 overflow-hidden shrink-0 border border-border">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1 text-base">{item.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                            <div className="mt-2 text-sm flex items-center flex-wrap gap-x-2">
                              <span className="font-medium text-slate-900">
                                Delivery by {formattedDate}
                              </span>
                              <span className="text-slate-300">|</span>
                              <span className="text-green-600 font-medium">Free Delivery</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              ₹{item.price} each
                            </p>
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
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="flex-1"
                    size="lg"
                  >
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

                {/* ONLINE PAYMENT (Default & Only Option) */}
                <div className={`p-4 border rounded-lg ${paymentMethod === 'Online' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="Online"
                      checked={paymentMethod === 'Online'}
                      onChange={() => setPaymentMethod('Online')}
                      className="w-5 h-5 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium block">Pay via UPI / Online</span>
                        <div className="flex gap-2">
                          <CreditCard size={20} className="text-gray-500" />
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Google Pay, PhonePe, Paytm, Cards, Netbanking
                      </span>
                    </div>
                  </label>
                </div>

                {/* COD DISABLED */}
                <div className="p-4 border border-border rounded-lg opacity-50 bg-slate-50">
                  <label className="flex items-center gap-3 cursor-not-allowed">
                    <input
                      type="radio"
                      name="payment"
                      disabled
                      className="w-5 h-5 accent-slate-300"
                    />
                    <div>
                      <span className="font-medium block text-slate-500">Cash on Delivery</span>
                      <span className="text-sm text-red-500 flex items-center gap-1">
                        Currently Unavailable
                      </span>
                    </div>
                  </label>
                </div>

              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">WhatsApp Notifications</p>
                    <p>You'll receive order confirmation and updates on:</p>
                    <p className="font-medium mt-1">{address.whatsapp || address.phone}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Back
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  className="flex-1"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    paymentMethod === 'Online' ? 'Pay & Place Order' : 'Place Order'
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