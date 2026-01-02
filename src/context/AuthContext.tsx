import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/data/mockData';
import { API_URL } from '../lib/api';

interface AuthContextType {
    user: User | null;
    login: (email?: string, password?: string) => Promise<User | null>;
    register: (name: string, email: string, password: string, phone: string, whatsapp: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========================================
// OPTIMIZED AUTH CONTEXT
// ========================================

// Constants
const STORAGE_KEYS = {
    USER: 'mansara-user',
    TOKEN: 'mansara-token',
    ADMIN: 'mansara-admin-session'
} as const;

// Helper to get token
const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);

// Helper to get stored user
const getStoredUser = (): User | null => {
    try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error('[Auth] Failed to parse stored user:', error);
        return null;
    }
};

// Helper to validate token expiry (if JWT)
const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;
    
    try {
        // Decode JWT to check expiry
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp) {
            return payload.exp * 1000 > Date.now();
        }
        return true; // If no expiry, assume valid
    } catch {
        return true; // If not JWT or decode fails, assume valid
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ========================================
    // RESTORE SESSION ON MOUNT
    // ========================================
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const storedUser = getStoredUser();
                const token = getToken();

                if (storedUser && token && isTokenValid(token)) {
                    // Optionally verify token with backend
                    try {
                        const response = await fetch(`${API_URL}/auth/profile`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (response.ok) {
                            const userData = await response.json();
                            const normalizedUser: User = {
                                id: userData._id || userData.id,
                                name: userData.name,
                                email: userData.email,
                                phone: userData.phone || '',
                                whatsapp: userData.whatsapp || '',
                                avatar: userData.avatar,
                                role: userData.role
                            };
                            setUser(normalizedUser);
                            // Update stored user if needed
                            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedUser));
                        } else {
                            // Token invalid, clear session
                            console.log('[Auth] Token verification failed, logging out');
                            logout();
                        }
                    } catch (error) {
                        // Network error, use stored user
                        console.log('[Auth] Using stored session (offline)');
                        setUser(storedUser);
                    }
                } else {
                    // No valid session
                    if (token && !isTokenValid(token)) {
                        console.log('[Auth] Token expired, clearing session');
                        logout();
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
    // REGISTER
    // ========================================
    const register = async (
        name: string, 
        email: string, 
        password: string, 
        phone: string, 
        whatsapp: string
    ): Promise<boolean> => {
        try {
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

            console.log('[Auth] ✓ Registration successful - OTP sent to WhatsApp');
            return true;
        } catch (error: any) {
            console.error('[Auth] ✗ Registration error:', error.message);
            throw error;
        }
    };

    // ========================================
    // LOGIN
    // ========================================
    const login = async (email?: string, password?: string): Promise<User | null> => {
        try {
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

            const userData: User = {
                id: data._id || data.id,
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                whatsapp: data.whatsapp || '',
                avatar: data.avatar,
                role: data.role,
            };

            // Update state
            setUser(userData);
            
            // Save to localStorage
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
            localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);

            console.log('[Auth] ✓ Login successful');
            return userData;
        } catch (error: any) {
            console.error('[Auth] ✗ Login error:', error.message);
            throw error;
        }
    };

    // ========================================
    // LOGOUT
    // ========================================
    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ADMIN);
        console.log('[Auth] ✓ User logged out');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            isAuthenticated: !!user,
            isLoading
        }}>
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