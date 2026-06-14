'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Trash2, X, AlertTriangle, ChevronDown, Calendar, Clock,
    Phone, Mail, MapPin, Wrench, User, RefreshCw, ClipboardList,
    CheckCircle2, CircleDashed, Loader2, XCircle, CheckCheck,
    Download, Plus, Search, DollarSign, Gauge, MessageSquare,
    Car, Edit3, Save, ChevronRight, UserCog,
} from 'lucide-react';
import { appointmentsAdminService, type AppointmentStatus } from '@/services/appointments.service';
import { userAdminService, type AdminUser } from '@/services/user_admin.service';
import { maintenanceService } from '@/services/maintenance.service';
import { orderService } from '@/services/order.service';
import { workshopService, type WorkshopResponse } from '@/services/workshop.service';
import { cn } from '@/lib/utils';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; badge: string; icon: React.ReactNode; dot: string; step: number }> = {
    pending:     { label: 'Pendiente',   badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   icon: <CircleDashed size={12} />,                    dot: 'bg-amber-400',   step: 0 },
    confirmed:   { label: 'Confirmada',  badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',      icon: <CheckCircle2 size={12} />,                    dot: 'bg-blue-400',    step: 1 },
    in_progress: { label: 'En proceso',  badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',icon: <Loader2 size={12} className="animate-spin" />,dot: 'bg-purple-400',  step: 2 },
    completed:   { label: 'Completada',  badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',icon: <CheckCheck size={12} />,                  dot: 'bg-emerald-400', step: 3 },
    cancelled:   { label: 'Cancelada',   badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',      icon: <XCircle size={12} />,                         dot: 'bg-rose-400',    step: -1 },
};

const STATUS_STEPS: AppointmentStatus[] = ['pending', 'confirmed', 'in_progress', 'completed'];

const ALL_STATUSES = Object.entries(STATUS_CONFIG) as [AppointmentStatus, (typeof STATUS_CONFIG)[AppointmentStatus]][];

const SERVICE_TYPES = [
    'Preventivo', 'Revisión General', 'Frenos y Suspensión',
    'Batería', 'Actualización de Software', 'Diagnóstico Eléctrico', 'Otro',
];

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
    updatedAt?: string;
    workshop: { id: number; name: string } | null;
}

interface VehicleInfo {
    model: string;
    trim: string;
    color: string;
    vin?: string;
    orderId: number;
    deliveredAt?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

const fmtDateTime = (iso: string) =>
    new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/** Parse advisor from notes: "[Asesor: Nombre] resto de notas" */
function parseNotes(raw: string | null): { advisor: string; notes: string } {
    if (!raw) return { advisor: '', notes: '' };
    const match = raw.match(/^\[Asesor:\s*(.+?)\]\s*/);
    if (match) return { advisor: match[1].trim(), notes: raw.slice(match[0].length).trim() };
    return { advisor: '', notes: raw };
}

function buildNotes(advisor: string, notes: string): string | undefined {
    const a = advisor.trim();
    const n = notes.trim();
    if (!a && !n) return undefined;
    if (a && n) return `[Asesor: ${a}] ${n}`;
    if (a) return `[Asesor: ${a}]`;
    return n;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AppointmentStatus }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', cfg.badge)}>
            {cfg.icon}{cfg.label}
        </span>
    );
}

function StatusTimeline({ status }: { status: AppointmentStatus }) {
    if (status === 'cancelled') {
        return (
            <div className="flex items-center gap-2 bg-rose-500/5 border border-rose-500/20 rounded-xl px-4 py-3">
                <XCircle size={16} className="text-rose-400 shrink-0" />
                <span className="text-rose-400 text-sm font-medium">Cita cancelada</span>
            </div>
        );
    }
    const currentStep = STATUS_CONFIG[status]?.step ?? 0;
    return (
        <div className="flex items-center gap-0">
            {STATUS_STEPS.map((s, i) => {
                const cfg = STATUS_CONFIG[s];
                const done = cfg.step < currentStep;
                const active = cfg.step === currentStep;
                return (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center gap-1.5 min-w-0">
                            <div className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all text-[11px]',
                                done    ? 'bg-emerald-500 border-emerald-500 text-white' :
                                active  ? 'bg-slate-800 border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]' :
                                          'bg-slate-800/50 border-white/10 text-slate-600'
                            )}>
                                {done ? <CheckCheck size={14} /> : cfg.icon}
                            </div>
                            <span className={cn(
                                'text-[10px] font-semibold whitespace-nowrap',
                                done ? 'text-emerald-400' : active ? 'text-cyan-400' : 'text-slate-600'
                            )}>
                                {cfg.label}
                            </span>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                            <div className={cn('flex-1 h-0.5 mb-5 mx-1', cfg.step < currentStep ? 'bg-emerald-500' : 'bg-white/5')} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

function KpiCard({ label, count, color, icon }: { label: string; count: number; color: string; icon: React.ReactNode }) {
    return (
        <div className="bg-[#161b22] border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', color)}>{icon}</div>
            <div>
                <p className="text-2xl font-bold text-slate-100 leading-none">{count}</p>
                <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
        </div>
    );
}

// ─── Detail Side Panel ────────────────────────────────────────────────────────

interface DetailPanelProps {
    appt: Appointment | null;
    workshops: WorkshopResponse[];
    onClose: () => void;
    onSave: (id: number, updates: Partial<Appointment> & { notesRaw?: string }) => Promise<void>;
    onDelete: (appt: Appointment) => void;
}

function DetailPanel({ appt, workshops, onClose, onSave, onDelete }: DetailPanelProps) {
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [vehicle, setVehicle] = useState<VehicleInfo | null>(null);
    const [loadingVehicle, setLoadingVehicle] = useState(false);

    // Edit fields
    const [editStatus, setEditStatus] = useState<AppointmentStatus>('pending');
    const [editServiceType, setEditServiceType] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editTime, setEditTime] = useState('');
    const [editWorkshopId, setEditWorkshopId] = useState('');
    const [editAdvisor, setEditAdvisor] = useState('');
    const [editNotes, setEditNotes] = useState('');

    // Load vehicle when appointment changes
    useEffect(() => {
        if (!appt) { setVehicle(null); return; }
        setEditMode(false);
        setEditStatus(appt.status);
        setEditServiceType(appt.serviceType);
        setEditDate(appt.preferredDate?.split('T')[0] ?? '');
        setEditTime(appt.preferredTime ?? '');
        setEditWorkshopId(appt.workshop?.id?.toString() ?? '');
        const parsed = parseNotes(appt.notes);
        setEditAdvisor(parsed.advisor);
        setEditNotes(parsed.notes);

        // Fetch vehicle
        setLoadingVehicle(true);
        setVehicle(null);
        userAdminService.getUsers({ search: appt.email, limit: 5 })
            .then(async (res) => {
                const users: AdminUser[] = Array.isArray(res) ? res : res?.data ?? [];
                const user = users.find(u => u.email.toLowerCase() === appt.email.toLowerCase());
                if (!user) return;
                const ordersRes = await orderService.fetchAllOrders({ userId: String(user.id), status: 'delivered', limit: '1' });
                const orders = Array.isArray(ordersRes) ? ordersRes : ordersRes?.data ?? [];
                if (orders.length > 0) {
                    const o = orders[0];
                    setVehicle({
                        orderId:     o.id,
                        model:       o.trim?.model?.name ?? o.model?.name ?? 'Vehículo',
                        trim:        o.trim?.name ?? '',
                        color:       o.color?.name ?? '',
                        vin:         o.vin ?? undefined,
                        deliveredAt: o.updatedAt ?? o.createdAt,
                    });
                }
            })
            .catch(() => {})
            .finally(() => setLoadingVehicle(false));
    }, [appt?.id]);

    if (!appt) return null;

    const { advisor: parsedAdvisor, notes: parsedNotes } = parseNotes(appt.notes);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(appt.id, {
                status:          editStatus,
                serviceType:     editServiceType,
                preferredDate:   editDate,
                preferredTime:   editTime || null,
                workshop:        editWorkshopId
                    ? { id: Number(editWorkshopId), name: workshops.find(w => w.id === Number(editWorkshopId))?.name ?? '' }
                    : null,
                notesRaw:        buildNotes(editAdvisor, editNotes),
            });
            setEditMode(false);
        } finally {
            setSaving(false);
        }
    };

    const fieldCls = 'w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-slate-600';

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

            {/* Panel */}
            <div className="fixed right-0 top-0 h-full w-full max-w-[520px] z-40 bg-[#0d1117] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#161b22] shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', STATUS_CONFIG[appt.status]?.dot ?? 'bg-slate-500')} />
                        <div>
                            <h2 className="text-base font-bold text-white">{appt.name}</h2>
                            <p className="text-xs text-slate-500">Cita #{appt.id} · {fmtDate(appt.createdAt)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!editMode ? (
                            <button
                                onClick={() => setEditMode(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all"
                            >
                                <Edit3 size={13} /> Editar
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                                Guardar
                            </button>
                        )}
                        <button
                            onClick={onDelete.bind(null, appt)}
                            className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Eliminar cita"
                        >
                            <Trash2 size={15} />
                        </button>
                        <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Status timeline */}
                    <section>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3">Trazabilidad del servicio</p>
                        {editMode ? (
                            <div className="relative">
                                <select
                                    value={editStatus}
                                    onChange={e => setEditStatus(e.target.value as AppointmentStatus)}
                                    className={cn(fieldCls, 'appearance-none pr-8')}
                                >
                                    {ALL_STATUSES.map(([v, { label }]) => (
                                        <option key={v} value={v}>{label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                        ) : (
                            <StatusTimeline status={appt.status} />
                        )}
                    </section>

                    {/* Client info */}
                    <section className="bg-[#161b22] border border-white/5 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <User size={14} className="text-cyan-400" />
                            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Datos del cliente</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
                                {appt.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">{appt.name}</p>
                                <p className="text-slate-500 text-xs">Cliente registrado</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 pt-1">
                            <a href={`mailto:${appt.email}`} className="flex items-center gap-2.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                <Mail size={13} className="text-slate-500 shrink-0" />
                                {appt.email}
                            </a>
                            <a href={`tel:${appt.phone}`} className="flex items-center gap-2.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                <Phone size={13} className="text-slate-500 shrink-0" />
                                {appt.phone}
                            </a>
                        </div>
                    </section>

                    {/* Vehicle info */}
                    <section className="bg-[#161b22] border border-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Car size={14} className="text-cyan-400" />
                            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Vehículo del cliente</p>
                        </div>
                        {loadingVehicle ? (
                            <div className="flex items-center gap-2 py-2">
                                <Loader2 size={14} className="animate-spin text-slate-500" />
                                <span className="text-slate-500 text-xs">Buscando vehículo...</span>
                            </div>
                        ) : vehicle ? (
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-white font-bold text-sm">{vehicle.model}</span>
                                    {vehicle.trim && <span className="text-slate-400 text-xs">{vehicle.trim}</span>}
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                    {vehicle.color && (
                                        <span className="text-slate-400 text-xs flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                                            {vehicle.color}
                                        </span>
                                    )}
                                    {vehicle.vin && (
                                        <span className="text-slate-500 text-xs font-mono">VIN: {vehicle.vin}</span>
                                    )}
                                    {vehicle.deliveredAt && (
                                        <span className="text-slate-500 text-xs">Entregado: {fmtDate(vehicle.deliveredAt)}</span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-600 text-sm italic">Sin vehículo entregado registrado</p>
                        )}
                    </section>

                    {/* Service details */}
                    <section className="space-y-4">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Detalles del servicio</p>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Service type */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                    <Wrench size={10} /> Tipo de servicio
                                </label>
                                {editMode ? (
                                    <div className="relative">
                                        <select value={editServiceType} onChange={e => setEditServiceType(e.target.value)} className={cn(fieldCls, 'appearance-none pr-8')}>
                                            {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-200">{appt.serviceType}</p>
                                )}
                            </div>

                            {/* Status badge (view mode) */}
                            {!editMode && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                        <Clock size={10} /> Estado
                                    </label>
                                    <StatusBadge status={appt.status} />
                                </div>
                            )}

                            {/* Date */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                    <Calendar size={10} /> Fecha preferida
                                </label>
                                {editMode ? (
                                    <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className={cn(fieldCls, '[color-scheme:dark]')} />
                                ) : (
                                    <p className="text-sm text-slate-200">
                                        {fmtDate(appt.preferredDate)}
                                        {appt.preferredTime && <span className="text-slate-500 ml-1">· {appt.preferredTime}</span>}
                                    </p>
                                )}
                            </div>

                            {/* Time (edit only) */}
                            {editMode && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                        <Clock size={10} /> Hora preferida
                                    </label>
                                    <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} className={cn(fieldCls, '[color-scheme:dark]')} />
                                </div>
                            )}

                            {/* Workshop */}
                            <div className="space-y-1.5 col-span-2">
                                <label className="text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                    <MapPin size={10} /> Taller asignado
                                </label>
                                {editMode ? (
                                    <div className="relative">
                                        <select value={editWorkshopId} onChange={e => setEditWorkshopId(e.target.value)} className={cn(fieldCls, 'appearance-none pr-8')}>
                                            <option value="">Sin especificar</option>
                                            {workshops.map(w => (
                                                <option key={w.id} value={w.id}>{w.name}{w.city ? ` — ${w.city}` : ''}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                                    </div>
                                ) : (
                                    <p className={cn('text-sm', appt.workshop ? 'text-slate-200' : 'text-slate-600 italic')}>
                                        {appt.workshop?.name ?? 'Sin taller asignado'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Advisor */}
                    <section className="bg-[#161b22] border border-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <UserCog size={14} className="text-cyan-400" />
                            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Asesor encargado</p>
                        </div>
                        {editMode ? (
                            <input
                                type="text"
                                value={editAdvisor}
                                onChange={e => setEditAdvisor(e.target.value)}
                                placeholder="Nombre del asesor responsable..."
                                className={fieldCls}
                            />
                        ) : parsedAdvisor ? (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
                                    {parsedAdvisor.charAt(0).toUpperCase()}
                                </div>
                                <p className="text-sm text-white font-medium">{parsedAdvisor}</p>
                            </div>
                        ) : (
                            <p className="text-slate-600 text-sm italic">Sin asesor asignado</p>
                        )}
                    </section>

                    {/* Notes */}
                    <section className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-1.5">
                            <MessageSquare size={10} /> Notas del cliente
                        </label>
                        {editMode ? (
                            <textarea
                                value={editNotes}
                                onChange={e => setEditNotes(e.target.value)}
                                rows={3}
                                placeholder="Observaciones adicionales..."
                                className={cn(fieldCls, 'resize-none')}
                            />
                        ) : parsedNotes ? (
                            <p className="text-sm text-slate-300 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5 italic leading-relaxed">
                                "{parsedNotes}"
                            </p>
                        ) : (
                            <p className="text-slate-600 text-sm italic">Sin notas</p>
                        )}
                    </section>

                    {/* Meta */}
                    <section className="border-t border-white/5 pt-4 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-600">
                            <span className="flex items-center gap-1.5"><ClipboardList size={11} /> Solicitud creada</span>
                            <span>{fmtDateTime(appt.createdAt)}</span>
                        </div>
                        {appt.updatedAt && (
                            <div className="flex items-center justify-between text-xs text-slate-600">
                                <span className="flex items-center gap-1.5"><RefreshCw size={11} /> Última actualización</span>
                                <span>{fmtDateTime(appt.updatedAt)}</span>
                            </div>
                        )}
                    </section>

                    {editMode && (
                        <div className="flex gap-3 pb-2">
                            <button
                                type="button"
                                onClick={() => setEditMode(false)}
                                disabled={saving}
                                className="flex-1 py-2.5 text-sm font-medium text-slate-400 hover:text-white bg-white/5 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                Guardar cambios
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// ─── Admin Register Maintenance Modal ─────────────────────────────────────────

function AdminMaintenanceModal({
    isOpen, onClose, onSuccess, workshops,
}: {
    isOpen: boolean; onClose: () => void; onSuccess: () => void; workshops: WorkshopResponse[];
}) {
    const [userSearch, setUserSearch] = useState('');
    const [userResults, setUserResults] = useState<AdminUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [serviceType, setServiceType] = useState('Preventivo');
    const [workshopId, setWorkshopId] = useState('');
    const [cost, setCost] = useState('');
    const [km, setKm] = useState('');
    const [comment, setComment] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userSearch.trim().length < 2) { setUserResults([]); return; }
        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await userAdminService.getUsers({ search: userSearch, role: 'client', limit: 10 });
                setUserResults(res.data ?? []);
            } catch { setUserResults([]); } finally { setIsSearching(false); }
        }, 350);
        return () => clearTimeout(timer);
    }, [userSearch]);

    if (!isOpen) return null;

    const handleClose = () => {
        setUserSearch(''); setUserResults([]); setSelectedUser(null);
        setDate(new Date().toISOString().split('T')[0]); setServiceType('Preventivo');
        setWorkshopId(''); setCost(''); setKm(''); setComment('');
        setError(null); setSuccess(false); onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) { setError('Debes seleccionar un cliente.'); return; }
        setError(null); setIsSaving(true);
        try {
            const ordersRes = await orderService.fetchAllOrders({ userId: String(selectedUser.id), status: 'delivered', limit: '1' });
            const deliveredOrder = (Array.isArray(ordersRes) ? ordersRes : ordersRes?.data ?? [])[0];
            if (!deliveredOrder) { setError('Este cliente no tiene un pedido entregado.'); setIsSaving(false); return; }
            let finalComment = comment.trim() || undefined;
            if (km.trim()) finalComment = `km: ${km.trim()}${finalComment ? ` | ${finalComment}` : ''}`;
            await maintenanceService.createRecord({
                orderId:    Number(deliveredOrder.id),
                date,
                type:       serviceType,
                workshopId: workshopId ? Number(workshopId) : undefined,
                cost:       cost ? Number(cost) : undefined,
                comment:    finalComment,
            });
            setSuccess(true); onSuccess();
        } catch (err: any) {
            setError(err?.message ?? 'Error al registrar.');
        } finally { setIsSaving(false); }
    };

    const fieldCls = 'w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400"><Wrench size={18} /></div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-100">Registrar Mantenimiento</h3>
                            <p className="text-xs text-slate-500">Registra un servicio para cualquier cliente</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1"><X size={18} /></button>
                </div>

                {success ? (
                    <div className="p-10 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 mb-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-100 mb-1">Mantenimiento registrado</h4>
                        <p className="text-slate-400 text-sm mb-6">El registro ha sido guardado exitosamente.</p>
                        <button onClick={handleClose} className="px-6 py-2 text-sm font-medium bg-[#0d1117] border border-white/10 rounded-lg text-slate-300 hover:text-white transition-colors">Cerrar</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                                <AlertTriangle size={14} className="shrink-0 mt-0.5" />{error}
                            </div>
                        )}

                        {/* Client search */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <User size={12} className="text-cyan-400" /> Cliente <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                <input
                                    type="text" value={userSearch}
                                    onChange={e => { setUserSearch(e.target.value); if (selectedUser && e.target.value !== selectedUser.name) setSelectedUser(null); }}
                                    placeholder="Buscar por nombre o email..."
                                    className={cn(fieldCls, 'pl-9')}
                                />
                                {isSearching && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 animate-spin" />}
                                {userResults.length > 0 && (
                                    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-[#0d1117] border border-white/10 rounded-lg overflow-hidden shadow-xl">
                                        {userResults.map(user => (
                                            <button key={user.id} type="button"
                                                onClick={() => { setSelectedUser(user); setUserSearch(user.name); setUserResults([]); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-left transition-colors"
                                            >
                                                <div className="w-7 h-7 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-slate-200 font-medium truncate">{user.name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {selectedUser && (
                                <p className="text-xs text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Cliente: <strong>{selectedUser.name}</strong>
                                </p>
                            )}
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Calendar size={12} className="text-cyan-400" /> Fecha <span className="text-red-500">*</span></label>
                            <input type="date" value={date} max={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} required className={cn(fieldCls, '[color-scheme:dark]')} />
                        </div>

                        {/* Service type */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Wrench size={12} className="text-cyan-400" /> Tipo de servicio <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {SERVICE_TYPES.map(type => (
                                    <button key={type} type="button" onClick={() => setServiceType(type)}
                                        className={cn('px-3 py-2 rounded-lg text-[11px] font-bold border transition-all',
                                            serviceType === type ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                        )}
                                    >{type}</button>
                                ))}
                            </div>
                        </div>

                        {/* Workshop */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2"><MapPin size={12} className="text-cyan-400" /> Taller (opcional)</label>
                            <div className="relative">
                                <select value={workshopId} onChange={e => setWorkshopId(e.target.value)} className={cn(fieldCls, 'appearance-none pr-8')}>
                                    <option value="">Sin especificar</option>
                                    {workshops.map(w => <option key={w.id} value={w.id}>{w.name}{w.city ? ` — ${w.city}` : ''}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Cost & Km */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2"><DollarSign size={12} className="text-cyan-400" /> Costo COP</label>
                                <input type="number" min={0} step={1000} value={cost} onChange={e => setCost(e.target.value)} placeholder="250000" className={fieldCls} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Gauge size={12} className="text-cyan-400" /> Kilometraje</label>
                                <input type="number" min={0} value={km} onChange={e => setKm(e.target.value)} placeholder="12500" className={fieldCls} />
                            </div>
                        </div>

                        {/* Comment */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2"><MessageSquare size={12} className="text-cyan-400" /> Comentario</label>
                            <textarea value={comment} onChange={e => setComment(e.target.value)} maxLength={480} rows={3} placeholder="Detalles del servicio realizado..."
                                className={cn(fieldCls, 'resize-none')} />
                        </div>

                        <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                            <button type="button" onClick={handleClose} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 disabled:opacity-50 transition-colors">Cancelar</button>
                            <button type="submit" disabled={isSaving || !selectedUser}
                                className="px-5 py-2 text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : <><CheckCircle2 size={14} /> Guardar</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV(appointments: Appointment[]) {
    const STATUS_LABELS: Record<AppointmentStatus, string> = { pending: 'Pendiente', confirmed: 'Confirmada', in_progress: 'En proceso', completed: 'Completada', cancelled: 'Cancelada' };
    const escape = (val: string) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const headers = ['Nombre', 'Email', 'Teléfono', 'Servicio', 'Taller', 'Fecha preferida', 'Estado', 'Creada'];
    const rows = appointments.map(a => [
        escape(a.name), escape(a.email), escape(a.phone), escape(a.serviceType),
        escape(a.workshop?.name ?? ''), escape(fmtDate(a.preferredDate)),
        escape(STATUS_LABELS[a.status] ?? a.status), escape(fmtDateTime(a.createdAt)),
    ]);
    const csv = '\uFEFF' + [headers.map(escape).join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `citas_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AppointmentsTable() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('pending');
    const [filterDate, setFilterDate] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
    const [toDelete, setToDelete] = useState<Appointment | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [isAdminMaintenanceOpen, setIsAdminMaintenanceOpen] = useState(false);
    const [workshops, setWorkshops] = useState<WorkshopResponse[]>([]);

    // Load workshops once
    useEffect(() => {
        workshopService.fetchWorkshops('?limit=100')
            .then(res => setWorkshops(res.data))
            .catch(() => setWorkshops([]));
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const result = await appointmentsAdminService.getAll({ status: filterStatus || undefined, dateFrom: filterDate || undefined });
            setAppointments(result?.data ?? []);
        } catch (e: any) {
            setError(e?.message ?? 'Error cargando citas');
        } finally { setIsLoading(false); }
    }, [filterStatus, filterDate]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSave = async (id: number, updates: Partial<Appointment> & { notesRaw?: string }) => {
        setUpdatingId(id);
        try {
            const prevAppt = appointments.find(a => a.id === id);
            const newStatus = updates.status ?? prevAppt?.status ?? 'pending';

            // Update status if changed
            if (updates.status && updates.status !== prevAppt?.status) {
                await appointmentsAdminService.updateStatus(id, updates.status);

                // Auto-create maintenance record when completed
                if (updates.status === 'completed' && prevAppt) {
                    try {
                        const usersRes = await userAdminService.getUsers({ search: prevAppt.email, limit: 5 });
                        const users: AdminUser[] = Array.isArray(usersRes) ? usersRes : usersRes?.data ?? [];
                        const user = users.find(u => u.email.toLowerCase() === prevAppt.email.toLowerCase());
                        if (user) {
                            const ordersRes = await orderService.fetchAllOrders({ userId: user.id, status: 'delivered', limit: 1 });
                            const orders = Array.isArray(ordersRes) ? ordersRes : ordersRes?.data ?? [];
                            if (orders.length > 0) {
                                await maintenanceService.createRecord({
                                    orderId:    orders[0].id,
                                    date:       prevAppt.preferredDate?.split('T')[0] ?? new Date().toISOString().split('T')[0],
                                    type:       prevAppt.serviceType,
                                    workshopId: prevAppt.workshop?.id,
                                    comment:    prevAppt.notes ?? undefined,
                                });
                            }
                        }
                    } catch { /* silent */ }
                }
            }

            // Update other fields via notes (encode advisor) and re-fetch
            // For now just update local state — backend only has status update endpoint for appointments
            const updatedAppt: Appointment = {
                ...prevAppt!,
                status:        newStatus as AppointmentStatus,
                serviceType:   updates.serviceType   ?? prevAppt!.serviceType,
                preferredDate: updates.preferredDate ?? prevAppt!.preferredDate,
                preferredTime: updates.preferredTime ?? prevAppt!.preferredTime ?? null,
                workshop:      updates.workshop      ?? prevAppt!.workshop,
                notes:         updates.notesRaw      ?? prevAppt!.notes,
                updatedAt:     new Date().toISOString(),
            };

            setAppointments(prev => prev.map(a => a.id === id ? updatedAppt : a));
            setSelectedAppt(updatedAppt);
        } catch (e: any) {
            setError(e?.message ?? 'Error guardando cambios');
        } finally { setUpdatingId(null); }
    };

    const handleDelete = async () => {
        if (!toDelete) return;
        setIsDeleting(true);
        try {
            await appointmentsAdminService.remove(toDelete.id);
            setAppointments(prev => prev.filter(a => a.id !== toDelete.id));
            if (selectedAppt?.id === toDelete.id) setSelectedAppt(null);
        } catch (e: any) { setError(e?.message ?? 'Error eliminando cita'); }
        finally { setIsDeleting(false); setToDelete(null); }
    };

    const kpis = {
        total:       appointments.length,
        pending:     appointments.filter(a => a.status === 'pending').length,
        in_progress: appointments.filter(a => a.status === 'in_progress').length,
        completed:   appointments.filter(a => a.status === 'completed').length,
    };

    return (
        <div className="flex flex-col gap-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Total en vista"  count={kpis.total}       color="bg-slate-700/50 text-slate-300"     icon={<ClipboardList size={18} />} />
                <KpiCard label="Pendientes"       count={kpis.pending}     color="bg-amber-500/10 text-amber-400"     icon={<CircleDashed size={18} />} />
                <KpiCard label="En proceso"       count={kpis.in_progress} color="bg-purple-500/10 text-purple-400"   icon={<Loader2 size={18} />} />
                <KpiCard label="Completadas"      count={kpis.completed}   color="bg-emerald-500/10 text-emerald-400" icon={<CheckCheck size={18} />} />
            </div>

            {/* Filters + Actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="relative">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        className="bg-[#161b22] border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-300 focus:outline-none appearance-none cursor-pointer hover:border-white/20 transition-colors">
                        <option value="">Todos los estados</option>
                        {ALL_STATUSES.map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                </div>

                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                    className="bg-[#161b22] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none [color-scheme:dark] hover:border-white/20 transition-colors" />

                {filterDate && (
                    <button onClick={() => setFilterDate('')} className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1 transition-colors">
                        <X size={12} /> Limpiar fecha
                    </button>
                )}

                <div className="ml-auto flex items-center gap-2">
                    <button onClick={() => exportCSV(appointments)} disabled={appointments.length === 0}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-white/5 hover:border-white/10 disabled:opacity-40">
                        <Download size={13} /> Exportar CSV
                    </button>
                    <button onClick={() => setIsAdminMaintenanceOpen(true)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 transition-all px-3 py-1.5 rounded-lg">
                        <Plus size={13} /> Registrar mantenimiento
                    </button>
                    <button onClick={fetchData} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5" title="Recargar">
                        <RefreshCw size={13} />
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl flex items-start justify-between gap-4">
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-300 p-1 shrink-0"><X size={16} /></button>
                </div>
            )}

            {/* Table */}
            <div className="bg-[#161b22] border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest bg-[#0d1117]/40">
                                <th className="p-4 pl-5">Cliente</th>
                                <th className="p-4 hidden md:table-cell">Contacto</th>
                                <th className="p-4 hidden lg:table-cell">Servicio</th>
                                <th className="p-4 hidden sm:table-cell">Fecha</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4 pr-5 text-right">Ver</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={6} className="p-16 text-center">
                                    <div className="flex flex-col items-center gap-3 text-slate-500">
                                        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-sm">Cargando citas...</p>
                                    </div>
                                </td></tr>
                            ) : appointments.length === 0 ? (
                                <tr><td colSpan={6} className="p-16 text-center">
                                    <div className="flex flex-col items-center gap-2 text-slate-600">
                                        <ClipboardList size={32} strokeWidth={1} />
                                        <p className="text-sm">No hay citas con los filtros seleccionados.</p>
                                    </div>
                                </td></tr>
                            ) : (
                                appointments.map(appt => {
                                    const cfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.pending;
                                    const isSelected = selectedAppt?.id === appt.id;
                                    return (
                                        <tr key={appt.id}
                                            onClick={() => setSelectedAppt(isSelected ? null : appt)}
                                            className={cn(
                                                'border-b border-white/5 transition-colors cursor-pointer select-none',
                                                isSelected ? 'bg-cyan-500/5 border-l-2 border-l-cyan-500' : 'hover:bg-white/[0.03]'
                                            )}
                                        >
                                            <td className="p-4 pl-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
                                                    <div>
                                                        <p className="font-semibold text-slate-100 text-sm">{appt.name}</p>
                                                        <p className="text-slate-500 text-xs mt-0.5">#{appt.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <p className="text-slate-300 text-xs">{appt.email}</p>
                                                <p className="text-slate-500 text-xs mt-0.5">{appt.phone}</p>
                                            </td>
                                            <td className="p-4 hidden lg:table-cell">
                                                <span className="text-slate-400 text-xs">{appt.serviceType}</span>
                                            </td>
                                            <td className="p-4 hidden sm:table-cell whitespace-nowrap">
                                                <p className="text-slate-300 text-xs">{fmtDate(appt.preferredDate)}</p>
                                                {appt.preferredTime && <p className="text-slate-500 text-xs mt-0.5">{appt.preferredTime}</p>}
                                            </td>
                                            <td className="p-4"><StatusBadge status={appt.status} /></td>
                                            <td className="p-4 pr-5 text-right">
                                                <ChevronRight size={16} className={cn('text-slate-600 transition-colors', isSelected && 'text-cyan-400 rotate-90')} />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                {!isLoading && appointments.length > 0 && (
                    <div className="px-5 py-3 border-t border-white/5">
                        <p className="text-xs text-slate-600">{appointments.length} cita{appointments.length !== 1 ? 's' : ''} · Haz click en una fila para ver los detalles</p>
                    </div>
                )}
            </div>

            {/* Detail Side Panel */}
            {selectedAppt && (
                <DetailPanel
                    appt={selectedAppt}
                    workshops={workshops}
                    onClose={() => setSelectedAppt(null)}
                    onSave={handleSave}
                    onDelete={a => { setToDelete(a); setSelectedAppt(null); }}
                />
            )}

            {/* Delete confirmation */}
            {toDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-100 flex items-center justify-between">
                                        Eliminar cita
                                        <button onClick={() => !isDeleting && setToDelete(null)} disabled={isDeleting} className="text-slate-500 hover:text-slate-300 transition-colors"><X size={18} /></button>
                                    </h3>
                                    <p className="text-slate-300 text-sm mt-3">
                                        Eliminar la cita de <strong className="text-slate-100">{toDelete.name}</strong>. Esta acción es permanente.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-[#0d1117]/40 border-t border-white/5 flex justify-end gap-3">
                            <button onClick={() => setToDelete(null)} disabled={isDeleting} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 disabled:opacity-50 transition-colors">Cancelar</button>
                            <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
                                {isDeleting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Eliminando...</> : <><Trash2 size={14} /> Eliminar</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Maintenance Modal */}
            <AdminMaintenanceModal
                isOpen={isAdminMaintenanceOpen}
                onClose={() => setIsAdminMaintenanceOpen(false)}
                onSuccess={() => {}}
                workshops={workshops}
            />
        </div>
    );
}
