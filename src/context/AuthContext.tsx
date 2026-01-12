import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/data/mockData';
import { API_URL } from '../lib/api';

// ========================================
// OPTIMIZED AUTH CONTEXT - COMPLETE
// ========================================
// Performance improvements:
// - Token validation caching
// - Automatic token refresh
// - Request deduplication
// - Better error handling
// - Offline support
// - Session persistence
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
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========================================
// CONSTANTS
// ========================================
const STORAGE_KEYS = {
    USER: 'mansara-user',
    TOKEN: 'mansara-token',
    TOKEN_EXPIRY: 'mansara-token-expiry',
    ADMIN: 'mansara-admin-session'
} as const;

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // Refresh if expires in 5 minutes
const TOKEN_VALIDATION_CACHE_DURATION = 60 * 1000; // Cache validation for 1 minute

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
 * Check if JWT token is valid (with caching)
 */
let lastValidationTime = 0;
let lastValidationResult = false;

const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;

    // Use cached result if recent
    const now = Date.now();
    if (now - lastValidationTime < TOKEN_VALIDATION_CACHE_DURATION) {
        return lastValidationResult;
    }

    try {
        // Decode JWT payload
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Check expiration
        if (payload.exp) {
            const isValid = payload.exp * 1000 > now;

            // Cache result
            lastValidationTime = now;
            lastValidationResult = isValid;

            // Store expiry time
            if (isValid) {
                localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, payload.exp.toString());
            }

            return isValid;
        }

        lastValidationTime = now;
        lastValidationResult = true;
        return true;
    } catch {
        lastValidationTime = now;
        lastValidationResult = false;
        return false;
    }
};

/**
 * Check if token needs refresh
 */
const needsTokenRefresh = (): boolean => {
    try {
        const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
        if (!expiry) return false;

        const expiryTime = parseInt(expiry) * 1000;
        const now = Date.now();

        return expiryTime - now < TOKEN_REFRESH_THRESHOLD;
    } catch {
        return false;
    }
};

/**
 * Verify token with backend (with deduplication)
 */
let verificationInProgress: Promise<User | null> | null = null;

const verifyTokenWithBackend = async (token: string): Promise<User | null> => {
    // Deduplicate requests
    if (verificationInProgress) {
        console.log('[Auth] Using in-flight verification request');
        return verificationInProgress;
    }

    verificationInProgress = (async () => {
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
        } finally {
            verificationInProgress = null;
        }
    })();

    return verificationInProgress;
};

/**
 * Refresh token with backend
 */
const refreshToken = async (currentToken: string): Promise<string | null> => {
    try {
        console.log('[Auth] Refreshing token...');

        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('[Auth] ✓ Token refreshed');
            return data.token;
        }

        console.warn('[Auth] ✗ Token refresh failed');
        return null;
    } catch (error) {
        console.error('[Auth] Token refresh error:', error);
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
        role: userData.role || 'user',
        isVerified: userData.isVerified || false
    };
};

// ========================================
// AUTH PROVIDER COMPONENT
// ========================================

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ========================================
    // SESSION RESTORATION WITH AUTO-REFRESH
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

                // If we have both user and token
                if (storedUser && token) {
                    // Check if token is valid
                    if (!isTokenValid(token)) {
                        console.log('[Auth] Token expired, clearing session');
                        clearSession();
                        setIsLoading(false);
                        return;
                    }

                    // Check if token needs refresh
                    if (needsTokenRefresh()) {
                        console.log('[Auth] Token needs refresh');
                        const newToken = await refreshToken(token);

                        if (newToken) {
                            localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
                            console.log('[Auth] ✓ Token refreshed successfully');
                        } else {
                            console.warn('[Auth] ⚠ Token refresh failed, using existing token');
                        }
                    }

                    // Verify with backend
                    try {
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
                    console.log('[Auth] No stored session');
                }
            } catch (error) {
                console.error('[Auth] Session restore error:', error);
                clearSession();
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();

        // Set up periodic token refresh check
        const refreshInterval = setInterval(() => {
            const token = getToken();
            if (token && needsTokenRefresh()) {
                console.log('[Auth] Background token refresh triggered');
                refreshToken(token).then(newToken => {
                    if (newToken) {
                        localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
                    }
                });
            }
        }, 60000); // Check every minute

        return () => clearInterval(refreshInterval);
    }, []);

    // ========================================
    // CLEAR SESSION HELPER
    // ========================================
    const clearSession = useCallback(() => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
        localStorage.removeItem(STORAGE_KEYS.ADMIN);

        // Clear validation cache
        lastValidationTime = 0;
        lastValidationResult = false;
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

            // Reset validation cache
            lastValidationTime = 0;
            lastValidationResult = false;

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
            role: userData.role || 'user',
            isVerified: true // Google users are verified by identity provider
        };

        // Save to state and localStorage
        setUser(user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);

        // Reset validation cache
        lastValidationTime = 0;
        lastValidationResult = false;

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
        localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
        localStorage.removeItem(STORAGE_KEYS.ADMIN);

        // Reset validation cache
        lastValidationTime = 0;
        lastValidationResult = false;

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
    // REFRESH USER DATA FROM BACKEND
    // ========================================
    const refreshUser = useCallback(async () => {
        try {
            const token = getToken();
            if (!token) {
                console.warn('[Auth] No token for user refresh');
                return;
            }

            console.log('[Auth] Refreshing user data...');
            const userData = await verifyTokenWithBackend(token);

            if (userData) {
                setUser(userData);
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
                console.log('[Auth] ✓ User data refreshed');
            }
        } catch (error) {
            console.error('[Auth] ✗ User refresh failed:', error);
        }
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
        updateUser,
        refreshUser
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