"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextProps {
    activeComponent: Record<string, boolean>;
    setActiveComponent: (id: string, isActive: boolean) => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [activeComponent, setActiveComponentState] = useState<Record<string, boolean>>({});

    const setActiveComponent = (id: string, isActive: boolean) => {
        setActiveComponentState((prev) => ({
            ...prev,
            [id]: isActive,
        }));
    };

    return (
        <UIContext.Provider value={{ activeComponent, setActiveComponent }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};