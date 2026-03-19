import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import DashboardLayoutWrapper from '@/components/dashboard/DashboardLayoutWrapper';
import { getSession } from '@/lib/auth.server';

export const metadata: Metadata = {
    title: 'Dashboard - Elemotor',
    description: 'Panel de cliente para gestión y rastreo de vehículos Elemotor.',
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/login');
    }

    // Dividimos el nombre en "name" y "lastName" a partir del string completo del payload para cumplir con la separación requerida por la UI
    const parts = session.user.name.trim().split(' ');
    const firstName = parts[0] || 'Usuario';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
    
    const userForLayout = {
        name: firstName,
        lastName: lastName,
        role: session.user.role === 'admin' ? 'Administrador' : 'Cliente Premium'
    };

    return (
        <DashboardLayoutWrapper user={userForLayout}>
            {children}
        </DashboardLayoutWrapper>
    );
}
