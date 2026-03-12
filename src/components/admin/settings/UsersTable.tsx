'use client';

import React, { useState, useMemo } from 'react';
import { Search, User, CheckCircle2, XCircle } from 'lucide-react';
import { clientsData, ClientUser } from '@/mocks/clientsData';
import UserSlideOver from './UserSlideOver';

export default function UsersTable() {
    const [users, setUsers] = useState<ClientUser[]>(clientsData);
    const [searchTerm, setSearchTerm] = useState('');
    
    // SlideOver State
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<ClientUser | null>(null);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  user.email.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [users, searchTerm]);

    const getStatusBadge = (status: string) => {
        return status === 'active' 
            ? <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Activo</span>
            : <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400"><XCircle className="w-3.5 h-3.5" /> Inactivo</span>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };



    const handleEditUser = (user: ClientUser) => {
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
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} onClick={() => handleEditUser(user)} className="hover:bg-white/[0.02] cursor-pointer transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.avatar ? (
                                                    <img 
                                                        src={user.avatar} 
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
                                            <span className="text-sm text-slate-300">{user.phone}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-300">{user.city || 'No especificada'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(user.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-400">{formatDate(user.registrationDate)}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <Search className="w-8 h-8 mb-3 opacity-50" />
                                            <p className="text-sm">No se encontraron clientes</p>
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
            />
        </>
    );
}

