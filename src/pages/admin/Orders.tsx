import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { PermissionGate } from "@/components/PermissionGate";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, MessageCircle, Loader2, Package, Truck, CheckCircle, XCircle, Star, Send, Trash2 } from "lucide-react";
import api from '@/lib/api';

interface Order {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
  };
  items: Array<{
    product: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentStatus: string;
  paymentMethod: string;
  orderStatus: string;
  deliveryAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    whatsapp: string;
  };
  estimatedDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
  feedbackStatus?: 'Pending' | 'Received' | 'Not Received';
}

const AdminOrders = () => {
  return () => clearInterval(interval);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('mansara-token');
    if (!token) {
      toast.error("Please login to continue");
      return;
    }

    const response = await api.get('/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Fetched Orders:", response.data);
    setOrders(response.data.orders || response.data);
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    toast.error(error.response?.data?.message || "Failed to fetch orders");
  } finally {
    setLoading(false);
  }
};

const handleConfirmOrder = async (order: Order) => {
  if (order.orderStatus !== 'Ordered') {
    toast.error("Only orders with 'Ordered' status can be confirmed");
    return;
  }

  setConfirmingOrderId(order._id);

  try {
    const token = localStorage.getItem('mansara-token');

    // Calculate delivery date (4 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);

    const response = await api.put(
      `/orders/${order._id}/confirm`,
      { estimatedDeliveryDate: deliveryDate.toISOString() },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success('Order confirmed! Customer notified via WhatsApp');

    // Update local state
    setOrders(prev => prev.map(o =>
      o._id === order._id ? { ...o, ...response.data } : o
    ));

    if (selectedOrder?._id === order._id) {
      setSelectedOrder(response.data);
    }

    await fetchOrders(); // Refresh to get latest data
  } catch (error: any) {
    console.error('Failed to confirm order:', error);
    toast.error(error.response?.data?.message || 'Failed to confirm order');
  } finally {
    setConfirmingOrderId(null);
  }
};

const handleUpdateStatus = async (orderId: string, newStatus: string) => {
  setUpdatingStatusId(orderId);

  try {
    const token = localStorage.getItem('mansara-token');

    const response = await api.put(
      `/orders/${orderId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(`Order status updated to ${newStatus}. Customer notified via WhatsApp`);

    // Update local state
    setOrders(prev => prev.map(o =>
      o._id === orderId ? { ...o, ...response.data } : o
    ));

    if (selectedOrder?._id === orderId) {
      setSelectedOrder(response.data);
    }

    await fetchOrders();
  } catch (error: any) {
    console.error('Failed to update status:', error);
    toast.error(error.response?.data?.message || 'Failed to update order status');
  } finally {
    setUpdatingStatusId(null);
  }
};

const handleUpdateFeedback = async (orderId: string, status: 'Received' | 'Not Received') => {
  try {
    const token = localStorage.getItem('mansara-token');
    await api.put(
      `/orders/${orderId}/feedback`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(`Feedback marked as ${status}`);

    // Refresh orders to reflect changes (e.g. auto-close)
    await fetchOrders();

    // Update selected order if open
    if (selectedOrder?._id === orderId) {
      // Fetch updated single order or just patch local
      // Re-fetch list is safer for side effects like status change
      const updatedList = await api.get('/orders', { headers: { Authorization: `Bearer ${token}` } });
      const updatedOrder = (updatedList.data.orders || updatedList.data).find((o: Order) => o._id === orderId);
      if (updatedOrder) setSelectedOrder(updatedOrder);
    }
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('mansara-token');
    if (!token) {
      toast.error("Please login to continue");
      return;
    }

    const response = await api.get('/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Fetched Orders:", response.data);
    setOrders(response.data.orders || response.data);
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    toast.error(error.response?.data?.message || "Failed to fetch orders");
  } finally {
    setLoading(false);
  }
};

const handleConfirmOrder = async (order: Order) => {
  if (order.orderStatus !== 'Ordered') {
    toast.error("Only orders with 'Ordered' status can be confirmed");
    return;
  }

  setConfirmingOrderId(order._id);

  try {
    const token = localStorage.getItem('mansara-token');

    // Calculate delivery date (4 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);

    const response = await api.put(
      `/orders/${order._id}/confirm`,
      { estimatedDeliveryDate: deliveryDate.toISOString() },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success('Order confirmed! Customer notified via WhatsApp');

    // Update local state
    setOrders(prev => prev.map(o =>
      o._id === order._id ? { ...o, ...response.data } : o
    ));

    if (selectedOrder?._id === order._id) {
      setSelectedOrder(response.data);
    }

    await fetchOrders(); // Refresh to get latest data
  } catch (error: any) {
    console.error('Failed to confirm order:', error);
    toast.error(error.response?.data?.message || 'Failed to confirm order');
  } finally {
    setConfirmingOrderId(null);
  }
};

const handleUpdateStatus = async (orderId: string, newStatus: string) => {
  setUpdatingStatusId(orderId);

  try {
    const token = localStorage.getItem('mansara-token');

    const response = await api.put(
      `/orders/${orderId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(`Order status updated to ${newStatus}. Customer notified via WhatsApp`);

    // Update local state
    setOrders(prev => prev.map(o =>
      o._id === orderId ? { ...o, ...response.data } : o
    ));

    if (selectedOrder?._id === orderId) {
      setSelectedOrder(response.data);
    }

    await fetchOrders();
  } catch (error: any) {
    console.error('Failed to update status:', error);
    toast.error(error.response?.data?.message || 'Failed to update order status');
  } finally {
    setUpdatingStatusId(null);
  }
};

const handleUpdateFeedback = async (orderId: string, status: 'Received' | 'Not Received') => {
  try {
    const token = localStorage.getItem('mansara-token');
    await api.put(
      `/orders/${orderId}/feedback`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(`Feedback marked as ${status}`);

    // Refresh orders to reflect changes (e.g. auto-close)
    await fetchOrders();

    // Update selected order if open
    if (selectedOrder?._id === orderId) {
      // Fetch updated single order or just patch local
      // Re-fetch list is safer for side effects like status change
      const updatedList = await api.get('/orders', { headers: { Authorization: `Bearer ${token}` } });
      const updatedOrder = (updatedList.data.orders || updatedList.data).find((o: Order) => o._id === orderId);
      if (updatedOrder) setSelectedOrder(updatedOrder);
    }
  } catch (error: any) {
    console.error('Failed to update feedback:', error);
    toast.error(error.response?.data?.message || 'Failed to update feedback');
  }
};

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    setDeletingOrderId(orderToDelete._id);
    try {
      await api.deleteOrder(orderToDelete._id);
      toast.success("Order deleted successfully");
      
      // Update local state
      setOrders(prev => prev.filter(o => o._id !== orderToDelete._id));
      
      if (selectedOrder?._id === orderToDelete._id) {
        setSelectedOrder(null);
        setShowDetails(false);
      }
      
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete order:", error);
      toast.error(error.message || "Failed to delete order");
    } finally {
      setDeletingOrderId(null);
    }
  };

  const confirmDelete = (order: Order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

const handleViewDetails = (order: Order) => {
  setSelectedOrder(order);
  setShowDetails(true);
};

const handleManualWhatsApp = (order: Order) => {
  const whatsappNumber = order.deliveryAddress.whatsapp || order.user.whatsapp || order.deliveryAddress.phone || order.user.phone;

  if (!whatsappNumber) {
    toast.error("No WhatsApp number available for this customer");
    return;
  }

  // Format delivery date
  const deliveryDate = order.estimatedDeliveryDate
    ? new Date(order.estimatedDeliveryDate)
    : new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

  const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Construct WhatsApp message
  const newLine = '\n';
  const bold = (text: string) => `*${text}*`;

  let itemDetails = '';
  order.items.forEach(item => {
    itemDetails += `• ${item.quantity}x ${item.name} - ₹${item.price * item.quantity}${newLine}`;
  });

  const statusMessage = order.orderStatus === 'Ordered'
    ? '⏳ Waiting for Confirmation'
    : order.orderStatus === 'Processing'
      ? '✅ Order Confirmed'
      : `📦 ${order.orderStatus}`;

  const message = `${bold('Mansara Foods')} 🌿${newLine}${newLine}` +
    `Hi ${order.user.name},${newLine}${newLine}` +
    `${bold('Order Update')}${newLine}` +
    `Order ID: ${order.orderId}${newLine}` +
    `Status: ${statusMessage}${newLine}${newLine}` +
    `${bold('Order Items:')}${newLine}` +
    itemDetails +
    `${newLine}${bold('Total:')} ₹${order.total}${newLine}` +
    `${bold('Payment:')} ${order.paymentMethod}${newLine}${newLine}` +
    (order.estimatedDeliveryDate
      ? `${bold('Expected Delivery:')} ${formattedDate}${newLine}${newLine}`
      : '') +
    `Track: ${window.location.origin}/order-tracking/${order.orderId}${newLine}${newLine}` +
    `Thank you for choosing Mansara Foods! 🙏`;

  // Clean and format phone number
  let phoneParam = whatsappNumber.replace(/\D/g, '');

  if (phoneParam.length === 10) {
    phoneParam = `91${phoneParam}`;
  }

  if (!phoneParam || phoneParam.length < 10) {
    toast.error("Invalid WhatsApp number");
    return;
  }

  const whatsappUrl = `https://wa.me/${phoneParam}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
  toast.success("WhatsApp opened!");
};

const handleRequestReview = async (orderId: string) => {
  try {
    const token = localStorage.getItem('mansara-token');
    await api.post(`/orders/${orderId}/notify/review`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("Review request sent successfully");
  } catch (error: any) {
    console.error("Failed to send review request:", error);
    toast.error(error.response?.data?.message || "Failed to send review request");
  }
};

const handleSendMessage = async () => {
  if (!selectedOrder || !messageContent.trim()) return;

  setSendingMessage(true);
  try {
    const token = localStorage.getItem('mansara-token');
    await api.post(`/orders/${selectedOrder._id}/notify/message`, {
      "Processing": "default",
      "Shipped": "default",
      "Out for Delivery": "default",
      "Delivered": "default",
      "Cancelled": "destructive",
    };
    return statusMap[status] || "outline";
  };

  const getPaymentBadge = (status: string) => {
    const statusMap: any = {
      "Paid": "default",
      "Pending": "outline",
      "Failed": "destructive"
    };
    return statusMap[status] || "outline";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Orders Management</h1>
            <p className="text-slate-600 mt-1">View and manage customer orders</p>
          </div>
          <Button onClick={fetchOrders} variant="outline" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Refresh
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="mt-2 text-sm text-slate-500">Loading orders...</p>
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Package className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-600">No orders found</p>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-sm font-medium">
                      {order.orderId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.user?.name || order.deliveryAddress.firstName}</p>
                        <p className="text-xs text-slate-500">{order.user?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>
                        <p>{order.deliveryAddress.phone || order.user?.phone}</p>
                        {(order.deliveryAddress.whatsapp || order.user?.whatsapp) && (
                          <p className="text-xs text-green-600">
                            WA: {order.deliveryAddress.whatsapp || order.user?.whatsapp}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell className="font-semibold">₹{order.total}</TableCell>
                    <TableCell>
                      <Badge variant={getPaymentBadge(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                        className="gap-1"
                      >
                        <Eye size={16} /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderId}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h3 className="font-semibold text-sm mb-3 text-slate-700">Order Information</h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Order ID:</span>
                      <span className="font-mono font-medium">{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Date:</span>
                      <span>{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Payment Method:</span>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Payment Status:</span>
                      <Badge variant={getPaymentBadge(selectedOrder.paymentStatus)}>
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Order Status:</span>
                      <Badge variant={getStatusBadge(selectedOrder.orderStatus)}>
                        {selectedOrder.orderStatus}
                      </Badge>
                    </div>
                    {selectedOrder.estimatedDeliveryDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Est. Delivery:</span>
                        <span className="font-medium">
                          {new Date(selectedOrder.estimatedDeliveryDate).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h3 className="font-semibold text-sm mb-3 text-slate-700">Customer Information</h3>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-slate-600">Name:</span>
                      <p className="font-medium">{selectedOrder.user?.name || selectedOrder.deliveryAddress.firstName}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Email:</span>
                      <p>{selectedOrder.user?.email}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Phone:</span>
                      <p>{selectedOrder.deliveryAddress.phone || selectedOrder.user?.phone}</p>
                    </div>
                    {(selectedOrder.deliveryAddress.whatsapp || selectedOrder.user?.whatsapp) && (
                      <div>
                        <span className="text-slate-600">WhatsApp:</span>
                        <p className="text-green-600 font-medium">
                          {selectedOrder.deliveryAddress.whatsapp || selectedOrder.user?.whatsapp}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-sm mb-2 text-blue-900">Delivery Address</h3>
                <p className="text-sm text-blue-800">
                  {selectedOrder.deliveryAddress.firstName} {selectedOrder.deliveryAddress.lastName}<br />
                  {selectedOrder.deliveryAddress.street}<br />
                  {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.zip}
                </p>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-sm mb-3">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">₹{item.price}</TableCell>
                          <TableCell className="text-right font-semibold">
                            ₹{item.price * item.quantity}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-slate-50 font-bold">
                        <TableCell colSpan={3} className="text-right">Grand Total:</TableCell>
                        <TableCell className="text-right text-lg">₹{selectedOrder.total}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-slate-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-sm mb-3">Update Order Status</h3>
                <PermissionGate
                  module="orders"
                  requiredLevel="limited"
                  fallback={
                    <div className="bg-slate-100 p-2 rounded border border-slate-200 text-slate-500 text-sm">
                      Status updates are restricted
                    </div>
                  }
                >
                  <Select
                    value={selectedOrder.orderStatus}
                    onValueChange={(newStatus) => handleUpdateStatus(selectedOrder._id, newStatus)}
                    disabled={updatingStatusId === selectedOrder._id}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => {
                        const statusOrder = ['Ordered', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
                        const currentIndex = statusOrder.indexOf(selectedOrder.orderStatus);
                        const optionIndex = statusOrder.indexOf(status.value);

                        // Disable if moving backwards (unless it's Cancelled or current status is Cancelled/Delivered)
                        // Cancelled is always allowed unless already Delivered
                        // Delivered is final state

                        let isDisabled = false;

                        if (selectedOrder.orderStatus === 'Cancelled') isDisabled = true;
                        else if (selectedOrder.orderStatus === 'Delivered') isDisabled = true;
                        else if (status.value === 'Cancelled') isDisabled = false; // Can always cancel unless delivered
                        else if (optionIndex < currentIndex) isDisabled = true; // Cannot move backwards

                        return (
                          <SelectItem key={status.value} value={status.value} disabled={isDisabled}>
                            <div className="flex items-center gap-2">
                              <status.icon size={16} />
                              {status.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </PermissionGate>
                <p className="text-xs text-slate-500 mt-2">
                  Customer will be automatically notified via WhatsApp when status changes
                </p>
              </div>

              {/* Feedback Management (Only for Delivered/Closed orders) */}
              {(selectedOrder.orderStatus === 'Delivered' || selectedOrder.orderStatus === 'Closed') && (
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h3 className="font-semibold text-sm mb-3">Feedback Status</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Current Status:</span>
                      <Badge variant={
                        selectedOrder.feedbackStatus === 'Received' ? 'default' :
                          selectedOrder.feedbackStatus === 'Not Received' ? 'destructive' : 'secondary'
                      }>
                        {selectedOrder.feedbackStatus || 'Pending'}
                      </Badge>
                    </div>

                    {selectedOrder.feedbackStatus !== 'Received' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                          onClick={() => handleUpdateFeedback(selectedOrder._id, 'Received')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Received
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50"
                          onClick={() => handleUpdateFeedback(selectedOrder._id, 'Not Received')}
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Not Received
                        </Button>
                      </div>
                    )}
                  </div>
                  {selectedOrder.feedbackStatus === 'Received' && (
                    <p className="text-xs text-green-600 mt-2 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" /> Order automatically closed
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t">
                <div className="flex gap-3">
                  <PermissionGate module="orders" requiredLevel="limited">
                    {selectedOrder.orderStatus === 'Ordered' && (
                      <Button
                        onClick={() => handleConfirmOrder(selectedOrder)}
                        disabled={confirmingOrderId === selectedOrder._id}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {confirmingOrderId === selectedOrder._id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Confirming...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm Order & Notify
                          </>
                        )}
                      </Button>
                    )}
                  </PermissionGate>

                  <Button
                    onClick={() => handleManualWhatsApp(selectedOrder)}
                    variant="outline"
                    className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp (Manual)
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setMessageDialogOpen(true)}
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Custom Message
                  </Button>

                  {selectedOrder.orderStatus === 'Delivered' && (
                    <Button
                      onClick={() => handleRequestReview(selectedOrder._id)}
                      variant="outline"
                      className="flex-1 border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Request Review
                    </Button>
                  )}
                </div>
                </div>

                <div className="pt-4 border-t">
                  <PermissionGate module="orders" requiredLevel="full">
                    <Button
                      onClick={() => confirmDelete(selectedOrder)}
                      variant="destructive"
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Order
                    </Button>
                  </PermissionGate>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Custom Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Message Content</Label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                This message will be sent via Email and WhatsApp.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage} disabled={sendingMessage || !messageContent.trim()}>
                {sendingMessage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600">
              Are you sure you want to delete order <span className="font-mono font-bold text-slate-900">{orderToDelete?.orderId}</span>?
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteOrder}
              disabled={!!deletingOrderId}
            >
              {deletingOrderId ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Order
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;