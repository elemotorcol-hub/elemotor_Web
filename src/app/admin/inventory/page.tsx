import React from 'react';
import InventoryTable from '@/components/admin/InventoryTable';

export const metadata = {
    title: 'Vehicle Inventory | Admin',
    description: 'Manage EV models, trims, and specifications',
};

export default function InventoryPage() {
    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-8">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Vehicle Inventory</h1>
                <p className="text-slate-400">Manage your EV models, trims, and specifications</p>
            </div>

            <InventoryTable />
        </div>
    );
}
