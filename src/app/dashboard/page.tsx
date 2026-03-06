import { TrackingHeroCard } from '@/components/dashboard/TrackingHeroCard';
import { QuickActionsGrid } from '@/components/dashboard/QuickActionsGrid';
import { RecentActivityTimeline } from '@/components/dashboard/RecentActivityTimeline';
import { VehicleDetailWidget } from '@/components/dashboard/VehicleDetailWidget';
import { MOCK_DASHBOARD_DATA } from '@/mocks/dashboardData';
import { MapPin } from 'lucide-react';

export default function DashboardPage() {
    const { tracking, vehicle, recentActivities } = MOCK_DASHBOARD_DATA;

    return (
        <div className="space-y-6 md:space-y-10 max-w-7xl mx-auto pb-10">
            {/* Top Level: Tracking Hero Card */}
            <TrackingHeroCard
                status={tracking.status}
                title={tracking.title}
                description={tracking.description}
                progressPercentage={tracking.progressPercentage}
                estimatedDate={tracking.estimatedDate}
            />

            {/* Second Level: Quick Actions */}
            <QuickActionsGrid />

            {/* Third Level: Activity & Location Map & Vehicle Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                {/* Left Column (Activities) - Takes 1 column on LG */}
                <div className="lg:col-span-1">
                    <RecentActivityTimeline activities={recentActivities} />
                </div>

                {/* Right Column (Map & Vehicle Details) - Takes 2 columns on LG, splits into 2 on its own */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">

                    {/* Simulated Map Widget */}
                    <div className="bg-[#15201D] border border-white/5 rounded-[32px] overflow-hidden relative min-h-[250px] shadow-xl group">
                        {/* Map Background Pattern (Simulated) */}
                        <div
                            className="absolute inset-0 opacity-10 blur-[1px] mix-blend-screen transition-transform duration-[10s] ease-linear group-hover:scale-110"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310B981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#0A110F] via-[#15201D]/80 to-transparent" />

                        {/* Location Pin overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-[#15201D]/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                                <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-[#10B981]" />
                                </div>
                                <div className="text-left">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-0.5">Ubicación Actual</span>
                                    <span className="text-sm font-black text-white">{tracking.currentLocation}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div>
                        <VehicleDetailWidget vehicle={vehicle} />
                    </div>
                </div>
            </div>
        </div>
    );
}
