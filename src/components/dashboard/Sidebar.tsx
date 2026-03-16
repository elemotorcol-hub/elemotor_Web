'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Car, Map, FileText, Settings, User, Headset, LucideIcon, LogOut, Wrench, FolderOpen, X } from 'lucide-react';
import { logoutAction } from '@/actions/authActions';

interface SidebarProps {
    isCollapsed?: boolean;
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}

const MENU_ITEMS = [
    { name: 'Resumen', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mi Vehículo', href: '/dashboard/vehiculo', icon: Car },
    { name: 'Mantenimiento', href: '/dashboard/mantenimiento', icon: Wrench },
    { name: 'Rastrear Pedido', href: '/dashboard/rastreo', icon: Map },
    { name: 'Mis Cotizaciones', href: '/dashboard/cotizaciones', icon: FileText },
    { name: 'Documentos', href: '/dashboard/documentos', icon: FolderOpen },
];

const BOTTOM_MENU_ITEMS = [
    { name: 'Mi Perfil', href: '/dashboard/perfil', icon: User },
];

export function Sidebar({ isCollapsed = false, isMobileOpen = false, onMobileClose }: SidebarProps) {
    const pathname = usePathname();

    const renderMenuItem = (item: { name: string, href: string, icon: LucideIcon }) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={() => onMobileClose?.()}
                className={`flex items-center gap-3 px-4 py-3 transition-all font-semibold text-sm ${isActive
                    ? 'bg-emerald-950/30 rounded-full text-emerald-400'
                    : 'text-slate-400 hover:text-white rounded-full hover:bg-white/5'
                    } ${isCollapsed ? 'justify-center px-0 opacity-0 pointer-events-none' : ''}`}
                title={isCollapsed ? item.name : undefined}
            >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
        );
    };

    return (
        <aside className={`
            bg-[#0A110F] h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800/50 z-50 transition-all duration-300 ease-in-out
            ${isMobileOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0'}
            ${isCollapsed ? 'lg:w-0 lg:opacity-0 lg:pointer-events-none lg:border-none' : 'lg:w-[260px]'}
        `}>
            {/* Logo — fijo al top */}
            <div className={`flex shrink-0 h-16 w-full items-center border-b border-slate-800/60 px-6 ${isCollapsed ? 'opacity-0' : 'justify-between'}`}>
                {!isCollapsed ? (
                    <Link href="/">
                        <Image
                            src="/logo-elementor1.avif"
                            alt="Elemotor"
                            width={140}
                            height={35}
                            className="object-contain"
                            priority
                        />
                    </Link>
                ) : null}
                
                {/* Mobile Close Button */}
                {!isCollapsed && (
                    <button 
                        onClick={onMobileClose}
                        className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Zona scrollable */}
            <div className="flex-1 overflow-y-auto flex flex-col no-scrollbar">
                {/* Main Navigation */}
                <nav className={`flex-1 px-4 mt-4 flex flex-col gap-1 ${isCollapsed ? 'items-center px-2' : ''}`}>
                    {MENU_ITEMS.map(renderMenuItem)}

                    <div className={`mt-8 mb-4 border-t border-slate-800/30 mx-2 ${isCollapsed ? 'w-full' : ''}`}></div>

                    {BOTTOM_MENU_ITEMS.map(renderMenuItem)}

                    <form action={logoutAction} className="w-full mt-2 space-y-2">
                        <button
                            type="submit"
                            className={`flex w-full items-center gap-3 px-4 py-3 transition-all font-semibold text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full ${isCollapsed ? 'justify-center px-0' : ''}`}
                            title={isCollapsed ? 'Cerrar Sesión' : undefined}
                        >
                            <LogOut className="w-5 h-5 shrink-0 text-red-500" />
                            {!isCollapsed && <span>Cerrar Sesión</span>}
                        </button>
                    </form>
                </nav>

                {/* Help Widget */}
                {!isCollapsed && (
                    <div className="p-4 mb-6">
                        <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                            <div className="w-8 h-8 rounded-full bg-emerald-900/20 flex items-center justify-center mb-3">
                                <Headset className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h4 className="text-white font-bold text-sm mb-1.5">¿Necesitas ayuda?</h4>
                            <p className="text-slate-400 text-xs leading-relaxed mb-4 pr-2">
                                Contacta a nuestro equipo de soporte.
                            </p>
                            <button className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-slate-300 text-xs font-bold py-2.5 rounded-lg transition-colors">
                                Contactar Soporte
                            </button>
                            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-500 opacity-5 blur-xl rounded-full pointer-events-none"></div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
