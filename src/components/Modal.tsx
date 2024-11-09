import React, { FormEvent, ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUI } from "@/context/UIContext";

interface ModalProps {
    componentId: string;
    title: string;
    children: ReactNode;
}

// const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
const Modal = ({ componentId, title, children }: ModalProps) => {
    const { activeComponent, setActiveComponent } = useUI();
    const isOpen = activeComponent[componentId] === true;
    // if (!isOpen) return null;

    const handleClose = () => {setActiveComponent(componentId, !isOpen);}

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow"/>
                <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
                    <div className='flex flex-row justify-between px-3 py-4 border-b border-gray-300 focus:outline-none'>
                        <div className='flex flex-col'>
                            <Dialog.Title className='text-left text-base font-semibold overflow-hidden'>{title}</Dialog.Title>
                            {/* <Dialog.Description className='text-gray-500 text-xs'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, officia!</Dialog.Description> */}
                        </div>
                        <Dialog.Close asChild>
                            <button className='self-start' onClick={handleClose} aria-label='Close'>
                                <XMarkIcon className='h-5 w-5 text-gray-500' />
                            </button>
                        </Dialog.Close>
                    </div>
                    <div className='px-3 py-4'>{children}</div>
                    {/* confirm and cancel button */}
                    
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default Modal;