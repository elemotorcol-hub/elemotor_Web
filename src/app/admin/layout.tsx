import { Bell, LayoutDashboard, Car, Users, Settings, LogOut } from 'lucide-react';
import { getSession } from '@/lib/auth.server';
import { redirect } from 'next/navigation';
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';

interface SessionPayload {
    user?: {
        id?: string;
        name?: string;
        email?: string;
    };
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const sessionPayload = await getSession() as SessionPayload | null;
    const session = sessionPayload?.user;

    if (!session) {
        redirect('/auth/login');
    }

    const userData = {
        id: session.id,
        name: session.name || 'Administrador Elemotor',
        email: session.email || 'admin@elemotor.co'
    };

    return <AdminLayoutWrapper session={userData}>{children}</AdminLayoutWrapper>;
}
