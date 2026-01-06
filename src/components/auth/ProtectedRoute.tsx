import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking auth state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // If not authenticated, redirect to login with return url
    if (!user) {
        // For admin routes, redirect to admin login
        if (adminOnly) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        // For normal routes, redirect to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check admin role for admin routes
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // If authenticated and authorized, render children
    return <>{children}</>;
};

export default ProtectedRoute;
