import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
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
import { Eye } from "lucide-react";

interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          order_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);
      if (error) throw error;
      toast.success("Order status updated");
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, order_status: newStatus });
      }
    } catch (error: any) {
      toast.error("Failed to update order");
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const statusOptions = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];

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
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
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
                      <span className="font-mono">{selectedOrder.id.slice(0, 12)}</span>
                    </p>
                    <p>
                      <span className="text-slate-600">Date:</span>{" "}
                      {new Date(selectedOrder.created_at).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="text-slate-600">Amount:</span> ₹{selectedOrder.total_amount}
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
                <div className="text-sm space-y-1 p-3 bg-slate-50 rounded">
                  <p>
                    <span className="text-slate-600">Name:</span> {selectedOrder.customer_name}
                  </p>
                  <p>
                    <span className="text-slate-600">Email:</span> {selectedOrder.customer_email}
                  </p>
                  <p>
                    <span className="text-slate-600">Phone:</span> {selectedOrder.customer_phone}
                  </p>
                  <p>
                    <span className="text-slate-600">Address:</span> {selectedOrder.customer_address}
                  </p>
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;
