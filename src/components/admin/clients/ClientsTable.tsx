'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Users } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface ClientRow {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    city?: string | null;
    createdAt: string;
}

export default function ClientsTable() {
    const [clients, setClients] = useState<ClientRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchApi<{ data: ClientRow[] }>('/api/users?role=client&limit=50')
            .then((res) => setClients(res?.data ?? []))
            .catch((e) => setError(e?.message ?? 'Error cargando clientes'))
            .finally(() => setIsLoading(false));
    }, []);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                Cargando clientes...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/80">
                            <th className="p-4 pl-6">Nombre</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Teléfono</th>
                            <th className="p-4">Ciudad</th>
                            <th className="p-4">Miembro desde</th>
                            <th className="p-4 pr-6" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-sm">
                        {clients.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-slate-500">
                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                    No hay clientes registrados.
                                </td>
                            </tr>
                        ) : clients.map((client) => (
                            <tr
                                key={client.id}
                                className="hover:bg-slate-800/40 transition-colors group"
                            >
                                <td className="p-4 pl-6">
                                    <p className="font-semibold text-slate-100">{client.name}</p>
                                    <p className="text-slate-500 text-xs mt-0.5">#{client.id}</p>
                                </td>
                                <td className="p-4 text-slate-300 text-xs">{client.email}</td>
                                <td className="p-4 text-slate-400 text-xs">{client.phone ?? <span className="text-slate-600 italic">—</span>}</td>
                                <td className="p-4 text-slate-400 text-xs">{client.city ?? <span className="text-slate-600 italic">—</span>}</td>
                                <td className="p-4 text-slate-400 text-xs whitespace-nowrap">{formatDate(client.createdAt)}</td>
                                <td className="p-4 pr-6 text-right">
                                    <Link
                                        href={`/admin/clientes/${client.id}`}
                                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-400 transition-colors group-hover:text-slate-300"
                                    >
                                        Ver perfil <ChevronRight size={14} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
