
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockOrders, Order } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, ArrowLeft, Phone, BadgeCheck, PackageCheck, Truck, Home } from 'lucide-react';

const OrderTracking: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | undefined>(undefined);

    useEffect(() => {
        // In a real app we'd fetch from API
        // Since mock ID might not match exactly due to '#' prefix handling in URL
        const foundOrder = mockOrders.find(o => o.id === `#${orderId}` || o.id === orderId);
        setOrder(foundOrder);
    }, [orderId]);

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-xl">Order not found</h2>
                <Button onClick={() => navigate('/orders')} className="mt-4">Back to Orders</Button>
            </div>
        );
    }

    const getStepIcon = (status: string) => {
        switch (status) {
            case 'Ordered': return <BadgeCheck className="w-5 h-5" />;
            case 'Processing': return <PackageCheck className="w-5 h-5" />;
            case 'Shipped': return <Truck className="w-5 h-5" />;
            case 'Out for Delivery': return <Truck className="w-5 h-5" />;
            case 'Delivered': return <Home className="w-5 h-5" />;
            default: return <Circle className="w-5 h-5" />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-heading font-bold">Track Order</h1>
                </div>

                {/* Order Summary */}
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border mb-8">
                    <div className="flex flex-wrap justify-between gap-6">
                        <div>
                            <p className="text-muted-foreground text-sm">Order ID</p>
                            <p className="font-bold">{order.id}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm">Order Date</p>
                            <p className="font-bold">{order.date}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm">Total Amount</p>
                            <p className="font-bold">₹{order.total}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm">Payment Method</p>
                            <p className="font-bold">{order.paymentMethod}</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-muted-foreground text-sm mb-2">Delivery Address</p>
                        <div className="font-medium">
                            <p>{order.deliveryAddress.street}</p>
                            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zip}</p>
                        </div>
                    </div>
                </div>

                {/* Tracking Timeline */}
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <h3 className="font-bold text-lg mb-6">Order Status</h3>
                    <div className="relative pl-4 md:pl-0">
                        {order.trackingSteps.map((step, index) => (
                            <div key={index} className="flex gap-4 pb-8 last:pb-0 relative">
                                {/* Connecting Line */}
                                {index < order.trackingSteps.length - 1 && (
                                    <div className={`absolute left-[19px] top-8 bottom-0 w-0.5 ${step.completed ? 'bg-green-500' : 'bg-muted'}`} />
                                )}

                                {/* Step Icon */}
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 
                            ${step.completed
                                        ? 'bg-green-100 border-green-500 text-green-600'
                                        : 'bg-muted/50 border-muted text-muted-foreground'}`}>
                                    {step.completed ? <CheckCircle2 className="w-6 h-6" /> : getStepIcon(step.status)}
                                </div>

                                {/* Step Details */}
                                <div className="flex-1 pt-1">
                                    <h4 className={`font-bold ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {step.status}
                                    </h4>
                                    {step.completed && step.date && (
                                        <p className="text-xs text-muted-foreground mt-0.5">{step.date}</p>
                                    )}
                                    {/* Descriptive text based on status */}
                                    <p className="text-sm mt-1 text-muted-foreground">
                                        {step.status === 'Ordered' && 'Your order has been placed successfully'}
                                        {step.status === 'Processing' && 'Items are packed and ready to ship'}
                                        {step.status === 'Shipped' && 'Your order is on the way'}
                                        {step.status === 'Out for Delivery' && 'Your order is out for delivery'}
                                        {step.status === 'Delivered' && 'Order delivered successfully'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Tracking / Support stub */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-4 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600 dark:bg-blue-800 dark:text-blue-200">
                            <Truck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Estimated Delivery</p>
                            <p className="text-xs text-muted-foreground">Today by 7:00 PM</p>
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg flex items-center gap-4 border border-green-100 cursor-pointer hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800">
                        <div className="bg-green-100 p-2 rounded-full text-green-600 dark:bg-green-800 dark:text-green-200">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Need Help?</p>
                            <p className="text-xs text-muted-foreground">Contact Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
