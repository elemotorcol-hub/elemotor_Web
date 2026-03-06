import React, { useState, useEffect } from 'react';
import { X, Check, Clock } from 'lucide-react';
import { Order, OrderStatus } from '@/types/orders';

interface UpdateOrderStatusModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (orderId: string, newStatus: OrderStatus, description: string) => void;
}

const PIPELINE: OrderStatus[] = [
    'Fabricación',
    'En Puerto',
    'En Tránsito',
    'Aduanas',
    'Listo para Entrega'
];

export default function UpdateOrderStatusModal({ order, isOpen, onClose, onSave }: UpdateOrderStatusModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('Fabricación');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (order) {
            setSelectedStatus(order.status);
            setDescription('');
        }
    }, [order]);

    if (!isOpen || !order) return null;

    const currentIndex = PIPELINE.indexOf(selectedStatus);

    const handleSave = () => {
        onSave(order.id, selectedStatus, description);
        onClose();
        setIsDropdownOpen(false);
        setDescription('');
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Sidebar Modal */}
            <div className="relative w-full max-w-[420px] bg-[#0A110F] h-full border-l border-white/5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 z-10">

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                    <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Registro de Importación</h2>
                    <p className="text-[14px] text-slate-400 mb-8 font-medium font-mono">{order.trackingCode} — {order.clientName}</p>

                    <h3 className="text-[13px] font-bold tracking-wide text-slate-500 mb-6">Pipeline e Historial</h3>

                    {/* Timeline */}
                    <div className="relative flex flex-col gap-8">
                        {PIPELINE.map((step, index) => {
                            const currentTargetIndex = PIPELINE.indexOf(order.status);
                            const isCompleted = index <= currentTargetIndex;
                            const isCurrent = index === currentTargetIndex;
                            const isLast = index === PIPELINE.length - 1;

                            // Búsqueda del historial para esta fase (si lo hay)
                            // Al re-pasar fases solo tomará la última vez
                            const stepHistory = order.history?.find(h => h.status === step);

                            return (
                                <div key={step} className="flex gap-4 relative z-10 min-h-[40px]">
                                    {/* Line connecting to the next item */}
                                    {!isLast && (
                                        <div className={`absolute left-4 top-8 bottom-[-32px] w-[2px] -translate-x-[1px] ${index < currentTargetIndex ? 'bg-[#10B981]' : 'bg-slate-800'}`}></div>
                                    )}

                                    <div className="flex flex-col items-center">
                                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 mt-[-4px] ${isCompleted ? 'bg-[#10B981] text-[#0A110F]' : 'bg-[#0A110F] border-2 border-slate-700 text-transparent'}`}>
                                            <Check className="w-4 h-4" strokeWidth={3} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col mt-[-1px] max-w-[280px]">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[15px] font-bold leading-none ${isCurrent ? 'text-[#10B981]' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                                                {step}
                                            </span>
                                            {stepHistory && (
                                                <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                                    <Clock size={10} /> {stepHistory.date}
                                                </span>
                                            )}
                                        </div>

                                        {isCurrent && !stepHistory?.description && (
                                            <span className="text-xs text-slate-500 mt-1.5 font-medium">Estado actual en bodega</span>
                                        )}

                                        {stepHistory?.description && (
                                            <span className="text-[13px] text-slate-400 mt-1.5 leading-snug">
                                                {stepHistory.description}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <h3 className="text-[13px] font-bold tracking-wide text-slate-500 mt-12 mb-3 pt-6 border-t border-white/5">Reportar Novedad y Estado</h3>

                    {/* Custom Select Dropdown */}
                    <div className="relative mb-4">
                        <button
                            className="w-full bg-[#15201D] border border-white/5 rounded-xl px-4 py-3.5 flex justify-between items-center text-[15px] font-semibold text-white hover:border-white/10 transition-colors focus:outline-none"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {selectedStatus}
                            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A110F] border border-white/5 rounded-xl p-1.5 z-50 shadow-2xl">
                                {PIPELINE.map((step) => (
                                    <button
                                        key={step}
                                        className={`w-full text-left px-3.5 py-3 rounded-lg text-[15px] font-semibold flex justify-between items-center transition-colors hover:bg-[#10B981] hover:text-[#0A110F] ${step === selectedStatus
                                            ? 'text-white bg-white/5'
                                            : 'text-slate-300'
                                            }`}
                                        onClick={() => {
                                            setSelectedStatus(step);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        {step}
                                        {step === selectedStatus && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-400 mb-2">Descripción de la novedad</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Ej: El contenedor superó el control aduanero y va camino al centro de distribución principal."
                            className="w-full bg-[#15201D] border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#00D4AA] transition-colors resize-none custom-scrollbar"
                        />
                    </div>

                    <button
                        className="w-full bg-[#10B981] hover:bg-[#059669] text-[#0A110F] font-bold py-3.5 rounded-xl mt-4 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        onClick={handleSave}
                    >
                        Guardar e Informar Novedad
                    </button>

                </div>
            </div>
        </div>
    );
}
