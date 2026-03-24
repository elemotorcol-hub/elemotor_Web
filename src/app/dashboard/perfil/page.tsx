import { Metadata } from 'next';
import { ProfileView } from '@/components/dashboard/profile/ProfileView';

export const metadata: Metadata = {
    title: 'Mi Perfil - Dashboard Elemotor',
    description: 'Resumen de tu cuenta y membresía Elemotor.',
};

export default function ProfilePage() {
    return <ProfileView />;
}
