import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Calendar, MapPin, Mail, Phone, ShoppingBag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fetchUser, getUserOrders } from '@/lib/api';
import { toast } from 'sonner';

const CustomerHistory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                // Fetch user and orders in parallel
                const [userData, ordersData] = await Promise.all([
                    fetchUser(id),
                    getUserOrders(id)
                ]);
                setUser(userData);
                setOrders(ordersData);
            } catch (error) {
                console.error('Failed to load customer data', error);
                toast.error('Failed to load customer history');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-muted-foreground">Loading customer history...</div>
                </div>
            </AdminLayout>
        );
    }

    if (!user) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <h2 className="text-2xl font-bold mb-4">Customer Not Found</h2>
                    <Button onClick={() => navigate('/admin/customers')}>Back to Customers</Button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8 pb-10">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate('/admin/customers')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            Customer ID: <span className="font-mono bg-muted px-1 rounded">{user._id}</span>
                        </p>
                    </div>
                    <div className="ml-auto">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium 
                            ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                            {user.isAdmin ? 'Admin' : 'Customer'}
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* User Profile Card */}
                    <Card className="md:col-span-1 h-fit">
                        <CardHeader>
                            <CardTitle className="text-lg">Customer Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">{user.email}</a>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{user.phone || 'No phone provided'}</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div className="space-y-1">
                                    {user.addresses && user.addresses.length > 0 ? (
                                        user.addresses.map((addr: any, idx: number) => (
                                            <div key={idx} className="mb-2 last:mb-0">
                                                <div className="font-medium">{addr.type}</div>
                                                <div className="text-muted-foreground">{addr.street}, {addr.city}</div>
                                                <div className="text-muted-foreground">{addr.state}, {addr.zipCode}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <span>No addresses saved</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>

                            <hr className="border-border" />

                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-3 bg-secondary/50 rounded-lg">
                                    <div className="text-xl font-bold">{orders.length}</div>
                                    <div className="text-xs text-muted-foreground">Orders</div>
                                </div>
                                <div className="p-3 bg-secondary/50 rounded-lg">
                                    <div className="text-xl font-bold">
                                        ₹{orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Total Spent</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order History */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" />
                            Order History
                        </h2>

                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <Card key={order._id} className="overflow-hidden">
                                        <div className="bg-muted/40 p-4 flex flex-wrap items-center justify-between gap-4 border-b">
                                            <div className="flex gap-4">
                                                <div>
                                                    <span className="text-xs text-muted-foreground uppercase font-bold">Order Placed</span>
                                                    <div className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-muted-foreground uppercase font-bold">Order ID</span>
                                                    <div className="text-sm font-medium">#{order._id.substring(0, 8)}...</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <span className="text-xs text-muted-foreground uppercase font-bold">Total</span>
                                                    <div className="text-sm font-bold">₹{(order.totalAmount || 0).toLocaleString()}</div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                                                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'}`}>
                                                    {order.status}
                                                </div>
                                            </div>
                                        </div>
                                        <CardContent className="p-0">
                                            {order.items && order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="p-4 flex justify-between items-center border-b last:border-0 hover:bg-gray-50/50">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 bg-secondary rounded flex items-center justify-center text-muted-foreground">
                                                            <Package className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{item.product?.name || item.combo?.name || 'Unknown Item'}</div>
                                                            <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="p-12 text-center text-muted-foreground">
                                <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <h3 className="text-lg font-medium text-foreground">No Orders Yet</h3>
                                <p>This customer hasn't placed any orders yet.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CustomerHistory;
