'use client';

import React, { useEffect, useState } from 'react';
import { X, Save, Car, Loader2 } from 'lucide-react';
import { Order } from '@/types/orders';
import { orderService } from '@/services/order.service';
import { sanitizeObject } from '@/lib/utils/sanitizationUtils';

interface OrderSlideOverProps {
    onClose: () => void;
    mode: 'add' | 'edit';
    initialData?: Order | null;
    onSave: (data: Partial<Order>) => void;
}

export default function OrderSlideOver({ onClose, mode, initialData, onSave }: OrderSlideOverProps) {
    // ─── Catalogues ─────────────────────────────────────────────────────────
    const [users, setUsers] = useState<any[]>([]);
    const [trims, setTrims] = useState<any[]>([]);
    const [colors, setColors] = useState<any[]>([]);
    const [loadingCats, setLoadingCats] = useState(mode === 'add');

    // ─── Form fields ────────────────────────────────────────────────────────
    const [userId, setUserId] = useState<number | ''>(initialData?.userId ?? '');
    const [trimId, setTrimId] = useState<number | ''>(initialData?.trimId ?? '');
    const [colorId, setColorId] = useState<number | ''>(initialData?.colorId ?? '');
    const [estimatedDelivery, setEstimatedDelivery] = useState(
        initialData?.estimatedDelivery ? initialData.estimatedDelivery.slice(0, 10) : ''
    );
    const [vin, setVin] = useState(initialData?.vin ?? '');
    const [notes, setNotes] = useState(initialData?.notes ?? '');

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ─── Load catalogues (only for create mode) ─────────────────────────────
    useEffect(() => {
        if (mode !== 'add') return;
        (async () => {
            try {
                const [usersRes, trimsRes] = await Promise.all([
                    orderService.fetchUsers(),
                    orderService.fetchTrims(),
                ]);
                setUsers(usersRes.data || []);
                setTrims(trimsRes.data || []);
            } catch (e) {
                setError('No se pudieron cargar los catálogos');
            } finally {
                setLoadingCats(false);
            }
        })();
    }, [mode]);

    // ─── Pre-fill trim from client's won quote ───────────────────────────────
    useEffect(() => {
        if (!userId || mode !== 'add') return;
        const selectedUser = users.find((u: any) => u.id === Number(userId));
        if (!selectedUser?.email) return;
        orderService.fetchWonQuoteByEmail(selectedUser.email).then(quote => {
            if (quote?.trim?.id) {
                setTrimId(quote.trim.id);
            }
        }).catch(() => {/* silencioso — no bloquear */});
    }, [userId, users, mode]);

    // ─── Load colors when trim changes ──────────────────────────────────────
    useEffect(() => {
        if (!trimId) { setColors([]); setColorId(''); return; }
        orderService.fetchColorsByTrim(Number(trimId)).then(async data => {
            if (Array.isArray(data) && data.length > 0) {
                setColors(data);
            } else {
                // Fallback: cargar todos los colores si el trim no tiene colores específicos
                const all = await orderService.fetchAllColors();
                setColors(all);
            }
        }).catch(() => setColors([]));
        setColorId('');
    }, [trimId]);

    // ─── Submit ─────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (mode === 'add') {
            if (!trimId || !colorId) {
                setError('Versión y color son obligatorios.');
                return;
            }
            setSubmitting(true);
            try {
                // Build an exact payload matching CreateOrderDto — no extra fields
                const payload: Record<string, any> = {
                    trimId: Number(trimId),
                    colorId: Number(colorId),
                };
                if (userId) payload.userId = Number(userId);
                if (vin.trim()) payload.vin = vin.trim();
                if (notes.trim()) payload.notes = notes.trim();
                if (estimatedDelivery) payload.estimatedDelivery = estimatedDelivery;

                console.log('[CreateOrder] Payload:', JSON.stringify(payload));
                await orderService.createOrder(payload as any);
                onSave({}); // Signal parent to close + refresh
            } catch (err: any) {
                console.error('[CreateOrder] Error:', err.message);
                setError(err.message || 'Error al crear pedido');
                setSubmitting(false);
            }
        } else if (mode === 'edit' && initialData) {
            setSubmitting(true);
            try {
                await orderService.updateOrderDetails(initialData.id, {
                    vin: vin.trim() || undefined,
                    notes: notes.trim() || undefined,
                    estimatedDelivery: estimatedDelivery || undefined,
                });
                onSave({});
            } catch (err: any) {
                console.error('[EditOrder] Error:', err.message);
                setError(err.message || 'Error al actualizar pedido');
                setSubmitting(false);
            }
        }
    };

    const inputCls = 'w-full bg-[#0A110F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#00D4AA] transition-colors';

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Panel */}
            <form
                onSubmit={handleSubmit}
                className="fixed inset-y-0 right-0 z-50 w-full md:w-[480px] bg-[#0A110F] shadow-2xl border-l border-slate-800/60 flex flex-col"
            >
                {/* Header */}
                <div className="flex-shrink-0 px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                        <div>
                            <h2 className="text-[20px] font-bold text-white tracking-tight">
                                {mode === 'add' ? 'Nuevo Pedido' : 'Editar Pedido'}
                            </h2>
                            {mode === 'edit' && initialData?.trackingCode && (
                                <p className="text-xs font-mono text-[#00D4AA] mt-0.5">{initialData.trackingCode}</p>
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-[#0A110F] px-4 py-2 rounded-lg font-bold text-[13px] transition-all"
                    >
                        {submitting ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                        {mode === 'add' ? 'Crear' : 'Guardar'}
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {loadingCats ? (
                        <div className="flex items-center justify-center py-16 text-slate-500">
                            <Loader2 className="animate-spin w-6 h-6 mr-2" />
                            Cargando catálogos...
                        </div>
                    ) : (
                        <>
                            {/* CREATE-ONLY: selectors for userId, trimId, colorId */}
                            {mode === 'add' && (
                                <div className="bg-[#15201D] border border-white/5 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-[11px] font-black tracking-widest text-[#00D4AA] uppercase flex items-center gap-2">
                                        <Car size={13} /> Asignación del Pedido
                                    </h3>

                                    {/* Cliente */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-2">Cliente</label>
                                        <select
                                            value={userId}
                                            onChange={e => setUserId(Number(e.target.value))}
                                            className={inputCls}
                                        >
                                            <option value="">Selecciona un cliente</option>
                                            {users.map((u: any) => (
                                                <option key={u.id} value={u.id}>
                                                    {u.name} — {u.email}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Trim/Versión */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-2">Versión del Vehículo *</label>
                                        <select
                                            value={trimId}
                                            onChange={e => setTrimId(Number(e.target.value))}
                                            required
                                            className={inputCls}
                                        >
                                            <option value="">Selecciona una versión</option>
                                            {trims.map((t: any) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.model?.brand?.name} {t.model?.name} — {t.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Color */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-2">Color *</label>
                                        <select
                                            value={colorId}
                                            onChange={e => setColorId(Number(e.target.value))}
                                            required
                                            disabled={!trimId}
                                            className={`${inputCls} disabled:opacity-40`}
                                        >
                                            <option value="">{trimId ? 'Selecciona un color' : 'Primero elige una versión'}</option>
                                            {colors.map((c: any) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Shared fields: VIN, estimatedDelivery, notes */}
                            <div className="bg-[#15201D] border border-white/5 rounded-2xl p-6 space-y-4">
                                <h3 className="text-[11px] font-black tracking-widest text-[#00D4AA] uppercase">
                                    Detalles Adicionales
                                </h3>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2">VIN (Chasis)</label>
                                    <input
                                        type="text"
                                        value={vin}
                                        onChange={e => setVin(e.target.value)}
                                        placeholder="17 caracteres — dejar vacío si no aplica"
                                        maxLength={17}
                                        className={`${inputCls} font-mono`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2">Fecha Estimada de Entrega</label>
                                    <input
                                        type="date"
                                        value={estimatedDelivery}
                                        onChange={e => setEstimatedDelivery(e.target.value)}
                                        className={inputCls}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2">Notas Internas</label>
                                    <textarea
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                        rows={3}
                                        placeholder="Observaciones internas sobre el pedido..."
                                        className={`${inputCls} resize-none`}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </form>
        </>
    );
}
