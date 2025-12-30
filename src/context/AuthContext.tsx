
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/data/mockData';

interface AuthContextType {
    user: User | null;
    login: (email?: string, password?: string) => Promise<User | null>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get token
const getToken = () => localStorage.getItem('mansara-token');

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check for existing session
        const storedUser = localStorage.getItem('mansara-user');
        const token = getToken();

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Registration successful, but no auto-login (OTP required)
            // Backend returns message and isVerified: false

            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const login = async (email?: string, password?: string): Promise<User | null> => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
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

            const userData = {
                id: data._id,
                name: data.name,
                email: data.email,
                phone: "", // Default empty phone
                avatar: undefined, // Backend doesn't return avatar yet
                role: data.role,
            };

            setUser(userData as User);
            localStorage.setItem('mansara-user', JSON.stringify(userData));
            localStorage.setItem('mansara-token', data.token);

            return userData as User;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mansara-user');
        localStorage.removeItem('mansara-token');
        localStorage.removeItem('mansara-admin-session');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
