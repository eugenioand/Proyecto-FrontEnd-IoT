import React, { createContext, useContext, useState, ReactNode } from "react";

interface SelectedItem {
    id: number | string;
    type: "node" | "sensor";
}

interface SelectionContextProps {
    selectedItem: SelectedItem | null;
    setSelectedItem: (item: SelectedItem | null) => void;
}

const SelectionContext = createContext<SelectionContextProps | undefined>(undefined);

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
    const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

    return (
        <SelectionContext.Provider value={{ selectedItem, setSelectedItem }}>
            {children}
        </SelectionContext.Provider>
    );
};

export const useSelection = () => {
    const context = useContext(SelectionContext);
    if (!context) {
        throw new Error("useSelection must be used within a SelectionProvider");
    }
    return context;
};