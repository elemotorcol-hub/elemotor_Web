'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Car, Map, FileText, Settings, User, Headset, LucideIcon, LogOut } from 'lucide-react';
import { logoutAction } from '@/actions/authActions';

const MENU_ITEMS = [
    { name: 'Resumen', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mi Vehículo', href: '/dashboard/vehiculo', icon: Car },
    { name: 'Rastrear Pedido', href: '/dashboard/rastreo', icon: Map },
    { name: 'Mis Cotizaciones', href: '/dashboard/cotizaciones', icon: FileText },
    { name: 'Documentos', href: '/dashboard/documentos', icon: FileText },
];

const BOTTOM_MENU_ITEMS = [
    { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
    { name: 'Mi Perfil', href: '/dashboard/perfil', icon: User },
];

export function Sidebar() {
    const pathname = usePathname();

    const renderMenuItem = (item: { name: string, href: string, icon: LucideIcon }) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
            <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 transition-all font-semibold text-sm ${isActive
                    ? 'bg-emerald-950/30 rounded-full text-emerald-400'
                    : 'text-slate-400 hover:text-white rounded-full hover:bg-white/5'
                    }`}
            >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {item.name}
            </Link>
        );
    };

    return (
        <aside className="w-[260px] bg-[#0A110F] h-screen flex flex-col fixed left-0 top-0 hidden lg:flex border-r border-slate-800/50 z-50">
            {/* Logo — fijo al top, fuera del scroll */}
            <div className="flex-shrink-0 flex h-16 w-full items-center justify-center border-b border-slate-800/60 px-6">
                <Link href="/">
                    <Image
                        src="/logo-elementor1.avif"
                        alt="Elemotor"
                        width={160}
                        height={40}
                        className="object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* Zona scrollable */}
            <div className="flex-1 overflow-y-auto flex flex-col">
                {/* Main Navigation */}
                <nav className="flex-1 px-4 mt-4 flex flex-col gap-1">
                    {MENU_ITEMS.map(renderMenuItem)}

                    <div className="mt-8 mb-4 border-t border-slate-800/30 mx-2"></div>

                    {BOTTOM_MENU_ITEMS.map(renderMenuItem)}

                    <form action={logoutAction} className="w-full mt-2 space-y-2">
                        <button
                            type="submit"
                            className="flex w-full items-center gap-3 px-4 py-3 transition-all font-semibold text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full"
                        >
                            <LogOut className="w-5 h-5 text-red-500" />
                            Cerrar Sesión
                        </button>
                    </form>
                </nav>

                {/* Help Widget */}
                <div className="p-4 mb-6">
                    <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-emerald-900/20 flex items-center justify-center mb-3">
                            <Headset className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1.5">¿Necesitas ayuda?</h4>
                        <p className="text-slate-400 text-xs leading-relaxed mb-4 pr-2">
                            Contacta a nuestro equipo de soporte premium.
                        </p>
                        <button className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-slate-300 text-xs font-bold py-2.5 rounded-lg transition-colors">
                            Contactar Soporte
                        </button>
                        {/* Background glow decoration */}
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-500 opacity-5 blur-xl rounded-full pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
