
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockOrders } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, ChevronRight, ArrowLeft } from 'lucide-react';

const Orders: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/account')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-heading font-bold">My Orders</h1>
                </div>

                <div className="space-y-4">
                    {mockOrders.map((order) => (
                        <div key={order.id} className="bg-card rounded-xl shadow-sm border border-border p-5 transition-all hover:shadow-md">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-mono font-bold text-lg">{order.id}</span>
                                        <Badge variant={order.orderStatus === 'Delivered' ? 'default' : 'secondary'}>
                                            {order.orderStatus}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-xl">₹{order.total}</p>
                                    <div className="flex items-center gap-2 mt-1 md:justify-end">
                                        <span className={`w-2 h-2 rounded-full ${order.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className="text-sm font-medium">{order.paymentStatus}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                    <div className="space-y-1">
                                        {order.items.map((item, idx) => (
                                            <p key={idx} className="text-sm">
                                                {item.quantity}x <span className="font-medium text-foreground">{item.name}</span>
                                            </p>
                                        ))}
                                    </div>
                                    <Button onClick={() => navigate(`/order-tracking/${order.id.replace('#', '')}`)}>
                                        Track Order <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;
