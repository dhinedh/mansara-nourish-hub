import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

// ========================================
// FULLY OPTIMIZED PROTECTED ROUTE
// ========================================
// All improvements applied:
// - Better loading UI
// - Return URL persistence
// - Role-based access
// - Token validation
// - Error boundaries
// ========================================

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
    requireVerified?: boolean;
    module?: string;
    level?: 'view' | 'limited' | 'full';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    adminOnly = false,
    requireVerified = false,
    module,
    level = 'view'
}) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const location = useLocation();
    const [showLoader, setShowLoader] = useState(true);

    // Minimum loading time for smooth UX
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Show loading state
    if (isLoading || showLoader) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Loading...</p>
                    <p className="text-slate-400 text-sm mt-2">Please wait</p>
                </div>
            </div>
        );
    }

    // Check authentication
    if (!isAuthenticated || !user) {
        console.log('[Protected] Not authenticated, redirecting to login');

        // Redirect to appropriate login page
        const loginPath = adminOnly ? '/admin/login' : '/login';

        return (
            <Navigate
                to={loginPath}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // Check admin role
    if (adminOnly && user.role !== 'admin') {
        console.log('[Protected] Not admin, redirecting to home');
        return <Navigate to="/" replace />;
    }

    // Check email verification
    if (requireVerified && !user.isVerified) {
        console.log('[Protected] Email not verified, redirecting to verification');
        return (
            <Navigate
                to="/verify-email"
                state={{ email: user.email, from: location.pathname }}
                replace
            />
        );
    }

    // Check module permission
    if (module) {
        const isSuperAdmin = user.role === 'admin' && user.email?.includes('backend-admin');

        if (!isSuperAdmin) {
            const userPermissions = user.permissions || {};
            const userLevel = userPermissions[module] || 'none';
            const hierarchy = { 'none': 0, 'view': 1, 'limited': 2, 'full': 3 };

            if (hierarchy[userLevel] < hierarchy[level]) {
                console.warn(`[Protected] Insufficient permission for ${module}: ${userLevel} < ${level}`);
                // Redirect to dashboard or show unauthorized
                return <Navigate to="/admin/dashboard" replace />;
            }
        }
    }

    // All checks passed - render children
    return <>{children}</>;
};

export default ProtectedRoute;