'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Save, Clock, Phone, Shield, Loader2 } from 'lucide-react';
import { AdminUser, userAdminService } from '@/services/user_admin.service';

interface UserSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated: () => void;
    user?: AdminUser | null;
}

export default function UserSlideOver({ isOpen, onClose, onUserUpdated, user }: UserSlideOverProps) {
    const [role, setRole] = useState(user?.role || 'client');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setRole(user.role);
        }
    }, [user]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await userAdminService.updateRole(user.id, role);
            onUserUpdated();
            onClose();
        } catch (error) {
            alert("Error al actualizar el rol del usuario");
        } finally {
            setLoading(false);
        }
    };

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
                                    {user.avatarUrl ? (
                                        <img 
                                            src={user.avatarUrl} 
                                            alt={user.name} 
                                            className="w-24 h-24 rounded-full object-cover border-2 border-[#10B981]/50 shadow-lg shadow-[#10B981]/20 mb-4"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl font-bold text-slate-300 mb-4 shadow-lg shadow-black/50">
                                            {user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                                        </div>
                                    )}
                                    <h3 className="text-lg font-bold text-white text-center">{user.name}</h3>
                                    <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                                        <Shield className="w-3.5 h-3.5" />
                                        Rol: {user.role}
                                    </div>
                                </div>
                            )}

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Información Básica</label>
                                        <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Mail size={16} className="text-slate-500" />
                                                <span className="text-sm text-slate-200">{user?.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone size={16} className="text-slate-500" />
                                                <span className="text-sm text-slate-200">{user?.phone || 'Sin teléfono'}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <User size={16} className="text-slate-500" />
                                                <span className="text-sm text-slate-200">{user?.city || 'Ciudad no especificada'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cambiar Rol</label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <select 
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 transition-all appearance-none"
                                            >
                                                <option value="client">Cliente (Client)</option>
                                                <option value="admin">Administrador (Admin)</option>
                                                <option value="super_admin">Super Administrador</option>
                                            </select>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-2 px-1">
                                            * Los cambios de rol afectan los permisos de acceso de forma inmediata.
                                        </p>
                                    </div>

                                    {user && (
                                        <div className="pt-4 border-t border-white/5">
                                            <div className="flex flex-col gap-2 text-sm text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-slate-500" />
                                                    <span>Registrado el: {formatDate(user.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">User ID: {user.id}</span>
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
                                onClick={handleSave}
                                disabled={loading}
                                className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 bg-[#10B981] disabled:opacity-50 hover:bg-[#059669] text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-[#10B981]/20"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
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

