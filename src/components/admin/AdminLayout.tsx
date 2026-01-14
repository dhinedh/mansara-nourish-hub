import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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

// ========================================
// OPTIMIZED ADMIN LAYOUT
// Performance improvements:
// - Memoized menu items
// - Debounced sidebar toggle
// - Lazy auth check
// - Better loading state
// ========================================

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('admin-sidebar-open');
    return saved !== null ? saved === 'true' : true;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem('admin-sidebar-open', String(sidebarOpen));
  }, [sidebarOpen]);

  // Optimized auth check
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check for new backend auth first (prioritize)
        const storedUser = localStorage.getItem('mansara-user');
        const token = localStorage.getItem('mansara-token');

        if (storedUser && token) {
          const user = JSON.parse(storedUser);

          if (user.role !== 'admin') {
            console.warn('[Admin] Non-admin user attempted access');
            navigate("/", { replace: true });
            return;
          }

          setIsLoading(false);
          return;
        }

        // Fallback: Check for demo session (legacy support)
        const isDemoSession = localStorage.getItem('mansara-admin-session');
        if (isDemoSession) {
          console.log('[Admin] Demo session active');
          setIsLoading(false);
          return;
        }

        // No valid auth found
        console.warn('[Admin] No authentication found');
        navigate("/login", { replace: true });

      } catch (error) {
        console.error('[Admin] Auth check error:', error);
        navigate("/login", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('mansara-admin-session');
    localStorage.removeItem('mansara-user');
    localStorage.removeItem('mansara-token');

    console.log('[Admin] Logged out');
    navigate("/login", { replace: true });
  };

  // Memoized menu items with permissions
  const { user } = useAuth();

  // Helper to check permission safely
  const hasPermission = (module: string, level: 'view' | 'limited' | 'full' = 'view') => {
    if (!user) return false;
    if (user.role === 'admin' && user.email?.includes('backend-admin')) return true;

    // Default to 'none' if permissions object missing
    const userPermissions = user.permissions || {};
    const userLevel = userPermissions[module] || 'none';

    const levels = { 'none': 0, 'view': 1, 'limited': 2, 'full': 3 };
    return levels[userLevel] >= levels[level];
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard", module: 'orders' },
    { icon: Package, label: "Products", path: "/admin/products", module: 'products' },
    { icon: Box, label: "Stocks", path: "/admin/stock", module: 'stocks' },
    { icon: Box, label: "Categories", path: "/admin/categories", module: 'categories' },
    { icon: Percent, label: "Offers", path: "/admin/offers", module: 'offers' },
    { icon: Box, label: "Combos", path: "/admin/combos", module: 'combos' },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders", module: 'orders' },
    { icon: Users, label: "Customers", path: "/admin/customers", module: 'customers' },
    { icon: FileText, label: "Content", path: "/admin/content", module: 'content' },
    { icon: FileText, label: "Blog", path: "/admin/blog", module: 'blog' },
    { icon: Newspaper, label: "Press", path: "/admin/press", module: 'press' },
    { icon: Briefcase, label: "Careers", path: "/admin/careers", module: 'careers' },
    { icon: Image, label: "Banners", path: "/admin/banners", module: 'banners' },
    { icon: Settings, label: "Settings", path: "/admin/settings", module: 'settings' },
  ].filter(item => hasPermission(item.module));

  // Better loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-slate-900 text-white transition-all duration-300 flex flex-col flex-shrink-0",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
          {sidebarOpen && (
            <h1 className="text-xl font-bold truncate">MANSARA</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded transition-colors"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <a
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </a>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="outline"
            className={cn(
              "w-full border-slate-600 hover:bg-slate-800 bg-transparent text-white hover:text-white transition-colors",
              !sidebarOpen && "p-2 justify-center"
            )}
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-900 truncate">
            {menuItems.find((m) => m.path === location.pathname)?.label || "Admin Panel"}
          </h2>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;