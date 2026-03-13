'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LogOut, Menu, ChevronLeft, User, Lock, Mail, X, CheckCircle2 } from 'lucide-react';
import AdminSidebarNav from '@/app/admin/AdminSidebarNav';
import { logoutAction } from '@/actions/authActions';

interface SessionUser {
    id?: string;
    name: string;
    email: string;
}

export default function AdminLayoutWrapper({ children, session }: { children: React.ReactNode, session: SessionUser }) {
    // Initialize from localStorage if available, otherwise default to true
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    
    // Form state
    const [profileData, setProfileData] = useState({ name: session.name, email: session.email });
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const storedState = localStorage.getItem('isSidebarOpen');
        if (storedState !== null) {
            setIsSidebarOpen(storedState === 'true');
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isSidebarOpen;
        setIsSidebarOpen(newState);
        localStorage.setItem('isSidebarOpen', String(newState));
    };

    const getInitials = (userName?: string) => {
        if (!userName || userName.trim() === '') return 'U';
        const parts = userName.trim().split(/\s+/);
        return parts.slice(0, 2).map((n) => n[0]).join('').toUpperCase();
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call to update profile
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => {
                setSaveSuccess(false);
                setIsProfileModalOpen(false);
            }, 2000);
        }, 1000);
    };

    const initials = getInitials(profileData.name);

    return (
        <div className="flex h-screen w-full bg-slate-950 font-sans text-slate-200 overflow-hidden">
            {/* Sidebar */}
            <aside 
                className={`relative z-20 flex shrink-0 flex-col border-r border-slate-800/60 bg-slate-950 transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'
                }`}
            >
                {/* Logo Header */}
                <div className="mt-2 mb-4 flex h-16 shrink-0 w-full items-center justify-center border-b border-slate-800/60 px-6">
                    <div className="relative h-10 w-40 cursor-pointer transition-opacity hover:opacity-90">
                        <Image
                            src="/logo-elementor1.avif"
                            alt="Elemotor Administrador"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Admin Nav */}
                <AdminSidebarNav />

                {/* Profile Footer */}
                <div className="mt-auto shrink-0 border-t border-slate-800/60 p-4 pb-8">
                    <div 
                        onClick={() => setIsProfileModalOpen(true)}
                        className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-800/40 group relative"
                        title="Gestionar Perfil"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-300 group-hover:border-[#10B981] group-hover:text-[#10B981] transition-colors relative overflow-hidden">
                            <span className="group-hover:opacity-0 transition-opacity">{initials}</span>
                            <User size={16} className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{profileData.name}</div>
                            <div className="mt-0.5 truncate text-xs text-slate-500 group-hover:text-slate-400 transition-colors">{profileData.email}</div>
                        </div>
                    </div>

                    <form action={logoutAction} className="mt-2 w-full text-center">
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800/40 hover:text-red-400"
                        >
                            <LogOut size={16} />
                            Cerrar sesión
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="relative z-10 flex min-w-0 flex-1 flex-col bg-[#0f172a] shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.5)]">
                {/* Header (Toggle) */}
                <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/5 bg-slate-950/40 px-6 backdrop-blur-md">
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                        title={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                    </button>
                </header>

                {/* Page Content */}
                <div className="w-full flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto max-w-[1400px] w-full">
                        {children}
                    </div>
                </div>
            </main>

            {/* Profile Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#15201D] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <User className="text-[#10B981]" size={24} />
                                Perfil del Administrador
                            </h3>
                            <button 
                                onClick={() => setIsProfileModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Nombre Completo</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Correo Electrónico</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                                        <Lock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                        <div className="text-sm text-slate-300">
                                            <p className="font-medium text-amber-500 mb-1">Cambio de Contraseña</p>
                                            <p className="text-xs text-slate-400">Si necesitas actualizar tu contraseña, deberás cerrar sesión y usar la opción "¿Olvidaste tu contraseña?" en la pantalla de ingreso.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-all border border-transparent"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving || saveSuccess}
                                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                                        saveSuccess ? 'bg-emerald-500' : 'bg-[#10B981] hover:bg-[#059669]'
                                    }`}
                                >
                                    {isSaving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : saveSuccess ? (
                                        <>
                                            <CheckCircle2 size={18} />
                                            Guardado
                                        </>
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
