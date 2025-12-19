
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, mockUser } from '@/data/mockData';

interface AuthContextType {
    user: User | null;
    login: (email?: string, password?: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check for existing session
        const storedUser = localStorage.getItem('mansara-user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email?: string, password?: string): Promise<boolean> => {
        // Mock login delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // In a real app, validation would happen here
        // For now, accept any login attempt or specific mock credentials

        setUser(mockUser);
        localStorage.setItem('mansara-user', JSON.stringify(mockUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mansara-user');
        // Optional: Redirect handled by component
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
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
