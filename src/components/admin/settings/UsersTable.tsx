'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, User, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { userAdminService, AdminUser } from '@/services/user_admin.service';
import UserSlideOver from './UserSlideOver';
import { useDebounce } from '@/hooks/useDebounce';

export default function UsersTable() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearch = useDebounce(searchTerm, 500);
    
    // SlideOver State
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    const fetchData = useCallback(async (search?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userAdminService.getUsers({ search, limit: 100 });
            setUsers(response.data);
        } catch (err: any) {
            setError(err.message || "Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(debouncedSearch);
    }, [debouncedSearch, fetchData]);

    const getStatusBadge = (user: AdminUser) => {
        // En el backend actual no hay un campo 'status', lo simulamos o usamos info real si existe
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> {user.role}</span>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };



    const handleEditUser = (user: AdminUser) => {
        setSelectedUser(user);
        setIsSlideOverOpen(true);
    };

    return (
        <>
            <div className="bg-[#15201D] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[700px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white/[0.02]">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar cliente por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 transition-all font-light"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="sticky top-0 bg-[#15201D] z-10 border-b border-white/5 shadow-sm">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Teléfono</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ciudad</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Registro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                                            <p className="text-sm text-slate-500">Cargando usuarios...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} onClick={() => handleEditUser(user)} className="hover:bg-white/[0.02] cursor-pointer transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.avatarUrl ? (
                                                    <img 
                                                        src={user.avatarUrl} 
                                                        alt={user.name} 
                                                        className="h-10 w-10 rounded-full object-cover border border-white/10"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                                                        {user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{user.name}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-300">{user.phone || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-300">{user.city || 'No especificada'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(user)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-400">{formatDate(user.createdAt)}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <Search className="w-8 h-8 mb-3 opacity-50" />
                                            <p className="text-sm">{error || "No se encontraron clientes"}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SlideOver */}
            <UserSlideOver 
                isOpen={isSlideOverOpen} 
                onClose={() => setIsSlideOverOpen(false)} 
                user={selectedUser} 
                onUserUpdated={() => fetchData(debouncedSearch)}
            />
        </>
    );
}

