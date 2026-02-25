'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
    { name: 'Modelos', href: '#modelos' },
    { name: 'Beneficios', href: '#beneficios' },
    { name: 'Showroom', href: '#showroom' },
    { name: 'Contacto', href: '#contacto' },
];

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
                scrolled
                    ? 'bg-slate-900/80 backdrop-blur-md border-white/10 py-3'
                    : 'bg-transparent border-transparent py-5'
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-cyan-400 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                        <Zap className="w-6 h-6 text-slate-900 fill-current" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white uppercase">
                        EleMotor
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button variant="primary" className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-bold px-6">
                        COTIZAR
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top-5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium text-white hover:text-cyan-400"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button variant="primary" className="bg-cyan-400 text-slate-900 font-bold w-full">
                        COTIZAR AHORA
                    </Button>
                </div>
            )}
        </nav>
    );
}
