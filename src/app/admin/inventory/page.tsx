import React from 'react';
import InventoryClient from '@/components/admin/InventoryClient';

export const metadata = {
    title: 'Vehicle Inventory | Admin',
    description: 'Manage EV models, trims, and specifications',
};

export default function InventoryPage() {
    return (
        <InventoryClient />
    );
}
