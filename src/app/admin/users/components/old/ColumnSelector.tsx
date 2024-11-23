import React, { useEffect } from "react";
import { useUI } from "@/context/UIContext";
import IconButton from "@/components/IconButton";
import { SettingsIcon } from "@/assets/Icons";

interface ColumnSelectorProps {
    columns: {
        key: string;
        label: string;
    }[];
    selectedColumns: string[];
    onSelect: (selectedColumns: string[]) => void;
}

const ColumnSelector = ({ columns, selectedColumns, onSelect }: ColumnSelectorProps) => {
    const { activeComponent, setActiveComponent } = useUI();
    const componentId = `columnSelector`;
    const isOpen = activeComponent[componentId] === true;

    const handleToggleOpen = () => {
        setActiveComponent(componentId, !isOpen);
    };

    const handleCheckboxChange = (column: string) => {
        const updatedSelectedColumns = selectedColumns.includes(column)
            ? selectedColumns.filter((col) => col !== column)
            : [...selectedColumns, column];

        onSelect(updatedSelectedColumns);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && !(event.target as Element).closest(`#${componentId}`)) {
                setActiveComponent(componentId, false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setActiveComponent, componentId]);

    return (
        <div className="relative inline-block text-left">
            <IconButton
                icon={<SettingsIcon />}
                label="Ver"
                isOpen={isOpen}
                onClick={handleToggleOpen}
            />

            {isOpen && (
                <div id={componentId} className="absolute z-10 mt-1 w-56 border shadow-sm rounded-md outline-none bg-white">
                    <div className="max-h-48 overflow-y-auto overflow-x-hidden" role="listbox" aria-label="Columns">
                        {columns.map((column) => (
                            <label key={column.key} className="relative flex items-center px-2 py-1.5 text-sm rounded-sm gap-2 outline-none cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="form-checkbox mr-2 h-4 w-4"
                                    checked={selectedColumns.includes(column.key)}
                                    onChange={() => handleCheckboxChange(column.key)}
                                />
                                <span>{column.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColumnSelector;