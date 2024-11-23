import React from "react";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    roleFilter: string;
    setRoleFilter: (role: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    startDateFilter: string;
    setStartDateFilter: (date: string) => void;
    endDateFilter: string;
    setEndDateFilter: (date: string) => void;
}

const FilterModal = ({
    isOpen,
    onClose,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
}: FilterModalProps) => {
    // if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
                isOpen ? "" : "hidden"
            }`}
        >
            <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Filtros</h3>

                <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Rol
                    </label>
                    <select
                        id="role"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                    >
                        <option value="">Todos</option>
                        <option value="Admin">Admin</option>
                        <option value="Usuario">Usuario</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Estado
                    </label>
                    <select
                        id="status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                    >
                        <option value="">Todos</option>
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Fecha de Creación (Desde)
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        Fecha de Creación (Hasta)
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        Cerrar
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Aplicar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;