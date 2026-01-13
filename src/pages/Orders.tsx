import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserOrders } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, ChevronRight, ArrowLeft } from 'lucide-react';
import ReviewModal from '@/components/reviews/ReviewModal';

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [orders, setOrders] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    // Review Modal State
    const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
    const [reviewProduct, setReviewProduct] = React.useState<{ id: string, name: string, image: string } | null>(null);

    const handleOpenReview = (product: any) => {
        setReviewProduct({
            id: product.product || product._id || product.id,
            name: product.name,
            image: product.image
        });
        setIsReviewModalOpen(true);
    };

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                if (user?.id) {
                    const data = await getUserOrders(user.id);
                    setOrders(data);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, user, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/account')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-heading font-bold">My Orders</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium">No orders found</h3>
                        <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                        <Button onClick={() => navigate('/products')}>Start Shopping</Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id || order.id} className="bg-card rounded-xl shadow-sm border border-border p-5 transition-all hover:shadow-md">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono font-bold text-lg">#{order.orderId || (order._id ? order._id.slice(-6).toUpperCase() : order.id)}</span>
                                            <Badge variant={order.orderStatus === 'Delivered' ? 'default' : 'secondary'}>
                                                {order.orderStatus}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Placed on {new Date(order.createdAt || order.date).toLocaleDateString()}
                                        </p>
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
                                        <div className="space-y-2 flex-grow">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded hover:bg-muted/30">
                                                    <p className="text-sm">
                                                        {item.quantity}x <span className="font-medium text-foreground">{item.name}</span>
                                                    </p>
                                                    {order.orderStatus === 'Delivered' && (
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            className="h-auto p-0 text-primary"
                                                            onClick={() => handleOpenReview(item)}
                                                        >
                                                            Write Review
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button onClick={() => navigate(`/order-tracking/${order.orderId || order._id || order.id}`)}>
                                                Track Order <ChevronRight className="ml-1 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {reviewProduct && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    productId={reviewProduct.id}
                    productName={reviewProduct.name}
                    productImage={reviewProduct.image}
                />
            )}
        </div>
    );
};

export default Orders;
