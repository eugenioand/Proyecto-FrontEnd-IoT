"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../utils/axios-client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                try {
                    const response = await axiosClient.get('/me');
                    setUser(response.data);
                    setIsAuthenticated(true);
                } catch (error) {
                    logout();
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await refreshToken();
            } catch {
                console.error('No se pudo actualizar el token');
            }
        }, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axiosClient.post('/auth/login', { email, password });
            const { access_token, refresh_token, user } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            setUser(user);
            setIsAuthenticated(true);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error durante el login:', error);
        }
    };

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setUser(null);
        router.replace('/login');
    };

    const refreshToken = async () => {
        try {
            const refresh_token = localStorage.getItem('refresh_token');
            if (!refresh_token) throw new Error('No refresh token available');
            const response = await axiosClient.post('/auth/refresh', { refresh_token });
            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);
            return access_token;
        } catch (error) {
            console.error('Error al refrescar el token:', error);
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refreshToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
