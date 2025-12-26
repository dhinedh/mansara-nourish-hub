import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { mockUsersList, mockOrders } from '@/data/mockUsers';
import { ArrowLeft, Package, Calendar, MapPin, Mail, Phone, ShoppingBag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const CustomerHistory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const user = mockUsersList.find(u => u.id === id);
    const userOrders = mockOrders.filter(o => o.userId === id);

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
                            Customer ID: <span className="font-mono bg-muted px-1 rounded">{user.id}</span>
                        </p>
                    </div>
                    <div className="ml-auto">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium 
                            ${user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                user.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                                    'bg-red-100 text-red-800'}`}>
                            {user.status}
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
                                <span>{user.phone}</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span>{user.address}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                            </div>

                            <hr className="border-border" />

                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-3 bg-secondary/50 rounded-lg">
                                    <div className="text-xl font-bold">{user.totalOrders}</div>
                                    <div className="text-xs text-muted-foreground">Orders</div>
                                </div>
                                <div className="p-3 bg-secondary/50 rounded-lg">
                                    <div className="text-xl font-bold">₹{user.totalSpent.toLocaleString()}</div>
                                    <div className="text-xs text-muted-foreground">Spent</div>
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

                        {userOrders.length > 0 ? (
                            <div className="space-y-4">
                                {userOrders.map((order) => (
                                    <Card key={order.id} className="overflow-hidden">
                                        <div className="bg-muted/40 p-4 flex flex-wrap items-center justify-between gap-4 border-b">
                                            <div className="flex gap-4">
                                                <div>
                                                    <span className="text-xs text-muted-foreground uppercase font-bold">Order Placed</span>
                                                    <div className="text-sm font-medium">{new Date(order.date).toLocaleDateString()}</div>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-muted-foreground uppercase font-bold">Order ID</span>
                                                    <div className="text-sm font-medium">#{order.id}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <span className="text-xs text-muted-foreground uppercase font-bold">Total</span>
                                                    <div className="text-sm font-bold">₹{order.total.toLocaleString()}</div>
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
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="p-4 flex justify-between items-center border-b last:border-0 hover:bg-gray-50/50">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 bg-secondary rounded flex items-center justify-center text-muted-foreground">
                                                            <Package className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{item.name}</div>
                                                            <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-medium">₹{item.price * item.quantity}</div>
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
