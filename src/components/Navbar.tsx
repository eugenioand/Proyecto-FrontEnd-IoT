import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react'
import {
    ArrowPathIcon,
    Bars3Icon,
    ChartPieIcon,
    // CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { 
    ChevronDownIcon,
    // PhoneIcon,
    // PlayCircleIcon
} from '@heroicons/react/20/solid';

import Image from "next/image";

// const navigation = [
//     { name: 'Inicio', href: '#' },
//     { name: 'Maps', href: '#' },
//     { name: 'Administración', href: '#' },
//     { name: 'Reportes', href: '#' },
// ]


const subAdminNav = [
    { name: 'Usuarios', description: 'Administra los usuarios de la plataforma', href: '#', icon: FingerPrintIcon },
    { name: 'Humedales', description: 'Administra los humedales de la plataforma', href: '#', icon: SquaresPlusIcon },
    { name: 'Sensores', description: 'Administra los sensores de los humedales', href: '#', icon: ChartPieIcon },
    // { name: 'Estadísticas', description: 'Visualiza las estadísticas de los humedales', href: '#', icon: CursorArrowRaysIcon },
    { name: 'Reportes', description: 'Visualiza los reportes de los humedales', href: '#', icon: ArrowPathIcon },
]


const Navbar = () => {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    console.log(pathname);
    return (
        <>
            <nav aria-label="Global" className="flex items-center justify-between mx-auto max-w-7xl w-full lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Fabian Company</span>
                        <Image
                            alt="Logo de Fabian Company"
                            src="/assets/images/logos/IUB_logo_sh_md.png"
                            width={80}
                            height={59}
                            // className="h-14 w-auto"
                        />
                    </a>
                </div>
                {
                    pathname == '/dashboard/map' && (
                        <div className='lg:hidden'>
                            <input type="text" placeholder='Buscar humedales...' className='px-4 py-2 rounded-md placeholder-gray-400 text-black' />
                        </div>
                    )
                }
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:space-x-12">
                    <a href="/dashboard/wetland" className="text-sm font-semibold leading-6 text-white">
                        Inicio
                    </a>
                    <a href="map" className="text-sm font-semibold leading-6 text-white">
                        Maps
                    </a>
                    <Popover className="relative">
                        <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-white">
                            Administración
                            <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
                        </PopoverButton>
                        <PopoverPanel
                            transition
                            className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl shadow-lg ring-gray-900/5 transition data-[closed]::translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                            <div className="p-4 bg-white">
                                {subAdminNav.map((item) => (
                                    <div
                                        key={item.name}
                                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                                    >
                                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                            <item.icon aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
                                        </div>
                                        <div className="flex-auto">
                                            <a href={item.href} className="block font-semibold text-gray-900">
                                                {item.name}
                                                <span className="absolute inset-0"></span>
                                            </a>
                                            <p className="mt-1 text-gray-600">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PopoverPanel>
                    </Popover>
                    <a href="/dashboard/report" className="text-sm font-semibold leading-6 text-white">
                        Reportes
                    </a>
                </PopoverGroup>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">

                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white p-[0.63rem] sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Fabian Company</span>
                            <Image
                                alt="Logo de Fabian Company"
                                src="/assets/images/logos/IUB_logo_sh_md_blue.png"
                                width={80}
                                height={59}
                                // className="h-16 w-auto"
                                />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <a
                                    href="/dashboard/wetland"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Inicio
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Maps
                                </a>
                                <Disclosure as="div" className="-mx-3">
                                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                        Administración
                                        <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none group-data-[open]:rotate-180" />
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 space-y-2">
                                        {[...subAdminNav].map((item) => (
                                            <DisclosureButton
                                                key={item.name}
                                                as="a"
                                                href={item.href}
                                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                            >
                                                {item.name}
                                            </DisclosureButton>
                                        ))}
                                    </DisclosurePanel>
                                </Disclosure>
                                
                                <a
                                    href="/dashboard/report"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Reportes
                                </a>
                            </div>
                            <div className="py-6">
                                
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </>
    );
};

export default Navbar;