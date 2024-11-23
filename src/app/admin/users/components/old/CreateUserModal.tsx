import { FormEvent, useReducer, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
// import { useUI } from "@/context/UIContext";
import { ChevronDownIcon, IdentificationIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import useMediaQuery from "@/hooks/useMediaQuery";
import { isAxiosError } from "axios";
import api from "@/lib/axios";
import Button from "@/components/Button";
import { checkPassword } from "@/utils/validators";
import useUserStore from "@/stores/userStore";
import ConfirmModal from "./ConfirmModal";

// interface CreateUserModalProps {
//     onCreate: (user: UserFormData) => void;
// }

interface UserFormData {
    firstName: string;
    secondName: string;
    lastName: string;
    secondLastName: string;
    email: string;
    password: string;
    role: string;
}

type State = {
    formData: UserFormData;
    errors: Partial<Record<keyof UserFormData, string>>;
    currentPage: number;
    loading: boolean;
    error: string | null;
    passwordVisible: boolean;
};

type Action =
    | { type: 'SET_FORM_DATA'; field: keyof UserFormData; value: string }
    | { type: 'SET_ERRORS'; errors: Partial<Record<keyof UserFormData, string>> }
    | { type: 'SET_CURRENT_PAGE'; page: number }
    | { type: 'SET_LOADING'; loading: boolean }
    | { type: 'SET_ERROR'; error: string | null }
    | { type: 'RESET_FORM' };

const initialState: State = {
    formData: {
        firstName: '',
        secondName: '',
        lastName: '',
        secondLastName: '',
        email: '',
        password: '',
        role: '',
    },
    errors: {},
    currentPage: 1,
    loading: false,
    error: null,
    passwordVisible: false,
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_FORM_DATA':
            return {
                ...state,
                formData: { ...state.formData, [action.field]: action.value },
            };
        case 'SET_ERRORS':
            return { ...state, errors: action.errors };
        case 'SET_CURRENT_PAGE':
            return { ...state, currentPage: action.page };
        case 'SET_LOADING':
            return { ...state, loading: action.loading };
        case 'SET_ERROR':
            return { ...state, error: action.error };
        case 'RESET_FORM':
            return initialState;
        default:
            return state;
    }
};

const CreateUserModal = () => {
    // const { activeComponent, setActiveComponent } = useUI();
    // const componentId = 'createUserModal';
    // const isOpen = activeComponent.createUserModal === true;
    const { filters, closeModal, passwordVisible, togglePasswordVisibility } = useUserStore();
    const isOpen = filters.isModalOpen;
    const [state, dispatch] = useReducer(reducer, initialState);
    const isLargeScreen = useMediaQuery('(min-width: 640px)');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // TODO: Add domain state for educational email

    const validateField = (field: keyof UserFormData, value: string) => {
        let error = '';
        if (!value && (field === 'firstName' || field === 'lastName' || field === 'email' || field === 'password')) {
            error = 'Este campo es obligatorio';
        } else if (field === 'email' && !/\S+@\S+\.\S+/.test(value)) {
            error = 'Por favor ingrese un correo válido';
        } else if (field === 'password') {
            const { valid, message } = checkPassword(value);
            if (!valid) {
                error = message;
            }
        }
        dispatch({ type: 'SET_ERRORS', errors: { ...state.errors, [field]: error } });
        return !error;
    };

    const handleInputChange = (field: keyof UserFormData, value: string) => {
        const updatedValue = field.includes("Name") ? value.replace(/\b\w/g, (char) => char.toUpperCase()) : value;
        dispatch({ type: 'SET_FORM_DATA', field, value: updatedValue });
        validateField(field, updatedValue);
    };

    // const handleNextPage = () => setCurrentPage(currentPage + 1);
    const handlePrevPage = () => dispatch({ type: 'SET_CURRENT_PAGE', page: state.currentPage - 1 });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (state.currentPage === 1 && !isLargeScreen) return dispatch({ type: 'SET_CURRENT_PAGE', page: 2 });

        dispatch({ type: 'SET_LOADING', loading: true });
        dispatch({ type: 'SET_ERROR', error: null });

        try {
            const response = await api.post('/api/users', {
                first_name: state.formData.firstName,
                second_name: state.formData.secondName,
                last_name: state.formData.lastName,
                second_last_name: state.formData.secondLastName,
                email: state.formData.email,
                password: state.formData.password,
                role: state.formData.role,
            });
            if (response.status === 201) {
                // Handle success
                handleClose();
            } else {
                throw new Error("Error al crear el usuario");
            }
        } catch (error) {
            let errorMessage = "Error desconocido";
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || "Error al crear el usuario";
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            dispatch({ type: 'SET_ERROR', error: errorMessage });
        } finally {
            dispatch({ type: 'SET_LOADING', loading: false });
        }
    };

    const handleClose = () => {
        setIsConfirmModalOpen(true);
    };

    const handleConfirmClose = () => {
        closeModal();
        dispatch({ type: 'RESET_FORM' });
        setIsConfirmModalOpen(false);
    };

    return (
        <>
            <Dialog.Root open={isOpen} onOpenChange={handleClose}>
                <Dialog.Portal>
                    <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" onClick={handleClose} />
                        <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                            <Dialog.Title className="text-lg font-semibold mb-4">Crear Usuario</Dialog.Title>
                            <Dialog.Close asChild>
                                <button className='absolute top-2 right-2' onClick={handleClose} aria-label='Close'>
                                    <XMarkIcon className='h-5 w-5 text-gray-500' />
                                </button>
                            </Dialog.Close>
                            {state.error && (
                                <div className="mb-4 text-red-600 text-sm max-h-20 overflow-y-auto pt-3 sm:pb-3 sm:pt-0">
                                    {state.error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(state.currentPage === 1 || isLargeScreen) && (
                                        <>
                                            <Input
                                                label="Primer Nombre"
                                                type="text"
                                                value={state.formData.firstName}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                placeholder="Ej. Juan"
                                                required
                                                error={state.errors.firstName}
                                                disabled={state.loading}
                                            />
                                            <Input
                                                label="Segundo Nombre"
                                                type="text"
                                                value={state.formData.secondName}
                                                onChange={(e) => handleInputChange('secondName', e.target.value)}
                                                placeholder="Ej. Esteban"
                                                error={state.errors.secondName}
                                                disabled={state.loading}
                                            />
                                            <Input
                                                label="Primer Apellido"
                                                type="text"
                                                value={state.formData.lastName}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                placeholder="Ej. Perez"
                                                required
                                                error={state.errors.lastName}
                                                disabled={state.loading}
                                            />
                                            <Input
                                                label="Segundo Apellido"
                                                type="text"
                                                value={state.formData.secondLastName}
                                                onChange={(e) => handleInputChange('secondLastName', e.target.value)}
                                                placeholder="Ej. Rodriguez"
                                                error={state.errors.secondLastName}
                                                disabled={state.loading}
                                            />
                                        </>
                                    )}

                                    {(state.currentPage === 2 || isLargeScreen) && (
                                    <>
                                        <Input
                                            label="Correo Electrónico"
                                            type="email"
                                            value={state.formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="Ej. juan.perez@unimail.edu.co"
                                            required
                                            error={state.errors.email}
                                            disabled={state.loading}
                                        />
                                        <Input
                                            label="Contraseña"
                                            type={passwordVisible ? "text" : "password"}
                                            value={state.formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            placeholder="********"
                                            required
                                            error={state.errors.password}
                                            disabled={state.loading}
                                            showPasswordToggle
                                            onTogglePasswordVisibility={togglePasswordVisibility}
                                        />
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-700">Elegir Rol</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-2 flex items-center">
                                                    <IdentificationIcon className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <select
                                                    value={state.formData.role}
                                                    onChange={(e) => handleInputChange("role", e.target.value)}
                                                    className="appearance-none border border-gray-300 rounded p-2 pl-7 w-full text-sm"
                                                    required
                                                    disabled={state.loading}
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="1">Admin</option>
                                                    <option value="2">Usuario</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    )}
                                </div>
                                <div className="sm:hidden flex items-center justify-center gap-3 py-3">
                                    <button type="button" className={`rounded - lg h-2 w-2 ${state.currentPage == 1 ? 'bg-sky-600/60' : 'bg-slate-400/50'}`} onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', page: 1 })} disabled={state.loading}/>
                                    <button type="button" className={`rounded - lg h-2 w-2 ${state.currentPage == 2 ? 'bg-sky-600/60' : 'bg-slate-400/50'}`} onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', page: 2 })} disabled={state.loading}/>
                                </div>
                                <div className='flex flex-col gap-2 border-t border-gray-300 sm:flex-row-reverse sm:pt-3 '>
                                    <Button
                                        type="submit"
                                        customClasses="h-9 text-sm bg-sky-600 text-white rounded-md sm:w-1/2"
                                        isLoading={state.loading}
                                        text={(state.currentPage === 1 && !isLargeScreen) ? 'Siguiente' : 'Confirmar'}
                                    />
                                    <Button
                                        type="button"
                                        customClasses="h-9 text-sm border border-gray-300 rounded-md sm:w-1/2"
                                        isLoading={state.loading}
                                        text={state.currentPage === 1 ? 'Cancelar' : 'Anterior'}
                                        onClick={state.currentPage === 1 ? handleClose : handlePrevPage}
                                    />
                                </div>
                            </form>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmClose}
                message="¿Estás seguro de que deseas cancelar la creación del usuario? Se perderán todos los cambios."
            />
        </>
    );
};

interface InputProps {
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    className?: string;
    showPasswordToggle?: boolean;
    onTogglePasswordVisibility?: () => void;
}

const Input = ({ label, type, value, onChange, placeholder = "", required = false, error, disabled = false, className = "", showPasswordToggle = false, onTogglePasswordVisibility }: InputProps) => (
    <div className={`flex flex-col ${className}`}>
        <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            />
            {showPasswordToggle && (
                <button
                    type="button"
                    onClick={onTogglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none"
                >
                    {type === "password" ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
            )}
        </div>
        {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
);

export default CreateUserModal;