import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Package, Users, TrendingUp, AlertCircle } from "lucide-react";

interface Stats {
  totalOrders: number;
  todayOrders: number;
  totalProducts: number;
  pendingOrders: number;
  totalCustomers: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    todayOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        const [productsRes, ordersRes, customersRes] = await Promise.all([
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("*", { count: "exact", head: true }),
          supabase.from("customers").select("*", { count: "exact", head: true }),
        ]);

        const todayOrdersRes = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .gte("created_at", `${today}T00:00:00`)
          .lt("created_at", `${today}T23:59:59`);

        const pendingOrdersRes = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("order_status", "pending");

        setStats({
          totalProducts: productsRes.count || 0,
          totalOrders: ordersRes.count || 0,
          totalCustomers: customersRes.count || 0,
          todayOrders: todayOrdersRes.count || 0,
          pendingOrders: pendingOrdersRes.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? "..." : value}</div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome to MANSARA Admin Panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={Package} label="Total Products" value={stats.totalProducts} />
          <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} />
          <StatCard icon={ShoppingCart} label="Today's Orders" value={stats.todayOrders} />
          <StatCard icon={AlertCircle} label="Pending Orders" value={stats.pendingOrders} />
          <StatCard icon={Users} label="Total Customers" value={stats.totalCustomers} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline" onClick={() => navigate('/admin/products')}>Add New Product</Button>
              <Button className="w-full" variant="outline" onClick={() => navigate('/admin/orders')}>View All Orders</Button>
              <Button className="w-full" variant="outline" onClick={() => navigate('/admin/banners')}>Manage Banners</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600">
                <p>Orders received: {stats.todayOrders}</p>
                <p>Pending orders: {stats.pendingOrders}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>Business overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600">
                <p>Total customers: {stats.totalCustomers}</p>
                <p>Active products: {stats.totalProducts}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
