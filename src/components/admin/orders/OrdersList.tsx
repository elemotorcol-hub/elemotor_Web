'use client';

import React, { useState, useMemo } from 'react';
import { Pencil, Car, Search, Plus, Calendar, Filter } from 'lucide-react';
import { MOCK_ORDERS } from '@/mocks/ordersData';
import { OrderStatus, Order } from '@/types/orders';
import UpdateOrderStatusModal from './UpdateOrderStatusModal';
import OrderSlideOver from './OrderSlideOver';

export default function OrdersList() {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

    // Status and Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [dateFilter, setDateFilter] = useState<'all' | 'this_month' | 'last_month'>('all');

    // Modals state
    const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<Order | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [slideOverMode, setSlideOverMode] = useState<'add' | 'edit'>('add');
    const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<Order | null>(null);

    // Derived State: Filters
    const filteredOrders = useMemo(() => {
        let result = orders;

        if (statusFilter !== 'all') {
            result = result.filter(o => o.status === statusFilter);
        }

        if (searchTerm) {
            const lowerQuery = searchTerm.toLowerCase();
            result = result.filter(o =>
                o.trackingCode.toLowerCase().includes(lowerQuery) ||
                o.clientName.toLowerCase().includes(lowerQuery)
            );
        }

        // TODO: Implement actual date filtering logic once date objects are standardized
        return result;
    }, [orders, statusFilter, searchTerm, dateFilter]);

    const handleEditStatus = (order: Order) => {
        setSelectedOrderForStatus(order);
        setIsStatusModalOpen(true);
    };

    const handleSaveStatus = (orderId: string, newStatus: OrderStatus, description: string) => {
        setOrders(orders.map(o => {
            if (o.id === orderId) {
                return {
                    ...o,
                    status: newStatus,
                    history: [
                        ...o.history,
                        { status: newStatus, date: new Date().toISOString().split('T')[0], description }
                    ]
                };
            }
            return o;
        }));
    };

    const handleAddOrder = () => {
        setSlideOverMode('add');
        setSelectedOrderForEdit(null);
        setIsSlideOverOpen(true);
    };

    const handleEditDetails = (order: Order) => {
        setSlideOverMode('edit');
        setSelectedOrderForEdit(order);
        setIsSlideOverOpen(true);
    };

    const getStatusStyle = (status: OrderStatus) => {
        switch (status) {
            case 'Listo para Entrega': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'En Tránsito': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
            case 'Aduanas': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'En Puerto': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'Fabricación': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <div className="w-full">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    {/* Search by Tracking/Client */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar por código PIN o Cliente..."
                            className="w-full bg-[#0A0F1C] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative w-full sm:w-auto">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                            className="w-full sm:w-auto bg-[#0A0F1C] border border-white/5 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00D4AA] appearance-none cursor-pointer"
                        >
                            <option value="all">Todos los Estados</option>
                            <option value="Fabricación">Fabricación</option>
                            <option value="En Puerto">En Puerto</option>
                            <option value="En Tránsito">En Tránsito</option>
                            <option value="Aduanas">Aduanas</option>
                            <option value="Listo para Entrega">Listo para Entrega</option>
                        </select>
                    </div>

                    {/* Date Filter */}
                    <div className="relative w-full sm:w-auto">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value as any)}
                            className="w-full sm:w-auto bg-[#0A0F1C] border border-white/5 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00D4AA] appearance-none cursor-pointer"
                        >
                            <option value="all">Cualquier Fecha</option>
                            <option value="this_month">Este Mes</option>
                            <option value="last_month">Mes Anterior</option>
                        </select>
                    </div>
                </div>

                {/* Create Button */}
                <button
                    onClick={handleAddOrder}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#00D4AA] hover:bg-[#00B38F] text-[#0A0F1C] font-bold px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(0,212,170,0.15)] active:scale-95"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="text-sm tracking-wide">Nuevo Pedido</span>
                </button>
            </div>

            {/* Table */}
            <div className="w-full bg-[#0A0F1C] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto min-w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02] text-slate-400 text-[13px] uppercase tracking-wider font-semibold">
                                <th className="py-4 px-6">Tracking Code</th>
                                <th className="py-4 px-6">Cliente</th>
                                <th className="py-4 px-6">Vehículo</th>
                                <th className="py-4 px-6">Estado</th>
                                <th className="py-4 px-6">Entrega Est.</th>
                                <th className="py-4 px-6 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-[14px]">
                            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-0">
                                    <td className="py-4 px-6 font-mono font-bold text-[#00D4AA]">
                                        {order.trackingCode}
                                    </td>
                                    <td className="py-4 px-6 font-semibold text-white">
                                        {order.clientName}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 text-white font-medium">
                                                <Car className="w-4 h-4 text-slate-400" />
                                                {order.vehicleModel}
                                            </div>
                                            <span className="text-xs text-slate-500 mt-1 pl-6">{order.trimName} - {order.colorName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <button
                                            onClick={() => handleEditStatus(order)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors hover:opacity-80 ${getStatusStyle(order.status)}`}
                                        >
                                            {order.status}
                                        </button>
                                    </td>
                                    <td className="py-4 px-6 text-slate-400">
                                        {order.estimatedDelivery}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleEditDetails(order)}
                                                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                                <span className="text-xs font-semibold">Editar Detalles</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500">
                                        No se encontraron pedidos que coincidan con los filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UpdateOrderStatusModal
                isOpen={isStatusModalOpen}
                order={selectedOrderForStatus}
                onClose={() => setIsStatusModalOpen(false)}
                onSave={handleSaveStatus}
            />

            {isSlideOverOpen && (
                <OrderSlideOver
                    mode={slideOverMode}
                    initialData={selectedOrderForEdit}
                    onClose={() => setIsSlideOverOpen(false)}
                    onSave={(data: Partial<Order>) => {
                        console.log('Saved order data:', data);
                        // Implement save logic here later
                        setIsSlideOverOpen(false);
                    }}
                />
            )}
        </div>
    );
}
