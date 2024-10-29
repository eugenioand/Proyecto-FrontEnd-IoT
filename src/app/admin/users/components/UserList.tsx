import React from "react";

const UserList = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
            <div className="overflow-x-auto mt-4">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 border">Nombre</th>
                            <th className="px-4 py-2 border">Correo</th>
                            <th className="px-4 py-2 border">Rol</th>
                            <th className="px-4 py-2 border">Estado</th>
                            <th className="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;