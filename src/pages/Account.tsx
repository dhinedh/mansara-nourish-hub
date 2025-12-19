
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { mockOrders } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    MapPin,
    CreditCard,
    Settings,
    LogOut,
    User,
    LayoutDashboard,
    ChevronRight,
    Truck
} from 'lucide-react';
import { mockAddresses } from '@/data/mockData';

const Account: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'settings'>('overview');

    if (!user) {
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
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">

                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-6">
                    {/* User Brief */}
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="font-heading font-bold leading-tight">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</p>
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
                                <h2 className="text-2xl font-heading font-bold">Welcome back, {user.name.split(' ')[0]}!</h2>
                                <p className="text-muted-foreground">Here's what's happening with your account today.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <p className="text-blue-600 dark:text-blue-300 font-medium text-sm mb-1">Total Orders</p>
                                    <p className="text-3xl font-bold text-blue-800 dark:text-blue-100">{mockOrders.length}</p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800">
                                    <p className="text-green-600 dark:text-green-300 font-medium text-sm mb-1">Active Orders</p>
                                    <p className="text-3xl font-bold text-green-800 dark:text-green-100">{'1'}</p> {/* Mock active count */}
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
                                    <p className="text-purple-600 dark:text-purple-300 font-medium text-sm mb-1">Saved Addresses</p>
                                    <p className="text-3xl font-bold text-purple-800 dark:text-purple-100">{mockAddresses.length}</p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-lg">Recent Orders</h3>
                                    <Button variant="link" onClick={() => setActiveTab('orders')}>View All</Button>
                                </div>
                                <div className="space-y-3">
                                    {mockOrders.slice(0, 2).map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-primary/10 p-2 rounded-full">
                                                    <Package className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{order.id}</p>
                                                    <p className="text-xs text-muted-foreground">{order.date}</p>
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
                            <h2 className="text-2xl font-heading font-bold">My Orders</h2>
                            <div className="space-y-4">
                                {mockOrders.map((order) => (
                                    <div key={order.id} className="bg-card rounded-xl border border-border overflow-hidden group hover:border-primary/50 transition-colors">
                                        <div className="p-6 bg-muted/20 border-b border-border flex flex-wrap gap-4 justify-between items-center">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-muted-foreground">ORDER PLACED</p>
                                                <p className="font-bold">{order.date}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-muted-foreground">TOTAL</p>
                                                <p className="font-bold">₹{order.total}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-muted-foreground">OERDER #</p>
                                                <p className="font-mono text-sm">{order.id}</p>
                                            </div>
                                            <div className="ml-auto">
                                                <Button size="sm" variant="outline" onClick={() => navigate(`/order-tracking/${order.id.replace('#', '')}`)}>
                                                    Track Order <Truck className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            {order.items.map((item, idx) => (
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
                        </div>
                    )}

                    {activeTab === 'addresses' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-heading font-bold">Saved Addresses</h2>
                                <Button>Add New Address</Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mockAddresses.map((addr) => (
                                    <div key={addr.id} className="border border-border rounded-xl p-6 relative hover:border-primary transition-colors">
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
                                            <Button variant="outline" size="sm">Edit</Button>
                                            {!addr.isDefault && <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>}
                                        </div>
                                    </div>
                                ))}
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
                                        value={user.name}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        readOnly
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={user.email}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        readOnly
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={user.phone}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        readOnly
                                    />
                                </div>
                                <Button disabled>Save Changes</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Account;
