import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Percent,
  Box,
  ShoppingCart,
  Users,
  FileText,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  Newspaper,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check for demo session (legacy support)
      const isDemoSession = localStorage.getItem('mansara-admin-session');
      if (isDemoSession) {
        setIsLoading(false);
        return;
      }

      // Check for new backend auth
      const storedUser = localStorage.getItem('mansara-user');
      if (!storedUser) {
        navigate("/login");
        return;
      }

      const user = JSON.parse(storedUser);
      if (user.role !== 'admin') {
        navigate("/"); // Redirect non-admins to home
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('mansara-admin-session');
    localStorage.removeItem('mansara-user');
    localStorage.removeItem('mansara-token');
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: Box, label: "Stocks", path: "/admin/stock" },
    { icon: Box, label: "Categories", path: "/admin/categories" },
    { icon: Percent, label: "Offers", path: "/admin/offers" },
    { icon: Box, label: "Combos", path: "/admin/combos" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: Users, label: "Customers", path: "/admin/customers" },
    { icon: FileText, label: "Content", path: "/admin/content" },
    { icon: FileText, label: "Blog", path: "/admin/blog" },
    { icon: Newspaper, label: "Press", path: "/admin/press" },
    { icon: Briefcase, label: "Careers", path: "/admin/careers" },
    { icon: Image, label: "Banners", path: "/admin/banners" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <aside
        className={cn(
          "bg-slate-900 text-white transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
          {sidebarOpen && <h1 className="text-xl font-bold">MANSARA</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-slate-300"
              )}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="outline"
            className={cn(
              "w-full border-slate-600 hover:bg-slate-800 bg-transparent text-white hover:text-white",
              !sidebarOpen && "p-2 justify-center"
            )}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto flex flex-col">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {menuItems.find((m) => m.path === location.pathname)?.label || "Admin Panel"}
          </h2>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
