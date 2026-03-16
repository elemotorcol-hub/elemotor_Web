import { Metadata } from 'next';
import { MOCK_DASHBOARD_DATA } from '@/mocks/dashboardData';
import { ProfileView } from '@/components/dashboard/profile/ProfileView';

export const metadata: Metadata = {
    title: 'Mi Perfil - Dashboard Elemotor',
    description: 'Resumen de tu cuenta y membresía Elemotor.',
};

export default function ProfilePage() {
    const { user } = MOCK_DASHBOARD_DATA;

    return <ProfileView user={user} />;
}
