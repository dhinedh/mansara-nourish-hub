import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Offers from "./pages/Offers";
import Combos from "./pages/Combos";
import NewArrivals from "./pages/NewArrivals";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import { AuthProvider } from "./context/AuthContext";

import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminProductEdit from "./pages/admin/ProductEdit";
import AdminOrders from "./pages/admin/Orders";
import AdminCustomers from "./pages/admin/Customers";
import AdminOffers from "./pages/admin/Offers";
import AdminCombos from "./pages/admin/Combos";
import AdminContent from "./pages/admin/Content";
import AdminBanners from "./pages/admin/Banners";
import AdminSettings from "./pages/admin/Settings";
import AdminCategories from "./pages/admin/Categories";

import TermsAndConditions from "./pages/policies/TermsAndConditions";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import DeliveryShippingPolicy from "./pages/policies/DeliveryShippingPolicy";
import RefundReturnPolicy from "./pages/policies/RefundReturnPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/combos" element={<Combos />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/:id/edit" element={<AdminProductEdit />} />
              <Route path="/admin/products/new" element={<AdminProductEdit />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route path="/admin/offers" element={<AdminOffers />} />
              <Route path="/admin/combos" element={<AdminCombos />} />
              <Route path="/admin/content" element={<AdminContent />} />
              <Route path="/admin/banners" element={<AdminBanners />} />
              <Route path="/admin/settings" element={<AdminSettings />} />

              {/* User Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/account" element={<Account />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order-tracking/:orderId" element={<OrderTracking />} />



              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/delivery-shipping-policy" element={<DeliveryShippingPolicy />} />
              <Route path="/refund-return-policy" element={<RefundReturnPolicy />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
