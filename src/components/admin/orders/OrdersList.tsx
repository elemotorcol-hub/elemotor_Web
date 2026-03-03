'use client';

import React, { useState } from 'react';
import { Pencil, Car } from 'lucide-react';
import { MOCK_ORDERS } from '@/mocks/ordersData';
import { OrderStatus, Order } from '@/types/orders';
import UpdateOrderStatusModal from './UpdateOrderStatusModal';

export default function OrdersList() {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleSaveStatus = (orderId: string, newStatus: OrderStatus) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };
    const getStatusStyle = (status: OrderStatus) => {
        switch (status) {
            case 'Listo para Entrega':
                return 'text-emerald-500 bg-emerald-500/10';
            case 'En Tránsito':
                return 'text-cyan-500 bg-cyan-500/10';
            case 'Aduanas':
                return 'text-yellow-500 bg-yellow-500/10';
            case 'En Puerto':
                return 'text-blue-500 bg-blue-500/10';
            case 'Fabricación':
                return 'text-slate-400 bg-slate-400/10';
            default:
                return 'text-slate-400 bg-slate-400/10';
        }
    };

    return (
        <div className="w-full bg-transparent border border-white/5 rounded-2xl overflow-hidden mt-6">
            <div className="overflow-x-auto min-w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 text-slate-500 text-sm">
                            <th className="font-semibold py-4 px-6 tracking-wide">ID de Pedido</th>
                            <th className="font-semibold py-4 px-6 tracking-wide">Nombre del Cliente</th>
                            <th className="font-semibold py-4 px-6 tracking-wide">Vehículo</th>
                            <th className="font-semibold py-4 px-6 tracking-wide">Estado de Importación</th>
                            <th className="font-semibold py-4 px-6 tracking-wide">Fecha Est. de Entrega</th>
                            <th className="font-semibold py-4 px-6 tracking-wide">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-0">
                                <td className="py-4 px-6 font-medium text-teal-400">
                                    {order.id}
                                </td>
                                <td className="py-4 px-6 font-medium text-white">
                                    {order.clientName}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2 text-white font-medium">
                                        <Car className="w-4 h-4 text-slate-400" />
                                        {order.vehicleModel}
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-slate-400">
                                    {order.estimatedDelivery}
                                </td>
                                <td className="py-4 px-6">
                                    <button
                                        onClick={() => handleEditOrder(order)}
                                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <UpdateOrderStatusModal
                isOpen={isModalOpen}
                order={selectedOrder}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveStatus}
            />
        </div>
    );
}
