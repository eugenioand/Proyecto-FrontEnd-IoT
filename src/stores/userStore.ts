import { create } from 'zustand';
import api from '@/lib/axios';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    status: number;
}

interface ApiUser {
    id: number;
    first_name: string;
    second_name: string;
    last_name: string;
    second_last_name: string;
    email: string;
    role: string;
    created_at: string;
    status: number;
}

interface Filters {
    searchTerm?: string;
    roleFilter?: string;
    statusFilter?: string;
    startDateFilter?: string;
    endDateFilter?: string;
    currentPage: number;
    usersPerPage: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    isModalOpen: boolean;
}

interface UserStore {
    users: User[];
    totalUsers: number;
    filters: Filters;
    loading: boolean;
    error: string | null;
    passwordVisible: boolean;
    togglePasswordVisibility: () => void;
    fetchUsers: () => Promise<void>;
    setFilters: (filters: Partial<Filters>) => void;
    openModal: () => void;
    closeModal: () => void;
}

const useUserStore = create<UserStore>((set, get) => ({
    users: [],
    totalUsers: 0,
    filters: {
        searchTerm: '',
        roleFilter: '',
        statusFilter: '',
        startDateFilter: '',
        endDateFilter: '',
        currentPage: 1,
        usersPerPage: 10,
        sortBy: 'created_at',
        sortOrder: 'asc',
        isModalOpen: false,
    },
    loading: false,
    error: null,
    passwordVisible: false,
    togglePasswordVisibility: () => set((state) => ({ passwordVisible: !state.passwordVisible })),
    fetchUsers: async () => {
        set({ loading: true, error: null });
        const { filters } = get();
        const params: Record<string, string> = {};

        if (filters.searchTerm) params.text_search = filters.searchTerm;
        if (filters.roleFilter) params.role = filters.roleFilter;
        if (filters.statusFilter) params.status = filters.statusFilter;
        if (filters.startDateFilter) params.start_date = filters.startDateFilter;
        if (filters.endDateFilter) params.end_date = filters.endDateFilter;
        params.page = filters.currentPage.toString();
        params.page_size = filters.usersPerPage.toString();
        params.sort_property = filters.sortBy;
        params.sort_order = filters.sortOrder.toUpperCase();

        try {
            const response = await api.get('/api/users', { params: new URLSearchParams(params) });
            const data = response.data.data;
            set({ users: data.map((user: ApiUser) => ({
                id: user.id,
                name: `${user.first_name} ${user.second_name} ${user.last_name} ${user.second_last_name}`,
                email: user.email,
                role: user.role,
                createdAt: user.created_at,
                status: user.status,
            })), totalUsers: data.length, loading: false });
        } catch (error) {
            console.error(error);
            set({ error: 'Error fetching users', loading: false });
        }
    },
    setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
    openModal: () => set((state) => ({ filters: { ...state.filters, isModalOpen: true } })),
    closeModal: () => set((state) => ({ filters: { ...state.filters, isModalOpen: false } })),
}));

export default useUserStore;