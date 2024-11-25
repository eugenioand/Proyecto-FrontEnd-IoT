import * as Dialog from '@radix-ui/react-dialog';
import Button from "@/components/Button";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }: ConfirmModalProps) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <Dialog.Title className="text-lg font-semibold mb-4">Confirmar Acción</Dialog.Title>
                        <p className="mb-4">{message}</p>
                        <div className='flex flex-col gap-2 sm:flex-row-reverse'>
                            <Button
                                type="button"
                                customClasses="h-9 text-sm bg-red-600 text-white rounded-md sm:w-1/2"
                                text="Cerrar"
                                onClick={onConfirm}
                            />
                            <Button
                                type="button"
                                customClasses="h-9 text-sm border border-gray-300 rounded-md sm:w-1/2"
                                text="Cancelar"
                                onClick={onClose}
                            />
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ConfirmModal;