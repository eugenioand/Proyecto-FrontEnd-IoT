import React from "react";
// import Pagination from "./Pagination";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    status: number;
}

interface TableProps {
    data: User[];
    totalRecords: number;
    recordsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    loading: boolean;
    visibleColumns: string[];
}

const Table = ({ data, totalRecords, recordsPerPage, currentPage, onPageChange, onEdit, onDelete, loading, visibleColumns }: TableProps) => {
    const columns: { key: keyof User; label: string }[] = [
        { key: 'name', label: 'Nombre' },
        { key: 'email', label: 'Correo' },
        { key: 'role', label: 'Rol' },
        { key: 'createdAt', label: 'Fecha de Creación' },
    ];

    // TODO:
    console.log(data, totalRecords, recordsPerPage, currentPage, onPageChange, onEdit, onDelete, loading, visibleColumns);

    return (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.filter(col => visibleColumns.includes(col.key)).map(col => (
                            <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.label}</th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr className="p-2 align-middle h-24 text-center">
                            <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center">Cargando...</td>
                        </tr>
                    ) : (
                        totalRecords > 0 ? (
                            data.map(user => (
                                <tr key={user.id}>
                                    {columns.filter(col => visibleColumns.includes(col.key)).map(col => (
                                        <td key={`${user.id}-${col.key}`} className="px-2 py-4 max-w-80 whitespace-break-spaces">{user[col.key]}</td>
                                    ))}
                                    <td className="px-2 py-4 w-40 whitespace-break-spaces">
                                        <button onClick={() => onEdit(user.id)} className="text-blue-600 hover:text-blue-900">Editar</button>
                                        <button onClick={() => onDelete(user.id)} className="text-red-600 hover:text-red-900 ml-2">Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="p-2 align-middle h-24 text-center">
                                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center">No hay usuarios para mostrar</td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        // <div className="overflow-x-auto h-full">
        // </div>
    );
};

export default Table;