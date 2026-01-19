import { GoogleOAuthProvider } from '@react-oauth/google';
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
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Press from "./pages/Press";
import PressDetail from "./pages/PressDetail";
import Careers from "./pages/Careers";
import CareerDetail from "./pages/CareerDetail";
import NewArrivals from "./pages/NewArrivals";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import { StoreProvider } from "./context/StoreContext";

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
import AdminHeroManagement from "./pages/admin/HeroManagement";
import AdminCustomerHistory from "./pages/admin/CustomerHistory";
import AdminStock from "./pages/admin/Stock";
import AdminBlog from "./pages/admin/Blog";
import AdminPress from "./pages/admin/Press";
import AdminCareers from "./pages/admin/Careers";
import AdminReviews from "./pages/admin/Reviews";
import AdminAnalytics from "./pages/admin/Analytics";

import TermsAndConditions from "./pages/policies/TermsAndConditions";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import DeliveryShippingPolicy from "./pages/policies/DeliveryShippingPolicy";
import RefundReturnPolicy from "./pages/policies/RefundReturnPolicy";
import ProtectedRoute from './components/auth/ProtectedRoute';

// ========================================
// OPTIMIZED APP CONFIGURATION
// ========================================

// Create QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

// Get Google Client ID from environment
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "PUT_YOUR_GOOGLE_CLIENT_ID_HERE";

// Log for debugging (remove in production)
if (import.meta.env.DEV) {
  console.log('[App] Environment:', import.meta.env.MODE);
  console.log('[App] API URL:', import.meta.env.VITE_API_URL);
  console.log('[App] Google Client ID:', GOOGLE_CLIENT_ID ? '✓ Found' : '✗ Missing');

  if (!GOOGLE_CLIENT_ID) {
    console.warn('[App] ⚠️ VITE_GOOGLE_CLIENT_ID not found in .env file');
    console.warn('[App] Create a .env file with: VITE_GOOGLE_CLIENT_ID=your-client-id');
  }
}

// ========================================
// MAIN APP COMPONENT
// ========================================
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <ContentProvider>
            <StoreProvider>
              <CartProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner position="top-right" />
                  <BrowserRouter>
                    <ScrollToTop />
                    <Routes>
                      {/* Public Pages */}
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:slug" element={<ProductDetail />} />
                      <Route path="/combos" element={<Combos />} />
                      <Route path="/offers" element={<Offers />} />
                      <Route path="/new-arrivals" element={<NewArrivals />} />
                      <Route path="/cart" element={<Cart />} />

                      {/* Content Pages */}
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogDetail />} />
                      <Route path="/press" element={<Press />} />
                      <Route path="/press/:slug" element={<PressDetail />} />
                      <Route path="/careers" element={<Careers />} />
                      <Route path="/careers/:id" element={<CareerDetail />} />

                      {/* User */}
                      <Route path="/checkout" element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      } />

                      {/* Auth Routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/verify-email" element={<VerifyEmail />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />

                      {/* User Account Routes */}
                      <Route path="/account" element={
                        <ProtectedRoute>
                          <Account />
                        </ProtectedRoute>
                      } />
                      <Route path="/orders" element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      } />
                      <Route path="/order-tracking/:orderId" element={
                        <ProtectedRoute>
                          <OrderTracking />
                        </ProtectedRoute>
                      } />

                      {/* Admin Routes */}
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin/dashboard" element={
                        <ProtectedRoute adminOnly module="orders" level="view">
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/analytics" element={
                        <ProtectedRoute adminOnly module="orders" level="view">
                          <AdminAnalytics />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/categories" element={
                        <ProtectedRoute adminOnly module="categories" level="view">
                          <AdminCategories />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/products" element={
                        <ProtectedRoute adminOnly module="products" level="view">
                          <AdminProducts />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/products/:id/edit" element={
                        <ProtectedRoute adminOnly module="products" level="limited">
                          <AdminProductEdit />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/products/new" element={
                        <ProtectedRoute adminOnly module="products" level="limited">
                          <AdminProductEdit />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/orders" element={
                        <ProtectedRoute adminOnly module="orders" level="view">
                          <AdminOrders />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/customers" element={
                        <ProtectedRoute adminOnly module="customers" level="view">
                          <AdminCustomers />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/customers/:id" element={
                        <ProtectedRoute adminOnly module="customers" level="view">
                          <AdminCustomerHistory />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/offers" element={
                        <ProtectedRoute adminOnly module="offers" level="view">
                          <AdminOffers />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/combos" element={
                        <ProtectedRoute adminOnly module="combos" level="view">
                          <AdminCombos />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/content" element={
                        <ProtectedRoute adminOnly module="content" level="view">
                          <AdminContent />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/blog" element={
                        <ProtectedRoute adminOnly module="blog" level="view">
                          <AdminBlog />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/press" element={
                        <ProtectedRoute adminOnly module="press" level="view">
                          <AdminPress />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/careers" element={
                        <ProtectedRoute adminOnly module="careers" level="view">
                          <AdminCareers />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/reviews" element={
                        <ProtectedRoute adminOnly module="products" level="view">
                          <AdminReviews />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/banners" element={
                        <ProtectedRoute adminOnly module="banners" level="view">
                          <AdminBanners />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/hero" element={
                        <ProtectedRoute adminOnly module="banners" level="view">
                          <AdminHeroManagement />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/stock" element={
                        <ProtectedRoute adminOnly module="stocks" level="view">
                          <AdminStock />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/settings" element={
                        <ProtectedRoute adminOnly module="settings" level="view">
                          <AdminSettings />
                        </ProtectedRoute>
                      } />

                      {/* Policy Pages */}
                      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/delivery-shipping-policy" element={<DeliveryShippingPolicy />} />
                      <Route path="/refund-return-policy" element={<RefundReturnPolicy />} />

                      {/* 404 Not Found */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </CartProvider>
            </StoreProvider>
          </ContentProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

export default App;