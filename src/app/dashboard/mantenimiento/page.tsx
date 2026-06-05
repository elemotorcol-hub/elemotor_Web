'use client';

import { useState } from 'react';
import { Wrench, CheckCircle2, Loader2, CalendarClock } from 'lucide-react';
import { useMaintenance } from '@/hooks/useMaintenance';
import { MaintenanceAccessBlocker } from '@/components/dashboard/maintenance/MaintenanceAccessBlocker';
import { MaintenanceStatusCard } from '@/components/dashboard/maintenance/MaintenanceStatusCard';
import { MaintenanceHistoryList } from '@/components/dashboard/maintenance/MaintenanceHistoryList';

import { MarkMaintenanceDoneModal } from '@/components/dashboard/maintenance/ScheduleMaintenanceModal';
import { ScheduleAppointmentModal } from '@/components/dashboard/maintenance/ScheduleAppointmentModal';
import { WorkshopsMap } from '@/components/talleres/WorkshopsMap';
import { AppointmentModal } from '@/components/talleres/AppointmentModal';

export default function MantenimientoPage() {
    const [isMarkDoneModalOpen, setIsMarkDoneModalOpen] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState<'historial' | 'talleres'>('historial');
    const {
        isLoading,
        isDelivered,
        deliveredOrder,
        records,
        summary,
        maintenanceState,
        isSaving,
        createRecord,
    } = useMaintenance();

    // ─── Loading state ────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
                    <p className="text-slate-500 text-sm">Cargando módulo de mantenimiento…</p>
                </div>
            </div>
        );
    }

    // ─── Access blocked ───────────────────────────────────────────────────────
    if (!isDelivered) {
        return <MaintenanceAccessBlocker />;
    }

    // ─── Full dashboard ───────────────────────────────────────────────────────
    const deliveredAt = new Date(deliveredOrder!.deliveredAt!);

    return (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Page title + Tabs row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Mantenimiento <span className="text-[#10B981]">EV</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-slate-500" />
                        Seguimiento basado en el ciclo de 6 meses / 10,000 km
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-[#15201D] border border-white/5 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('historial')}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                            activeTab === 'historial'
                                ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Mi Historial
                    </button>
                    <button
                        onClick={() => setActiveTab('talleres')}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                            activeTab === 'talleres'
                                ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Talleres
                    </button>
                </div>
            </div>

            {/* ── Tab: Mi Historial ─────────────────────────────────────────── */}
            {activeTab === 'historial' && (
                <>
                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <button
                            onClick={() => setIsAppointmentModalOpen(true)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-[#10B981]/25"
                        >
                            <CalendarClock className="w-4 h-4" />
                            Agendar cita
                        </button>
                        <button
                            onClick={() => setIsMarkDoneModalOpen(true)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/30 hover:border-[#10B981]/60 text-[#10B981] hover:text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Marcar realizado
                        </button>
                    </div>

                    {/* Status hero card */}
                    {maintenanceState && (
                        <MaintenanceStatusCard
                            state={maintenanceState}
                            deliveredAt={deliveredAt}
                        />
                    )}

                    {/* History */}
                    <MaintenanceHistoryList
                        records={records}
                        totalCost={summary.totalCost}
                    />

                    {/* Mark done modal */}
                    <MarkMaintenanceDoneModal
                        isOpen={isMarkDoneModalOpen}
                        orderId={deliveredOrder!.orderId}
                        isSaving={isSaving}
                        onClose={() => setIsMarkDoneModalOpen(false)}
                        onSubmit={async (data) => {
                            await createRecord(data);
                            setIsMarkDoneModalOpen(false);
                        }}
                    />

                    {/* Schedule appointment modal */}
                    <ScheduleAppointmentModal
                        isOpen={isAppointmentModalOpen}
                        onClose={() => setIsAppointmentModalOpen(false)}
                    />
                </>
            )}

            {/* ── Tab: Talleres ─────────────────────────────────────────────── */}
            {activeTab === 'talleres' && (
                <div className="-mx-6 lg:-mx-10 overflow-hidden" style={{ height: 'calc(100vh - 130px)' }}>
                    {/* Cancel the pt-[72px] internal to WorkshopsMap */}
                    <div className="-mt-[72px] h-[calc(100%+72px)]">
                        <WorkshopsMap />
                    </div>
                </div>
            )}

            {/* AppointmentModal for the Talleres tab */}
            {activeTab === 'talleres' && <AppointmentModal />}
        </div>
    );
}
