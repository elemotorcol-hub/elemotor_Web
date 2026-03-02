'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Car, Map, FileText, Settings, User, PhoneCall, Zap } from 'lucide-react';

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

    const renderMenuItem = (item: { name: string, href: string, icon: React.ElementType }) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
            <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${isActive
                        ? 'bg-white/5 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
            >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#10B981]' : ''}`} />
                {item.name}
            </Link>
        );
    };

    return (
        <aside className="w-[260px] bg-[#0A110F] border-r border-white/5 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto hidden lg:flex">
            {/* Logo */}
            <div className="p-6">
                <Link href="/" className="flex items-center gap-3 relative z-[60] group">
                    <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-[#0A110F]" fill="currentColor" />
                    </div>
                    <div>
                        <span className="text-white font-bold text-lg tracking-tight leading-none block">Elemotor</span>
                        <span className="text-[10px] text-slate-500 font-medium tracking-wide">Client Dashboard</span>
                    </div>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 mt-6 flex flex-col gap-1">
                {MENU_ITEMS.map(renderMenuItem)}

                <div className="my-6 border-t border-white/5 mx-2"></div>

                {BOTTOM_MENU_ITEMS.map(renderMenuItem)}
            </nav>

            {/* Help Widget */}
            <div className="p-4 mt-auto">
                <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-3">
                        <PhoneCall className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1.5">¿Necesitas ayuda?</h4>
                    <p className="text-slate-400 text-xs leading-relaxed mb-4 pr-2">
                        Contacta a nuestro equipo de soporte premium.
                    </p>
                    <button className="w-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2.5 rounded-lg transition-colors">
                        Contactar Soporte
                    </button>
                    {/* Background glow decoration */}
                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#10B981] opacity-[0.03] blur-xl rounded-full pointer-events-none"></div>
                </div>
            </div>
        </aside>
    );
}
