import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/data/mockData';
import { API_URL } from '../lib/api';

// ========================================
// TYPES & INTERFACES
// ========================================

interface AuthContextType {
    user: User | null;
    login: (email?: string, password?: string) => Promise<User | null>;
    loginWithGoogle: (userData: any, token: string) => void;
    register: (name: string, email: string, password: string, phone: string, whatsapp: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========================================
// CONSTANTS
// ========================================

const STORAGE_KEYS = {
    USER: 'mansara-user',
    TOKEN: 'mansara-token',
    ADMIN: 'mansara-admin-session'
} as const;

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get JWT token from localStorage
 */
const getToken = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Get stored user from localStorage
 */
const getStoredUser = (): User | null => {
    try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error('[Auth] Failed to parse stored user:', error);
        return null;
    }
};

/**
 * Check if JWT token is valid (not expired)
 */
const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;

    try {
        // Decode JWT payload
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Check expiration
        if (payload.exp) {
            return payload.exp * 1000 > Date.now();
        }

        return true;
    } catch {
        return false;
    }
};

/**
 * Verify token with backend
 */
const verifyTokenWithBackend = async (token: string): Promise<User | null> => {
    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            return normalizeUserData(userData);
        }

        return null;
    } catch (error) {
        console.error('[Auth] Token verification failed:', error);
        return null;
    }
};

/**
 * Normalize user data from backend
 */
const normalizeUserData = (userData: any): User => {
    return {
        id: userData._id || userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        whatsapp: userData.whatsapp || '',
        avatar: userData.avatar || userData.picture || '',
        role: userData.role || 'user'
    };
};

// ========================================
// AUTH PROVIDER COMPONENT
// ========================================

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ========================================
    // SESSION RESTORATION
    // ========================================
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const storedUser = getStoredUser();
                const token = getToken();

                console.log('[Auth] Restoring session...', {
                    hasUser: !!storedUser,
                    hasToken: !!token,
                    isTokenValid: isTokenValid(token)
                });

                // If we have both user and valid token
                if (storedUser && token && isTokenValid(token)) {
                    try {
                        // Verify token with backend
                        const verifiedUser = await verifyTokenWithBackend(token);

                        if (verifiedUser) {
                            console.log('[Auth] ✓ Session restored from backend');
                            setUser(verifiedUser);
                            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(verifiedUser));
                        } else {
                            console.log('[Auth] ✗ Token verification failed, logging out');
                            clearSession();
                        }
                    } catch (error) {
                        // If backend is unreachable, use cached user (offline mode)
                        console.log('[Auth] ⚠ Backend unreachable, using cached session');
                        setUser(storedUser);
                    }
                } else {
                    // If token is expired, clear session
                    if (token && !isTokenValid(token)) {
                        console.log('[Auth] Token expired, clearing session');
                        clearSession();
                    }
                }
            } catch (error) {
                console.error('[Auth] Session restore error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    // ========================================
    // CLEAR SESSION HELPER
    // ========================================
    const clearSession = useCallback(() => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ADMIN);
    }, []);

    // ========================================
    // REGISTER
    // ========================================
    const register = useCallback(async (
        name: string,
        email: string,
        password: string,
        phone: string,
        whatsapp: string
    ): Promise<boolean> => {
        try {
            console.log('[Auth] Registering user:', { email, name });

            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    phone,
                    whatsapp
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            console.log('[Auth] ✓ Registration successful');
            return true;
        } catch (error: any) {
            console.error('[Auth] ✗ Registration error:', error.message);
            throw error;
        }
    }, []);

    // ========================================
    // LOGIN (EMAIL/PASSWORD)
    // ========================================
    const login = useCallback(async (email?: string, password?: string): Promise<User | null> => {
        try {
            console.log('[Auth] Logging in:', { email });

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Normalize user data
            const userData = normalizeUserData(data);

            // Save to state and localStorage
            setUser(userData);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
            localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);

            console.log('[Auth] ✓ Login successful');
            return userData;
        } catch (error: any) {
            console.error('[Auth] ✗ Login error:', error.message);
            throw error;
        }
    }, []);

    // ========================================
    // LOGIN WITH GOOGLE
    // ========================================
    const loginWithGoogle = useCallback((userData: any, token: string) => {
        console.log('[Auth] Google login:', { email: userData.email });

        // Normalize user data
        const user: User = {
            id: userData.id || userData._id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone || '',
            whatsapp: userData.whatsapp || '',
            avatar: userData.avatar || userData.picture || '',
            role: userData.role || 'user'
        };

        // Save to state and localStorage
        setUser(user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);

        console.log('[Auth] ✓ Google login successful');
    }, []);

    // ========================================
    // LOGOUT
    // ========================================
    const logout = useCallback(() => {
        console.log('[Auth] Logging out');

        setUser(null);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ADMIN);

        console.log('[Auth] ✓ User logged out');
    }, []);

    // ========================================
    // UPDATE USER
    // ========================================
    const updateUser = useCallback((userData: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;

            const updated = { ...prev, ...userData };
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));

            console.log('[Auth] ✓ User updated');
            return updated;
        });
    }, []);

    // ========================================
    // CONTEXT VALUE
    // ========================================
    const value: AuthContextType = {
        user,
        login,
        loginWithGoogle,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ========================================
// HOOK
// ========================================

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default AuthContext;