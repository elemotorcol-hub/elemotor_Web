'use client';

import { useState } from 'react';
import { Wrench, CheckCircle2, Plus, Loader2 } from 'lucide-react';
import { useMaintenance } from '@/hooks/useMaintenance';
import { MaintenanceAccessBlocker } from '@/components/dashboard/maintenance/MaintenanceAccessBlocker';
import { MaintenanceStatusCard } from '@/components/dashboard/maintenance/MaintenanceStatusCard';
import { MaintenanceHistoryList } from '@/components/dashboard/maintenance/MaintenanceHistoryList';
import { MarkMaintenanceDoneModal } from '@/components/dashboard/maintenance/ScheduleMaintenanceModal';
import { ScheduleAppointmentModal } from '@/components/dashboard/maintenance/ScheduleAppointmentModal';
import { CalendarClock } from 'lucide-react';

export default function MantenimientoPage() {
    const [isMarkDoneModalOpen, setIsMarkDoneModalOpen] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
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
        <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
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
            </div>

            {/* Status hero card */}
            {maintenanceState && (
                <MaintenanceStatusCard
                    state={maintenanceState}
                    deliveredAt={deliveredAt}
                />
            )}

            {/* History list */}
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
        </div>
    );
}
