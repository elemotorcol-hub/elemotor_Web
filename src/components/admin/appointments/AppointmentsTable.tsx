'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, X, AlertTriangle, ChevronDown } from 'lucide-react';
import { appointmentsAdminService, type AppointmentStatus } from '@/services/appointments.service';

// ─── Config ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; className: string }> = {
    pending:     { label: 'Pendiente',   className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    confirmed:   { label: 'Confirmada',  className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    in_progress: { label: 'En proceso',  className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    completed:   { label: 'Completada',  className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    cancelled:   { label: 'Cancelada',   className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

const ALL_STATUSES = Object.entries(STATUS_CONFIG) as [AppointmentStatus, { label: string; className: string }][];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Appointment {
    id: number;
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    preferredDate: string;
    preferredTime: string | null;
    status: AppointmentStatus;
    notes: string | null;
    createdAt: string;
    workshop: { id: number; name: string } | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppointmentsTable() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('pending');
    const [filterDate, setFilterDate] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Delete modal
    const [toDelete, setToDelete] = useState<Appointment | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Status change loading per row
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await appointmentsAdminService.getAll({
                status: filterStatus || undefined,
                dateFrom: filterDate || undefined,
            });
            setAppointments(result?.data ?? []);
        } catch (e: any) {
            setError(e?.message ?? 'Error cargando citas');
        } finally {
            setIsLoading(false);
        }
    }, [filterStatus, filterDate]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleStatusChange = async (id: number, status: AppointmentStatus) => {
        setUpdatingId(id);
        try {
            await appointmentsAdminService.updateStatus(id, status);
            setAppointments((prev) =>
                prev.map((a) => (a.id === id ? { ...a, status } : a)),
            );
        } catch (e: any) {
            setError(e?.message ?? 'Error actualizando estado');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async () => {
        if (!toDelete) return;
        setIsDeleting(true);
        try {
            await appointmentsAdminService.remove(toDelete.id);
            setAppointments((prev) => prev.filter((a) => a.id !== toDelete.id));
        } catch (e: any) {
            setError(e?.message ?? 'Error eliminando cita');
        } finally {
            setIsDeleting(false);
            setToDelete(null);
        }
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className="flex flex-col gap-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                >
                    <option value="">Todos los estados</option>
                    {ALL_STATUSES.map(([value, { label }]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 [color-scheme:dark]"
                />
                {filterDate && (
                    <button
                        onClick={() => setFilterDate('')}
                        className="text-slate-500 hover:text-slate-300 text-xs underline"
                    >
                        Limpiar fecha
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg flex items-start justify-between gap-4">
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 p-1 shrink-0">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/80">
                                <th className="p-4 pl-6">Nombre</th>
                                <th className="p-4">Contacto</th>
                                <th className="p-4">Taller</th>
                                <th className="p-4">Fecha preferida</th>
                                <th className="p-4">Tipo de servicio</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4 text-right pr-6">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                                            <p>Cargando citas...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : appointments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-slate-500">
                                        No hay citas con los filtros seleccionados.
                                    </td>
                                </tr>
                            ) : appointments.map((appt) => {
                                const statusCfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.pending;
                                return (
                                    <tr key={appt.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="p-4 pl-6">
                                            <p className="font-semibold text-slate-100">{appt.name}</p>
                                            <p className="text-slate-500 text-xs mt-0.5">#{appt.id}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-slate-300 text-xs">{appt.email}</p>
                                            <p className="text-slate-500 text-xs mt-0.5">{appt.phone}</p>
                                        </td>
                                        <td className="p-4 text-slate-400 text-xs">
                                            {appt.workshop?.name ?? <span className="text-slate-600 italic">Sin taller</span>}
                                        </td>
                                        <td className="p-4 text-slate-300 text-xs whitespace-nowrap">
                                            {formatDate(appt.preferredDate)}
                                            {appt.preferredTime && (
                                                <span className="text-slate-500 ml-1">{appt.preferredTime}</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-400 text-xs max-w-[180px]">
                                            <span className="line-clamp-2">{appt.serviceType}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.className}`}>
                                                {statusCfg.label}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Status dropdown */}
                                                <div className="relative">
                                                    <select
                                                        value={appt.status}
                                                        disabled={updatingId === appt.id}
                                                        onChange={(e) => handleStatusChange(appt.id, e.target.value as AppointmentStatus)}
                                                        className="bg-slate-800 border border-slate-700 rounded-md pl-3 pr-7 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer disabled:opacity-50"
                                                    >
                                                        {ALL_STATUSES.map(([value, { label }]) => (
                                                            <option key={value} value={value}>{label}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                                                </div>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => setToDelete(appt)}
                                                    className="p-1.5 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all text-slate-500"
                                                    title="Eliminar cita"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete modal */}
            {toDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-100 flex items-center justify-between">
                                        Eliminar cita
                                        <button
                                            onClick={() => !isDeleting && setToDelete(null)}
                                            disabled={isDeleting}
                                            className="text-slate-500 hover:text-slate-300 transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </h3>
                                    <div className="mt-3 text-sm text-slate-300 space-y-2">
                                        <p>Estás a punto de eliminar la cita de <strong>{toDelete.name}</strong>.</p>
                                        <p className="text-slate-500">Esta acción es permanente e irreversible.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700/50 flex justify-end gap-3">
                            <button
                                onClick={() => setToDelete(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Eliminando...</>
                                ) : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
