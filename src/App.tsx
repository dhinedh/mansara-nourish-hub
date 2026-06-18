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

// Public Pages (Eager Load for Speed)
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import Checkout from "./pages/Checkout";
import Offers from "./pages/Offers";
import Combos from "./pages/Combos";

// Secondary Pages (Lazy Load)
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Press = lazy(() => import("./pages/Press"));
const PressDetail = lazy(() => import("./pages/PressDetail"));
const Careers = lazy(() => import("./pages/Careers"));
const CareerDetail = lazy(() => import("./pages/CareerDetail"));
const NewArrivals = lazy(() => import("./pages/NewArrivals"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Account = lazy(() => import("./pages/Account"));

// Admin access is handled by the CRM Portal — https://crm.mansarafoods.com
// All /admin/* routes redirect there.
const AdminRedirect = lazy(() => import("./pages/admin/AdminRedirect"));

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

                        {/* Admin Routes — Redirects to CRM Portal */}
                        {/* All admin/dealer users must login at https://crm.mansarafoods.com */}
                        <Route path="/admin/*" element={<AdminRedirect />} />

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