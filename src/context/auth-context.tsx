// app/context/auth-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login as login_api } from "@/lib/actions/login";

// Define el tipo de datos que manejará el contexto
interface AuthContextType {
    user: any;
    isAuthenticated: boolean;
    login: (email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        // Verifica si hay un token en las cookies al cargar la página
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            // Hacer la verificación del token o obtener los datos del usuario
            // Conecta con tu backend para obtener los datos del usuario
            fetch("/api/verify-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setUser(data.user);
                })
                .catch(() => {
                    logout();
                });
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await login_api(email, password);

            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("refresh_token", response.refresh_token);
            setIsAuthenticated(true);
            setUser(response.user);
            router.push("/");  // Redirige a la página protegida
        } catch (error) {
            alert(error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        router.push("/login");  // Redirige al login
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
