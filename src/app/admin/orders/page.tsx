import React from 'react';
import OrdersList from '@/components/admin/orders/OrdersList';

export default function OrdersPage() {
    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Pedidos e Importaciones</h1>
                <p className="text-slate-400">
                    Gestiona los pedidos de los clientes, haz seguimiento al pipeline logístico y actualiza estados de importación.
                </p>
            </div>

            <OrdersList />
        </div>
    );
}
