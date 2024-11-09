import React, { useState, useEffect, useRef } from "react";
import { useUI } from "@/context/UIContext";
import IconButton from "@/components/IconButton";
import { SearchIcon, PlusIcon } from "@/assets/Icons";

interface Option {
    id: string;
    label: string;
    length: number;
}

interface FilterOptionProps {
    options: Option[];
    label: string;
    onSelect: (label: string[]) => void;
}

const FilterButton = ({ options, label, onSelect }: FilterOptionProps) => {
    const { activeComponent, setActiveComponent } = useUI();
    const componentId = `filterButton-${label}`;
    const isOpen = activeComponent[componentId] === true;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    const handleToggleOpen = () => {
        setActiveComponent(componentId, !isOpen);
    };

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
        }
    }, [isOpen, setActiveComponent]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && ref.current && !ref.current.contains(event.target as Node)) {
                setActiveComponent(componentId, false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setActiveComponent]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }

    const handleCheckboxChange = (optionId: string) => {
        const updatedSelectedOptions = selectedOptions.includes(optionId)
            ? selectedOptions.filter((id) => id !== optionId)
            : [...selectedOptions, optionId];

        setSelectedOptions(updatedSelectedOptions);
        onSelect(updatedSelectedOptions);
    };

    const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div ref={ref} className="relative inline-block text-left">
            <IconButton
                icon={<PlusIcon />}
                label={label}
                isOpen={isOpen}
                onClick={handleToggleOpen}
                customClasses="border-dashed"
            />

            {isOpen && (
                <div tabIndex={-1} role="dialog" className="absolute z-10 mt-1 w-56 border shadow-sm rounded-md outline-none bg-white">
                    <div className="flex items-center border-b px-3">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder={`Buscar`}
                            value={searchTerm}
                            onChange={handleSearch}
                            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto overflow-x-hidden" role="listbox" aria-label="Suggestions">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <label key={option.id} className="relative flex items-center px-2 py-1.5 text-sm rounded-sm gap-2 outline-none cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox mr-2 h-4 w-4"
                                        checked={selectedOptions.includes(option.id)}
                                        onChange={() => handleCheckboxChange(option.id)}
                                    />
                                    <span>{option.label}</span>
                                    <span className="ml-auto flex h-4 items-center justify-center font-mono text-xs">{option.length}</span>
                                </label>
                            ))
                        ) : (
                            <p className="py-6 text-center text-sm text-gray-500">Sin resultados</p>
                        )}
                        {selectedOptions.length > 0 && (
                            <button
                                onClick={() => setSelectedOptions([])}
                                className="w-full flex items-center justify-center py-2 text-sm text-blue-600 border-t hover:text-blue-900"
                            >
                                Limpiar filtro
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterButton;