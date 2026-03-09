'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu, X, User, Globe } from 'lucide-react';

// Tipado para los submenús
interface SubMenuItem {
    name: string;
    href: string;
    description?: string;
}

interface NavItem {
    name: string;
    href?: string;
    subMenu?: SubMenuItem[];
}

const NAVIGATION_ITEMS: NavItem[] = [
    {
        name: 'Modelos',
        href: '/modelos',
        subMenu: [
            { name: 'Ver Catálogo', href: '/modelos', description: 'Explora nuestra gama exclusiva' },
            { name: 'Comparar', href: '/comparar', description: 'Encuentra el ideal para ti' },
        ],
    },
    {
        name: 'Experiencia',
        subMenu: [
            { name: 'Showroom 3D', href: '/showroom', description: 'Vive la inmersión digital' },
            { name: 'Calculadora', href: '/calculadora', description: 'Descubre tu ahorro eléctrico' },
        ],
    },
    {
        name: 'Servicios',
        subMenu: [
            { name: 'Talleres', href: '#talleres', description: 'Mantenimiento especializado' },
            { name: 'Postventa', href: '#postventa', description: 'Soporte premium 24/7' },
            { name: 'Cómo Cargo', href: '#carga', description: 'Guía de estaciones y carga' },
        ],
    },
    { name: 'Nosotros', href: '/nosotros' },
];

/* ─────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────── */

function NavItemDesktop({ item }: { item: NavItem }) {
    if (item.subMenu) {
        return (
            <div className="relative group/nav py-2">
                <button
                    className="flex items-center gap-1.5 text-[14px] font-semibold text-white group-hover/nav:text-[#00D4AA] transition-colors tracking-wide drop-shadow-md"
                    aria-label={`Abrir submenú de ${item.name}`}
                    aria-expanded="false"
                >
                    {item.name}
                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover/nav:rotate-180 text-gray-500" aria-hidden="true" />
                </button>

                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform group-hover/nav:translate-y-0 translate-y-2">
                    <div className="bg-[#0D1525] border border-white/10 p-5 rounded-xl w-60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                        <div className="space-y-4">
                            {item.subMenu.map((sub) => (
                                <Link key={sub.name} href={sub.href} className="block group/sub">
                                    <span className="block text-sm font-semibold text-white group-hover/sub:text-[#00D4AA] transition-colors">
                                        {sub.name}
                                    </span>
                                    <span className="block text-[10px] text-gray-500 group-hover/sub:text-gray-400 mt-1">
                                        {sub.description}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link
            href={item.href || '#'}
            className="text-[14px] font-semibold text-white hover:text-[#00D4AA] transition-colors tracking-wide drop-shadow-md"
        >
            {item.name}
        </Link>
    );
}

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [activeAccordion, setActiveAccordion] = React.useState<string | null>(null);

    // Lógica de Scroll para Glassmorphism
    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Bloquear scroll quando el menú móvil está abierto
    React.useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    }, [mobileMenuOpen]);

    const toggleAccordion = (name: string) => {
        setActiveAccordion(activeAccordion === name ? null : name);
    };

    return (
        <>
            <nav
                className={cn(
                    'fixed top-0 w-full z-50 transition-all duration-500 ease-in-out',
                    isScrolled
                        ? 'bg-[#0A0F1C]/80 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl'
                        : 'bg-transparent py-6'
                )}
            >
                <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between gap-4">
                    <Link href="/" className="relative z-[60] flex items-center group flex-shrink-0">
                        <Image
                            src="/logo-elementor1.avif"
                            alt="EleMotor Logo"
                            width={180}
                            height={40}
                            priority
                            className="h-8 md:h-10 w-auto object-contain brightness-110"
                        />
                    </Link>

                    {/* Menú Desktop (Centro) */}
                    <div className="hidden lg:flex items-center gap-10">
                        {NAVIGATION_ITEMS.map((item) => (
                            <NavItemDesktop key={item.name} item={item} />
                        ))}
                    </div>

                    {/* Acciones (Derecha) */}
                    <div className="hidden lg:flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[14px] font-medium mr-4">
                            <span className="text-white cursor-pointer hover:text-[#00D4AA] transition-colors">ES</span>
                            <span className="text-gray-500">/</span>
                            <span className="text-gray-300 cursor-pointer hover:text-white transition-colors">EN</span>
                        </div>

                        <div className="h-5 w-[1px] bg-white/10 mx-1 hidden xl:block" />

                        <div className="flex items-center gap-6">
                            <Link href="/auth/login" className="text-[14px] font-medium text-gray-300 hover:text-[#00D4AA] transition-colors tracking-wide drop-shadow-md">
                                Iniciar Sesión
                            </Link>
                            <Link href="/auth/register" className="text-[13px] font-bold text-white hover:text-[#0A0F1C] hover:bg-[#00D4AA] transition-all px-4 py-2 border border-white/20 rounded-full tracking-wide">
                                Registrarse
                            </Link>
                        </div>

                        <Link
                            href="/cotizar"
                            className="bg-[#00D4AA] hover:bg-[#00B38F] text-[#0A0F1C] font-bold text-[14px] px-7 py-2.5 rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(0,212,170,0.2)] hover:shadow-[0_6px_20px_rgba(0,212,170,0.3)] active:scale-95"
                        >
                            Cotizar
                        </Link>
                    </div>

                    {/* Controles Mobile */}
                    <div className="flex items-center gap-4 lg:hidden relative z-[60]">
                        <Link
                            href="#cotizar"
                            className="bg-[#00D4AA] text-[#0A0F1C] font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-tighter shadow-lg"
                        >
                            Cotizar
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white p-2 bg-white/5 rounded-xl border border-white/10 shadow-lg"
                            aria-label={mobileMenuOpen ? "Cerrar menú principal" : "Abrir menú principal"}
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Menú Móvil Fullscreen Overlay */}
            <div
                className={cn(
                    'fixed inset-0 z-[55] bg-[#0A0F1C] transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] lg:hidden overflow-y-auto px-6 pt-32 pb-10',
                    mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
                )}
            >
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 50% 50%, #00D4AA 0%, transparent 70%)' }}>
                </div>

                <div className="flex flex-col gap-8 relative z-10">
                    {NAVIGATION_ITEMS.map((item) => (
                        <div key={item.name} className="border-b border-white/5 pb-4">
                            {item.subMenu ? (
                                <div>
                                    <button
                                        onClick={() => toggleAccordion(item.name)}
                                        className="flex items-center justify-between w-full text-2xl font-black text-white uppercase tracking-tighter"
                                        aria-label={`Expandir opciones de ${item.name}`}
                                        aria-expanded={activeAccordion === item.name}
                                    >
                                        {item.name}
                                        <ChevronDown className={cn(
                                            "w-6 h-6 text-[#00D4AA] transition-transform duration-500",
                                            activeAccordion === item.name ? "rotate-180" : ""
                                        )} aria-hidden="true" />
                                    </button>
                                    <div className={cn(
                                        "overflow-hidden transition-all duration-500 ease-in-out",
                                        activeAccordion === item.name ? "max-h-96 mt-6 opacity-100" : "max-h-0 opacity-0"
                                    )}>
                                        <div className="grid grid-cols-1 gap-4 pl-4">
                                            {item.subMenu.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className="group"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <span className="block text-lg font-bold text-gray-300 group-active:text-[#00D4AA]">{sub.name}</span>
                                                    <span className="block text-xs text-gray-500 uppercase tracking-widest">{sub.description}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href={item.href || '#'}
                                    className="text-2xl font-black text-white uppercase tracking-tighter block"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <button className="flex flex-col items-center justify-center gap-2 p-6 rounded-3xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest">
                            <Globe className="w-6 h-6 text-[#00D4AA]" />
                            ES / EN
                        </button>
                        <Link href="/auth/login" className="flex flex-col items-center justify-center gap-2 p-6 rounded-3xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest">
                            <User className="w-6 h-6 text-[#00D4AA]" />
                            Mi Cuenta
                        </Link>
                    </div>

                    <p className="text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em] mt-8">
                        Vanguardia en Movilidad Eléctrica
                    </p>
                </div>
            </div>
        </>
    );
}
