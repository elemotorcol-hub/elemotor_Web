import { Metadata } from 'next';
import DashboardLayoutWrapper from '@/components/dashboard/DashboardLayoutWrapper';
import { MOCK_DASHBOARD_DATA } from '@/mocks/dashboardData';

export const metadata: Metadata = {
    title: 'Dashboard - Elemotor',
    description: 'Panel de cliente para gestión y rastreo de vehículos Elemotor.',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = MOCK_DASHBOARD_DATA;

    return (
        <DashboardLayoutWrapper user={user}>
            {children}
        </DashboardLayoutWrapper>
    );
}
