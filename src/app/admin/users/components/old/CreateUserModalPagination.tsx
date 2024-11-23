// import { FormEvent, useState } from "react";
// import Modal from "@/components/Modal";
// import { useUI } from "@/context/UIContext";

// interface CreateUserModalProps {
//     onCreate: (user: { name: string, lastName: string, email: string, password: string, role: string }) => void;
// }

// const CreateUserModal = ({ onCreate }: CreateUserModalProps) => {
//     const { activeComponent, setActiveComponent } = useUI();
//     const componentId = 'createUserModal';
//     const isOpen = activeComponent.createUserModal === true;

//     // Controla la paginacion en móviles
//     const [currentPage, setCurrentPage] = useState(0);
//     const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, 2));
//     const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

//     const [name, setName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [role, setRole] = useState('');

//     // TODO: Add domain state for educational email

//     const handleClose = () => setActiveComponent(componentId, false);

//     const handleSubmit = (e: FormEvent) => {
//         e.preventDefault();
//         onCreate({ name, lastName, email, password, role });
//         handleClose();
//         console.log('Crear usuario:', { name, lastName, email, password, role });
//     };

//     return (
//         <Modal componentId={componentId} title="Crear Usuario">
//             <div className="block sm:hidden">
//                 {currentPage === 0 && (
//                     <div className="flex flex-col gap-4">
//                         <Input
//                             label="Nombre"
//                             type="text"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             placeholder="Ej. Juan"
//                             required
//                         />
//                         <Input
//                             label="Apellido"
//                             type="text"
//                             value={lastName}
//                             onChange={(e) => setLastName(e.target.value)}
//                             placeholder="Ej. Perez"
//                             required
//                         />
//                         <Input
//                             label="Contraseña"
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder="********"
//                             required
//                         />
//                     </div>
//                 )}

//                 {currentPage === 1 && (
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Rol</label>
//                         <select
//                             value={role}
//                             onChange={(e) => setRole(e.target.value)}
//                             className="border border-gray-300 rounded px-4 py-2 w-full"
//                             required
//                         >
//                             <option value="">Seleccionar...</option>
//                             <option value="admin">Admin</option>
//                             <option value="user">Usuario</option>
//                         </select>
//                     </div>
//                 )}
                
//                 <div className="flex justify-center gap-4 mt-4">
//                     <button onClick={prevPage} className="h-2 w-2 rounded-lg bg-gray-400"/>
//                     <button onClick={nextPage} className="h-2 w-2 rounded-lg bg-gray-400"/>
//                 </div>
//             </div>
//         </Modal>
//     );
// }

// const Input = ({ label, type, value, onChange, className = "", placeholder = "", required = false }) => {
//     return (
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
//             <input
//                 type={type}
//                 value={value}
//                 onChange={onChange}
//                 className={`text-sm border border-gray-300 rounded p-2 w-full ${className}`}
//                 placeholder={placeholder}
//                 required={required}
//             />
//         </div>
//     );
// }

// export default CreateUserModal;