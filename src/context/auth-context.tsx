"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../utils/axios-client";
import { useRouter } from "next/navigation";
import { unknownError } from "@/lib/constants";

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
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false); // Inicializar en `false`
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem("access_token");
            if (accessToken) {
                setIsAuthenticated(true);
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true); // Mostrar estado de carga
        try {
            const response = await axiosClient.post("/auth/login", { email, password });
            const { access_token, refresh_token, user } = response.data;

            // Guardar tokens en el localStorage
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

            // Configurar usuario y autenticación
            setUser(user);
            setIsAuthenticated(true);

            // Llamar a /me para sincronizar información
            await fetchUserInfo();

            router.push("/dashboard");
        } catch (error) {
            console.error("Error durante el login:", error);
            throw error;
        } finally {
            setLoading(false); // Detener estado de carga
        }
    };

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setUser(null);
        router.replace("/login");
    };

    const refreshToken = async () => {
        try {
            const refresh_token = localStorage.getItem("refresh_token");
            if (!refresh_token) throw new Error("No refresh token available");
            const response = await axiosClient.post("/auth/refresh", { refresh_token });
            const { access_token } = response.data;

            // Actualizar token en el localStorage
            localStorage.setItem("access_token", access_token);

            return access_token;
        } catch (error) {
            console.error("Error al refrescar el token:", error);
            logout();
        }
    };

    const fetchUserInfo = async () => {
        try {
            const response = await axiosClient.get("/me");
            setUser(response.data?.data);
        } catch (error) {
            console.error("Error al obtener información del usuario:", error);
            logout();
        }
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, login, logout, refreshToken, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};
