import { Metadata } from 'next';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopHeader } from '@/components/dashboard/TopHeader';
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
    // In a real app, you would fetch user session here (e.g. from cookies/JWT)
    // For now, we use our mock data for the TopHeader 
    const { user } = MOCK_DASHBOARD_DATA;

    return (
        <div className="min-h-screen bg-[#0A110F] text-slate-300 selection:bg-[#10B981] selection:text-[#0A110F] flex font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col min-h-screen">
                <TopHeader userName={user.name} role={user.role} />

                <main className="flex-1 overflow-x-hidden p-6 lg:p-10 lg:pl-[300px]">
                    {children}
                </main>
            </div>
        </div>
    );
}
