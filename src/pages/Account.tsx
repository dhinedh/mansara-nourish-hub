
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { getUserOrders, fetchUser, addAddress, updateAddress, deleteAddress } from '@/lib/api';
import {
    Package,
    MapPin,
    Settings,
    LogOut,
    LayoutDashboard,
    Truck
} from 'lucide-react';
import { mockAddresses } from '@/data/mockData';

const Account: React.FC = () => {
    const { user: contextUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'settings'>('overview');
    const [orders, setOrders] = useState<any[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null); // Store fresh user data here
    const [loading, setLoading] = useState(false);

    // Address Form State
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [addressFormData, setAddressFormData] = useState({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        zip: '',
        isDefault: false
    });

    useEffect(() => {
        if (contextUser) {
            fetchData();
        }
    }, [contextUser]);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (contextUser?.id) {
                const [ordersData, userData] = await Promise.all([
                    getUserOrders(contextUser.id),
                    fetchUser(contextUser.id)
                ]);
                setOrders(ordersData);
                setUserProfile(userData);
            }
        } catch (error: any) {
            console.error("Failed to load data", error);
            if (error.message === 'USER_NOT_FOUND') {
                logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // Use userProfile if available, else fallback to contextUser
    const displayUser = userProfile || contextUser;

    if (!displayUser) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const SidebarItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === id
                ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
                }`}
        >
            <Icon className="h-5 w-5" />
            {label}
        </button>
    );

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">

                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0 space-y-6">
                        {/* User Brief */}
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                                {displayUser.avatar ? (
                                    <img src={displayUser.avatar} alt={displayUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xl font-bold text-primary">{displayUser.name?.charAt(0)}</span>
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-heading font-bold leading-tight truncate">{displayUser.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{displayUser.email}</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            <SidebarItem id="overview" icon={LayoutDashboard} label="Overview" />
                            <SidebarItem id="orders" icon={Package} label="My Orders" />
                            <SidebarItem id="addresses" icon={MapPin} label="Addresses" />
                            <SidebarItem id="settings" icon={Settings} label="Settings" />
                        </nav>

                        <div className="pt-6 border-t border-border">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all font-medium"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8 animate-fade-in">
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-heading font-bold">Welcome back, {displayUser.name?.split(' ')[0]}!</h2>
                                    <p className="text-muted-foreground">Here's what's happening with your account today.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                                        <p className="text-blue-600 dark:text-blue-300 font-medium text-sm mb-1">Total Orders</p>
                                        <p className="text-3xl font-bold text-blue-800 dark:text-blue-100">{orders.length}</p>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800">
                                        <p className="text-green-600 dark:text-green-300 font-medium text-sm mb-1">Active Orders</p>
                                        <p className="text-3xl font-bold text-green-800 dark:text-green-100">
                                            {orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
                                        <p className="text-purple-600 dark:text-purple-300 font-medium text-sm mb-1">Saved Addresses</p>
                                        <p className="text-3xl font-bold text-purple-800 dark:text-purple-100">{displayUser.addresses?.length || 0}</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-lg">Recent Orders</h3>
                                        <Button variant="link" onClick={() => setActiveTab('orders')}>View All</Button>
                                    </div>
                                    <div className="space-y-3">
                                        {orders.length === 0 && <p className="text-muted-foreground">No orders found.</p>}
                                        {orders.slice(0, 2).map((order) => (
                                            <div key={order._id || order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-primary/10 p-2 rounded-full">
                                                        <Package className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">#{order._id?.slice(-6).toUpperCase() || order.id}</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(order.date || order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge variant="outline">{order.orderStatus}</Badge>
                                                    <span className="font-bold text-sm">₹{order.total}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-heading font-bold">My Orders</h2>
                                    <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                                        {loading ? 'Refreshing...' : 'Refresh'}
                                    </Button>
                                </div>

                                {orders.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        You haven't placed any orders yet.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order._id || order.id} className="bg-card rounded-xl border border-border overflow-hidden group hover:border-primary/50 transition-colors">
                                                <div className="p-6 bg-muted/20 border-b border-border flex flex-wrap gap-4 justify-between items-center">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-muted-foreground">ORDER PLACED</p>
                                                        <p className="font-bold">{new Date(order.date || order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-muted-foreground">TOTAL</p>
                                                        <p className="font-bold">₹{order.total}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-muted-foreground">ORDER #</p>
                                                        <p className="font-mono text-sm">#{order._id?.slice(-6).toUpperCase() || order.id}</p>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <Button size="sm" variant="outline" onClick={() => navigate(`/order-tracking/${order._id || order.id}`)}>
                                                            Track Order <Truck className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    {order.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-4 mb-4 last:mb-0">
                                                            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                                                                <Package className="h-8 w-8 text-gray-400" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold">{item.name}</p>
                                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                                <p className="text-sm font-medium text-primary mt-1">₹{item.price}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-heading font-bold">Saved Addresses</h2>
                                    <Button onClick={() => {
                                        setEditingAddressId(null);
                                        setAddressFormData({ type: 'Home', street: '', city: '', state: '', zip: '', isDefault: false });
                                        setIsAddressFormOpen(true);
                                    }}>Add New Address</Button>
                                </div>

                                {/* Address Form Modal (Inline for simplicity) */}
                                {isAddressFormOpen && (
                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                        <div className="bg-card p-6 rounded-xl w-full max-w-md shadow-xl border border-border">
                                            <h3 className="text-xl font-bold mb-4">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Type</label>
                                                    <select
                                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={addressFormData.type}
                                                        onChange={(e) => setAddressFormData({ ...addressFormData, type: e.target.value })}
                                                    >
                                                        <option value="Home">Home</option>
                                                        <option value="Work">Work</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Street Address</label>
                                                    <textarea
                                                        className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        placeholder="123 Main St..."
                                                        value={addressFormData.street}
                                                        onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">City</label>
                                                        <input
                                                            type="text"
                                                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            value={addressFormData.city}
                                                            onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">State</label>
                                                        <input
                                                            type="text"
                                                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            value={addressFormData.state}
                                                            onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">ZIP Code</label>
                                                    <input
                                                        type="text"
                                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={addressFormData.zip}
                                                        onChange={(e) => setAddressFormData({ ...addressFormData, zip: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="isDefault"
                                                        checked={addressFormData.isDefault}
                                                        onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                                                        className="h-4 w-4"
                                                    />
                                                    <label htmlFor="isDefault" className="text-sm">Set as default address</label>
                                                </div>
                                                <div className="flex justify-end gap-2 mt-6">
                                                    <Button variant="outline" onClick={() => setIsAddressFormOpen(false)}>Cancel</Button>
                                                    <Button onClick={async () => {
                                                        try {
                                                            if (editingAddressId) {
                                                                await updateAddress(contextUser!.id, editingAddressId, addressFormData);
                                                            } else {
                                                                await addAddress(contextUser!.id, addressFormData);
                                                            }
                                                            await fetchData(); // Refresh data
                                                            setIsAddressFormOpen(false);
                                                        } catch (err) {
                                                            alert('Failed to save address');
                                                        }
                                                    }}>Save Address</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(displayUser.addresses || []).map((addr: any) => (
                                        <div key={addr._id} className="border border-border rounded-xl p-6 relative hover:border-primary transition-colors">
                                            {addr.isDefault && (
                                                <span className="absolute top-4 right-4 text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                    DEFAULT
                                                </span>
                                            )}
                                            <div className="flex items-center gap-2 mb-4">
                                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                                <span className="font-bold">{addr.type}</span>
                                            </div>
                                            <p className="text-sm leading-relaxed mb-4">
                                                {addr.street}<br />
                                                {addr.city}, {addr.state}<br />
                                                {addr.zip}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => {
                                                    setEditingAddressId(addr._id);
                                                    setAddressFormData({
                                                        type: addr.type,
                                                        street: addr.street,
                                                        city: addr.city,
                                                        state: addr.state,
                                                        zip: addr.zip,
                                                        isDefault: addr.isDefault
                                                    });
                                                    setIsAddressFormOpen(true);
                                                }}>Edit</Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={async () => {
                                                        if (confirm('Are you sure you want to delete this address?')) {
                                                            await deleteAddress(contextUser!.id, addr._id);
                                                            await fetchData();
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!displayUser.addresses || displayUser.addresses.length === 0) && (
                                        <div className="col-span-full text-center py-8 text-muted-foreground border border-dashed border-border rounded-xl">
                                            No addresses saved yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-heading font-bold">Account Settings</h2>
                                <div className="max-w-md space-y-4">
                                    <div className="grid w-full items-center gap-1.5 basic-full">
                                        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={displayUser.name}
                                            onChange={(e) => setUserProfile({ ...displayUser, name: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={displayUser.email}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring opacity-70 cursor-not-allowed"
                                            readOnly
                                            title="Email cannot be changed"
                                        />
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={displayUser.phone || ''}
                                            onChange={(e) => setUserProfile({ ...displayUser, phone: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp Number (Optional)</label>
                                        <input
                                            type="tel"
                                            id="whatsapp"
                                            value={displayUser.whatsapp || ''}
                                            onChange={(e) => setUserProfile({ ...displayUser, whatsapp: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <Button
                                        onClick={async () => {
                                            try {
                                                const { updateProfile } = await import('@/lib/api');
                                                const token = localStorage.getItem('mansara-token');
                                                if (token) {
                                                    await updateProfile({
                                                        name: displayUser.name,
                                                        phone: displayUser.phone,
                                                        whatsapp: displayUser.whatsapp
                                                    }, token);
                                                    alert('Profile updated successfully!');
                                                    fetchData(); // Refresh to ensure sync
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                alert('Failed to update profile');
                                            }
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Note: Email address cannot be changed. Contact support if needed.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Account;
