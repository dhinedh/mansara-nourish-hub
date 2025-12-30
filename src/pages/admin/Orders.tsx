import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
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
import { Eye, MessageCircle } from "lucide-react";

interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_whatsapp?: string;
  customer_address: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  items: any[];
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { getAllOrders } = await import('@/lib/api');
      const token = localStorage.getItem('mansara-token');
      if (!token) return; // Or redirect to login

      const data = await getAllOrders(token);
      console.log("Fetched Orders:", data); // Debugging log

      // Map backend data to frontend Order interface if needed
      // Backend returns: { _id, user: { name, email }, total, status, items, deliveryAddress... }
      // Frontend expects: { id, customer_name, ... }

      const mappedOrders = data.map((order: any) => ({
        id: order._id || order.id || order.orderId,
        customer_id: order.user?._id || order.user?.id || 'guest',
        customer_name: order.deliveryAddress?.firstName || order.user?.name || 'Guest',
        customer_email: order.user?.email || '',
        customer_phone: order.deliveryAddress?.phone || order.user?.phone || '',
        customer_whatsapp: order.deliveryAddress?.whatsapp || order.user?.whatsapp || '',
        customer_address: `${order.deliveryAddress?.street}, ${order.deliveryAddress?.city}, ${order.deliveryAddress?.zip}`,
        total_amount: order.total,
        payment_status: order.paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid', // Infer or add status field
        order_status: order.status || 'pending',
        created_at: order.createdAt,
        items: order.items.map((item: any) => ({
          id: item.product, // Product ID
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        raw_data: order // Store raw data for debugging
      }));

      setOrders(mappedOrders);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // TODO: Implement updateOrderStatus in backend and api.ts
    // For now, optimistic update or just toast
    toast.info("Status update not yet connected to backend API");
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, order_status: newStatus });
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setWhatsappNumber(order.customer_whatsapp || order.customer_phone || "");
    setShowDetails(true);
  };

  const handleConfirmAndWhatsApp = (order: Order) => {
    // 1. Update status to 'confirmed' (optimistic)
    updateOrderStatus(order.id, 'confirmed');

    // 2. Construct WhatsApp Message
    const newLine = '\n';
    const bold = (text: string) => `*${text}*`;
    const now = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(now.getDate() + 5);

    // Format dates
    const orderDateStr = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
    const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    let itemDetails = `${bold('Item')} - ${bold('Qty')} - ${bold('Price')} - ${bold('Total')}${newLine}`;
    order.items.forEach(item => {
      itemDetails += `${item.name} - ${item.quantity} - ₹${item.price} - ₹${item.price * item.quantity}${newLine}`;
    });

    const paymentAlert = order.payment_status === 'pending'
      ? `Payment Alert: ${bold('Payment Pending (COD) ⏳')}`
      : `Payment Alert: ${bold('Payment Received ✅')}`;

    const paymentMethodText = order.payment_status === 'pending' ? 'Cash on Delivery' : 'Online Payment';

    const message = `*Order Confirmed!* ✅${newLine}` +
      `Hi ${order.customer_name},${newLine}${newLine}` +
      `Thank you for shopping with Mansara Nourish Hub. Your order has been placed successfully.${newLine}${newLine}` +
      `${paymentAlert}${newLine}` +
      `Order ID: #${order.id.slice(0, 8).toUpperCase()}${newLine}${newLine}` +
      `Date: ${orderDateStr}${newLine}${newLine}` +
      `Payment Method: ${paymentMethodText}${newLine}${newLine}` +
      `${bold('Invoice Details')}${newLine}` +
      itemDetails +
      `--------------------------------${newLine}` +
      `${bold('Grand Total:')} ₹${order.total_amount}${newLine}${newLine}` +
      `Your order is expected to be delivered by ${deliveryDateStr}.${newLine}${newLine}` +
      `Track Your Order: ${window.location.origin}/track-order/${order.id}`;

    // 3. Open WhatsApp
    const cleanNumber = (num: string | undefined) => {
      if (!num) return '';
      const clean = num.replace(/\D/g, '');
      return clean.length >= 10 ? clean : ''; // Basic validation
    };

    let phoneParam = cleanNumber(whatsappNumber);
    if (!phoneParam) {
      // Fallback to original data if input is somehow empty but data exists (unlikely given pre-fill)
      phoneParam = cleanNumber(order.customer_whatsapp);
    }
    if (!phoneParam) {
      phoneParam = cleanNumber(order.customer_phone);
    }

    // Format with country code if needed (defaulting to 91 for India if 10 digits)
    if (phoneParam && phoneParam.length === 10) {
      phoneParam = `91${phoneParam}`;
    }

    if (!phoneParam) {
      toast.error("Customer phone number is missing or invalid!");
      return;
    }

    const whatsappUrl = `https://wa.me/${phoneParam}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Order confirmed and WhatsApp opened!");
  };


  const statusOptions = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];
  // ... (rest of generic code)




  const getStatusBadge = (status: string) => {
    const colors: any = {
      pending: "outline",
      confirmed: "secondary",
      packed: "secondary",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    };
    return colors[status] || "outline";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-600 mt-1">Manage customer orders</p>

        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
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
                    Loading...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell className="text-sm">{order.customer_phone}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>₹{order.total_amount}</TableCell>
                    <TableCell>
                      <Badge variant={order.payment_status === "paid" ? "default" : "outline"}>
                        {order.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(order.order_status)}>
                        {order.order_status}
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

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Order Information</h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-slate-600">Order ID:</span>{" "}
                      <span className="font-mono text-slate-900 font-medium">#{selectedOrder.id.slice(0, 8).toUpperCase()}</span>
                    </p>
                    <p>
                      <span className="text-slate-600">Invoice No:</span>{" "}
                      <span className="font-mono text-slate-900 font-medium">INV-{selectedOrder.id.slice(0, 8).toUpperCase()}</span>
                    </p>
                    <p>
                      <span className="text-slate-600">Date:</span>{" "}
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-2">Payment & Status</h3>
                  <div className="text-sm space-y-2">
                    <p>
                      <Badge variant={selectedOrder.payment_status === "paid" ? "default" : "outline"}>
                        {selectedOrder.payment_status}
                      </Badge>
                    </p>
                    <p>
                      <Badge variant={getStatusBadge(selectedOrder.order_status)}>
                        {selectedOrder.order_status}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-2">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-sm space-y-1 p-3 bg-slate-50 rounded border">
                    <h4 className="font-semibold text-xs uppercase text-slate-500 mb-2">Shipping Details</h4>
                    <p>
                      <span className="text-slate-600">Name:</span> {selectedOrder.customer_name}
                    </p>
                    <p>
                      <span className="text-slate-600">Phone:</span> {selectedOrder.customer_phone}
                    </p>
                    {selectedOrder.customer_whatsapp && (
                      <p>
                        <span className="text-slate-600">WhatsApp:</span> {selectedOrder.customer_whatsapp}
                      </p>
                    )}
                    <p>
                      <span className="text-slate-600">Address:</span> {selectedOrder.customer_address}
                    </p>
                  </div>

                  <div className="text-sm space-y-1 p-3 bg-slate-50 rounded border">
                    <h4 className="font-semibold text-xs uppercase text-slate-500 mb-2">Billing / Invoice To</h4>
                    <p>
                      <span className="text-slate-600">Name:</span> {selectedOrder.customer_name}
                    </p>
                    <p>
                      <span className="text-slate-600">Email:</span> {selectedOrder.customer_email}
                    </p>
                    <p>
                      <span className="text-slate-600">Address:</span> {selectedOrder.customer_address}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3">Update Order Status</h3>
                <Select
                  value={selectedOrder.order_status}
                  onValueChange={(newStatus) => updateOrderStatus(selectedOrder.id, newStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3">Actions</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-num" className="text-xs text-slate-500 uppercase font-semibold">WhatsApp Number</Label>
                    <Input
                      id="whatsapp-num"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="Enter mobile number"
                      className="max-w-xs"
                    />
                  </div>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white gap-2 w-full sm:w-auto"
                    onClick={() => selectedOrder && handleConfirmAndWhatsApp(selectedOrder)}
                  >
                    <MessageCircle size={18} />
                    Confirm & Send WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          )}
          {selectedOrder && (
            <div className="mt-6 border-t pt-6">
              <h3 className="font-semibold text-sm mb-3">Order Items</h3>
              <div className="bg-white rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="w-[50%]">Product</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{item.name || "Product Name"}</span>
                              <span className="text-xs text-slate-500">{item.id?.slice(0, 8)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{item.quantity} x</TableCell>
                          <TableCell className="text-right">₹{item.price}</TableCell>
                          <TableCell className="text-right font-medium">₹{item.price * item.quantity}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-slate-500 py-4">No items details available</TableCell>
                      </TableRow>
                    )}
                    <TableRow className="bg-slate-50 font-bold">
                      <TableCell colSpan={3} className="text-right">Total Amount:</TableCell>
                      <TableCell className="text-right text-lg">₹{selectedOrder.total_amount}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </AdminLayout >
  );
};

export default AdminOrders;
