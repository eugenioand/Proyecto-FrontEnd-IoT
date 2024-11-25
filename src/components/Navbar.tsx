import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "@/reports/style/form.css";
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
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  // CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  // PhoneIcon,
  // PlayCircleIcon
} from "@heroicons/react/20/solid";

import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import axiosClient from "@/utils/axios-client";
import { set } from "date-fns";
import { formatDate } from "@/lib/utils";

// const navigation = [
//     { name: 'Inicio', href: '#' },
//     { name: 'Maps', href: '#' },
//     { name: 'Administración', href: '#' },
//     { name: 'Reportes', href: '#' },
// ]

const subAdminNav = [
  {
    name: "Usuarios",
    description: "Administra los usuarios de la plataforma",
    href: "/admin/users",
    icon: FingerPrintIcon,
  },
  {
    name: "Humedales",
    description: "Administra los humedales de la plataforma",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Sensores",
    description: "Administra los sensores de los humedales",
    href: "/admin/sensors",
    icon: ChartPieIcon,
  },
  // { name: 'Estadísticas', description: 'Visualiza las estadísticas de los humedales', href: '#', icon: CursorArrowRaysIcon },
  {
    name: "Reportes",
    description: "Visualiza los reportes de los humedales",
    href: "#",
    icon: ArrowPathIcon,
  },
];

interface Notification {
  id: number;
  avatar?: string;
  name: string;
  message: string;
  time: string;
}
const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications,setNotifications] = useState<Notification[]>([
    
  ]);

  useEffect(() => {
  

    interface AlertResponse {
      description: string;
      node_id: number;
      alert_date: string;
      title: string;
    }

    interface ApiResponse {
      data: AlertResponse[];
    }

    axiosClient.get<ApiResponse>("/alerts?page=1&page_size=10")
      .then((res) => res)
      .then(({data}) => setNotifications(data.data.map((alert) => ({
        id: alert.node_id,
        // avatar: "/assets/images/avatars/avatar-1.jpg",
        name: alert.title,
        message: alert.description,
        time: alert.alert_date,
      }))))
      .catch((err) => console.error(err));



 
    


  }
  , []);

  return (
    <>
      <nav
        aria-label="Global"
        className="flex items-center justify-between mx-auto max-w-7xl w-full lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Company</span>
            <Image
              alt="Company"
              src="/assets/images/logos/IUB_logo_sh_md.png"
              width={80}
              height={59}
              // className="h-14 w-auto"
            />
          </Link>
        </div>
        {pathname == "/dashboard/map" && (
          <div className="lg:hidden">
            <input
              type="text"
              placeholder="Buscar humedales..."
              className="px-4 py-2 rounded-md placeholder-gray-400 text-black"
            />
          </div>
        )}
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
          <Link
            href="/dashboard/wetland"
            className="text-sm font-semibold leading-6 text-white"
          >
            Inicio
          </Link>
          <Link
            href="/dashboard/map"
            className="text-sm font-semibold leading-6 text-white"
          >
            Maps
          </Link>
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-white">
              Administración
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 flex-none text-gray-400"
              />
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
                      <item.icon
                        aria-hidden="true"
                        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <div className="flex-auto">
                      <Link
                        href={item.href}
                        className="block font-semibold text-gray-900"
                      >
                        {item.name}
                        <span className="absolute inset-0"></span>
                      </Link>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          <Link
            href="/dashboard/report"
            className="text-sm font-semibold leading-6 text-white"
          >
            Reportes
          </Link>
          <Link
            href="/dashboard/alarm"
            className="text-sm font-semibold leading-6 text-white"
          >
            Alarmas
          </Link>
        </PopoverGroup>
        <div className="relative ml-32 z-50">
          <div className="absolute bottom-auto left-auto right-2 top-2 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-80 scale-y-100 rounded-full bg-pink-700 p-1 text-[4px]"></div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Bell className="h-6 w-6 text-white" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden ">
              <div className="p-4 border-b border-gray-100">
                <p className="text-gray-600">
                  Tu Tienes{" "}
                  <span className="text-[#00bcd4] font-medium">{notifications.length}</span>{" "}
                  notificaciones.
                </p>
              </div>

              <div className="max-h-[400px] overflow-y-auto scrollbar">
                {notifications.map((notification) => {
                  console.log({notification})
                  return (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* <Image
                            alt="avatar"
                            src={notification.avatar}
                            width={40}
                            height={40}
                            className="rounded-full"
                          /> */}
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {notification.name}
                            </h3>
                            <p className="text-[10px] text-gray-600">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">
                          {formatDate(notification.time,{month:"2-digit"}) }
                        </p>
                      </div>
                    </div>
                  );
                } 
                )}
              </div>

              <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-center items-center">
                <Link
                  className="w-full text-center text-[#00bcd4] hover:text-[#00acc1] text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                  href={`/dashboard/alarm`}
                >
                  Ver Todas
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white p-[0.63rem] sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Company</span>
              <Image
                alt="Company"
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
                <Link
                  href="/dashboard/wetland"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Inicio
                </Link>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Maps
                </Link>
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Administración
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                    />
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

                <Link
                  href="/dashboard/report"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Reportes
                </Link>
              </div>
              <div className="py-6"></div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default Navbar;
