import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

// Define los tipos para el elemento seleccionado
type SelectedItem = {
    id: number | string;
    type: "node" | "sensor" | any;
};

// Define las propiedades del contexto
interface SelectionContextProps {
    selectedItem: SelectedItem | null;
    setSelectedItem: Dispatch<SetStateAction<SelectedItem | null>>;
}

// Crear el contexto con un valor inicial indefinido
const SelectionContext = createContext<SelectionContextProps | null>(null);

// Proveedor del contexto
export const SelectionProvider = ({ children }: { children: ReactNode }) => {
    const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

    const value = { selectedItem, setSelectedItem }; // Objeto para el proveedor
    return (
        <SelectionContext.Provider value={value}>
            {children}
        </SelectionContext.Provider>
    );
};

// Hook personalizado para consumir el contexto
export const useSelection = () => {
    const context = useContext(SelectionContext);
    if (!context) {
        throw new Error("useSelection must be used within a SelectionProvider");
    }
    return context;
};
