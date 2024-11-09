import React, { useState } from "react";
import useUserStore from "@/stores/userStore";
import Table from "./Table";
import IconButton from "@/components/IconButton";
import FilterButton from "./FilterButton";
import CreateUserModal from "./CreateUserModal";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import ColumnSelector from "./ColumnSelector";

const UserList = () => {
    const {
        users,
        totalUsers,
        loading,
        filters,
        fetchUsers,
        setFilters,
    } = useUserStore();

    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(['firstName', 'email', 'role', 'createdAt']);


    const openModal = () => setFilters({ isModalOpen: true });
    // const closeModal = () => setFilters({ isModalOpen: false });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setFilters({ ...filters, searchTerm, currentPage: 1 });

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            fetchUsers();
        }, 500);

        setSearchTimeout(timeout);
    };

    const handleSelectRoles = (selectedRoles: string[]) => {
        setFilters({ ...filters, roleFilter: selectedRoles.join(','), currentPage: 1 });
        fetchUsers();
    };

    const handleSelectStatuses = (selectedStatuses: string[]) => {
        setFilters({ ...filters, statusFilter: selectedStatuses.join(','), currentPage: 1 });
        fetchUsers();
    };

    const handlePageChange = (page: number) => {
        setFilters({ ...filters, currentPage: page });
        fetchUsers();
    };

    return (
        <div className="flex flex-col flex-grow space-y-4 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Listado de Usuarios</h2>

            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex flex-1 items-center flex-wrap gap-2 min-w-64">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        value={filters.searchTerm}
                        onChange={handleSearchChange}
                        className="rounded-md border bg-transparent border-gray-300 px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-8 w-full sm:w-[250px]"
                    />
                    <FilterButton
                        label="Roles"
                        options={[
                            { id: 'admin', label: 'Admin', length: users.filter(user => user.role === 'admin').length },
                            { id: 'user', label: 'Usuario', length: users.filter(user => user.role === 'user').length },
                        ]}
                        onSelect={handleSelectRoles}
                    />
                    <FilterButton
                        label="Estados"
                        options={[
                            { id: 'active', label: 'Activo', length: users.filter(user => user.status === 1).length },
                            { id: 'inactive', label: 'Inactivo', length: users.filter(user => user.status === 0).length }
                        ]}
                        onSelect={handleSelectStatuses}
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <ColumnSelector
                        columns={[
                            {'key': 'name', 'label': 'Nombre'},
                            {'key': 'email', 'label': 'Correo'},
                            {'key': 'role', 'label': 'Role'},
                            {'key': 'createdAt', 'label': 'Fecha de creación'}
                        ]}
                        selectedColumns={visibleColumns}
                        onSelect={setVisibleColumns}
                    />
                    <IconButton
                        icon={<UserPlusIcon />}
                        label="Agregar Usuario"
                        onClick={openModal}
                    />
                </div>
            </div>

            <div className="flex-grow mt-2 border overflow-auto">
                <Table
                    data={users}
                    totalRecords={totalUsers}
                    recordsPerPage={filters.usersPerPage}
                    currentPage={filters.currentPage}
                    onPageChange={handlePageChange}
                    onEdit={(id) => console.log('Editar', id)}
                    onDelete={(id) => console.log('Eliminar', id)}
                    loading={loading}
                    visibleColumns={visibleColumns}
                />
            </div>
            <CreateUserModal />
        </div>
    );
};

export default UserList;