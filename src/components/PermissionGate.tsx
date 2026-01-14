import React from 'react';
import { useAuth } from '../context/AuthContext';

type PermissionLevel = 'none' | 'view' | 'limited' | 'full';

interface PermissionGateProps {
    module: string;
    requiredLevel?: PermissionLevel;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const LEVEL_HIERARCHY: Record<PermissionLevel, number> = {
    'none': 0,
    'view': 1,
    'limited': 2,
    'full': 3
};

export const PermissionGate: React.FC<PermissionGateProps> = ({
    module,
    requiredLevel = 'view',
    children,
    fallback = null
}) => {
    const { user } = useAuth();

    if (!user) return <>{fallback}</>;

    // Super Admin Bypass
    if (user.role === 'admin' && user.email?.includes('backend-admin')) {
        return <>{children}</>;
    }

    const userPermissions = user.permissions || {};
    const userLevel = userPermissions[module] || 'none';

    if (LEVEL_HIERARCHY[userLevel] >= LEVEL_HIERARCHY[requiredLevel]) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

export const HasPermission = (module: string, requiredLevel: PermissionLevel = 'view'): boolean => {
    const { user } = useAuth();
    if (!user) return false;

    // Super Admin Bypass
    if (user.role === 'admin' && user.email?.includes('backend-admin')) {
        return true;
    }

    const userPermissions = user.permissions || {};
    const userLevel = userPermissions[module] || 'none';

    return LEVEL_HIERARCHY[userLevel] >= LEVEL_HIERARCHY[requiredLevel];
};
