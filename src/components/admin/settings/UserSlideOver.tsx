'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Save, Clock, Phone } from 'lucide-react';
import { ClientUser } from '@/mocks/clientsData';

interface UserSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    user?: ClientUser | null;
}

export default function UserSlideOver({ isOpen, onClose, user }: UserSlideOverProps) {
    const isEditing = !!user;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        status: 'active'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || '',
                status: user.status || 'active'
            });
        }
    }, [user]);

    if (!isOpen) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
                onClick={onClose}
            />

            <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
                <div className="w-screen max-w-md transform transition-all animate-in slide-in-from-right duration-500 ease-out border-l border-white/5 bg-slate-950 p-0">
                    <div className="flex flex-col h-full shadow-2xl">
                        
                        {/* Header */}
                        <div className="px-6 py-6 border-b border-white/5 bg-[#15201D]/40 backdrop-blur-md">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <User className="w-5 h-5 text-[#10B981]" />
                                    Detalle del Cliente
                                </h2>
                                <button 
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                Información de registro del cliente en la plataforma.
                            </p>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            
                            {/* Avatar Section */}
                            {user && (
                                <div className="p-6 pb-2 flex flex-col items-center justify-center border-b border-white/5">
                                    {user.avatar ? (
                                        <img 
                                            src={user.avatar} 
                                            alt={user.name} 
                                            className="w-24 h-24 rounded-full object-cover border-2 border-[#10B981]/50 shadow-lg shadow-[#10B981]/20 mb-4"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl font-bold text-slate-300 mb-4 shadow-lg shadow-black/50">
                                            {user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                                        </div>
                                    )}
                                    <h3 className="text-lg font-bold text-white">{user.name}</h3>
                                    <div className={`mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                                        <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                                        {user.status === 'active' ? 'Usuario Activo' : 'Usuario Inactivo'}
                                    </div>
                                </div>
                            )}

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nombre Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Correo Electrónico</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Teléfono de Contacto</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input 
                                            type="tel" 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ciudad Residencia</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input 
                                            type="text" 
                                            value={formData.city}
                                            placeholder="Ciudad"
                                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {user && (
                                    <div className="pt-4 border-t border-white/5">
                                        <div className="flex flex-col gap-2 text-sm text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-slate-500" />
                                                <span>Registrado el: {formatDate(user.registrationDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">ID: {user.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-slate-950 flex gap-3">
                            <button 
                                onClick={onClose}
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all"
                            >
                                Cancelar
                             </button>
                            <button 
                                className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-[#10B981]/20"
                            >
                                <Save size={18} />
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components icons (internal)
function Edit2(props: any) { return <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>; }

