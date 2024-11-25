import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "@/reports/style/form.css";
import { Dialog, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverGroup, PopoverPanel } from "@headlessui/react";
import { ArrowPathIcon, Bars3Icon, ChartPieIcon, FingerPrintIcon, SquaresPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axiosClient from "@/utils/axios-client";
import {
  ChevronDownIcon,
  // PhoneIcon,
  // PlayCircleIcon
} from "@heroicons/react/20/solid";
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
const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = () => {
      axiosClient.get("/alerts?page=1&page_size=10")
        .then(response => {
          const newNotifications = response.data.data.map(alert => ({
            id: alert.node_id,
            name: alert.title,
            message: alert.description,
            status: alert.status,
            time: alert.alert_date,
          }));
          if (JSON.stringify(newNotifications) !== JSON.stringify(notifications)) {
            setNotifications(newNotifications);
            setHasNewNotifications(true); // Set that there are new notifications
          }
        })
        .catch(err => console.error(err));
    };

    fetchNotifications(); // Call immediately when the component mounts
    // 2 minutos -> 120000
    // 4 minutos -> 240000
    // 1 minuto -> 60000
    const interval = setInterval(fetchNotifications, 60000); // Repeat every 4 minutes

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [notifications]);

  return (
    <>
      <nav aria-label="Global" className="flex items-center justify-between mx-auto max-w-7xl w-full lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Company</span>
            <Image
              alt="Company"
              src="/assets/images/logos/IUB_logo_sh_md.png"
              width={80}
              height={59}
            />
          </Link>
        </div>
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
        <div className="hidden lg:flex lg:space-x-12">
          <Link href="/dashboard/wetland" className="text-sm font-semibold leading-6 text-white">Inicio</Link>
          <Link href="/dashboard/map" className="text-sm font-semibold leading-6 text-white">Maps</Link>
          {/* <Popover className="relative">
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
          </Popover> */}

          <Link href="/dashboard/report" className="text-sm font-semibold leading-6 text-white">Reportes</Link>
          <Link href="/dashboard/alarm" className="text-sm font-semibold leading-6 text-white">Alarmas</Link>
        </div>
        <div className="relative ml-32 z-50">
          {hasNewNotifications && (
            <div className="absolute bottom-auto left-auto right-2 top-2 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-80 scale-y-100 rounded-full bg-pink-700 p-1 text-[4px]"></div>
          )}
          <button onClick={() => { setIsOpen(!isOpen); setHasNewNotifications(false); }} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <Bell className="h-6 w-6 text-white" />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden ">
              <div className="p-4 border-b border-gray-100">
                <p className="text-gray-600">Tienes <span className="text-[#00bcd4] font-medium">{notifications.filter((e)=> e.status === 'Active').length}</span> notificaciones.</p>
              </div>
              <div className="max-h-[400px] overflow-y-auto scrollbar">
                {notifications.filter((e)=> e.status === 'Active').map((notification) => (
                  <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{notification.name}</h3>
                        <p className="text-[10px] text-gray-600">{notification.message}</p>
                      </div>
                      <p className="text-xs text-gray-400">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-center items-center">
                <Link href="/dashboard/alarm" className="w-full text-center text-[#00bcd4] hover:text-[#00acc1] text-sm font-medium">Ver Todas</Link>
              </div>
            </div>
          )}
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white p-[0.63rem] sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="-m-2.5 rounded-md p-2.5 text-gray-700">
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default Navbar;
