import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import { StoreProvider } from "./context/StoreContext";
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const Offers = lazy(() => import("./pages/Offers"));
const Combos = lazy(() => import("./pages/Combos"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Press = lazy(() => import("./pages/Press"));
const PressDetail = lazy(() => import("./pages/PressDetail"));
const Careers = lazy(() => import("./pages/Careers"));
const CareerDetail = lazy(() => import("./pages/CareerDetail"));
const NewArrivals = lazy(() => import("./pages/NewArrivals"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Account = lazy(() => import("./pages/Account"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));

// Admin Pages
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminProductEdit = lazy(() => import("./pages/admin/ProductEdit"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminOffers = lazy(() => import("./pages/admin/Offers"));
const AdminCombos = lazy(() => import("./pages/admin/Combos"));
const AdminContent = lazy(() => import("./pages/admin/Content"));
const AdminBanners = lazy(() => import("./pages/admin/Banners"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminCategories = lazy(() => import("./pages/admin/Categories"));
const AdminHeroManagement = lazy(() => import("./pages/admin/HeroManagement"));
const AdminCustomerHistory = lazy(() => import("./pages/admin/CustomerHistory"));
const AdminStock = lazy(() => import("./pages/admin/Stock"));
const AdminBlog = lazy(() => import("./pages/admin/Blog"));
const AdminPress = lazy(() => import("./pages/admin/Press"));
const AdminCareers = lazy(() => import("./pages/admin/Careers"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));

// Policy Pages
const TermsAndConditions = lazy(() => import("./pages/policies/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/policies/PrivacyPolicy"));
const DeliveryShippingPolicy = lazy(() => import("./pages/policies/DeliveryShippingPolicy"));
const RefundReturnPolicy = lazy(() => import("./pages/policies/RefundReturnPolicy"));

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
                    <Suspense fallback={
                      <div className="flex h-screen w-full items-center justify-center bg-white">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-sm text-slate-500">Loading...</p>
                        </div>
                      </div>
                    }>
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
                    </Suspense>
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