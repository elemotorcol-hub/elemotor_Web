import { Metadata } from 'next';
import { MOCK_DASHBOARD_DATA } from '@/mocks/dashboardData';
import { UserProfileBanner } from '@/components/dashboard/profile/UserProfileBanner';
import { AccountStatsGrid } from '@/components/dashboard/profile/AccountStatsGrid';
import { AdvisorCard } from '@/components/dashboard/profile/AdvisorCard';

export const metadata: Metadata = {
    title: 'Mi Perfil - Dashboard Elemotor',
    description: 'Resumen de tu cuenta y membresía Elemotor.',
};

export default function ProfilePage() {
    const { user } = MOCK_DASHBOARD_DATA;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Title */}
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                    Resumen de <span className="text-[#10B981]">Membresía</span>
                </h1>
                <p className="text-slate-400">
                    Tu estatus como cliente, beneficios activos y conexión directa con tu asesor.
                </p>
            </div>

            {/* Profile Banner */}
            <UserProfileBanner user={user} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                
                {/* Left Col: Stats */}
                <div className="lg:col-span-2">
                    <AccountStatsGrid />
                </div>

                {/* Right Col: Advisor */}
                <div className="lg:col-span-1">
                    <AdvisorCard />
                </div>

            </div>
        </div>
    );
}
