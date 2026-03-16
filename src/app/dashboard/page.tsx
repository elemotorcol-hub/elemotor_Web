import { QuickActionsGrid } from '@/components/dashboard/QuickActionsGrid';
import { VehicleDetailWidget } from '@/components/dashboard/VehicleDetailWidget';
import { MOCK_DASHBOARD_DATA } from '@/mocks/dashboardData';

export default function DashboardPage() {
    const { vehicle } = MOCK_DASHBOARD_DATA;

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Main Welcome Message or Top Space */}
            <div className="pt-4">
                <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                    Panel de <span className="text-[#10B981]">Control</span>
                </h1>
                <p className="text-slate-400 font-medium italic">Gestiona tu experiencia Elemotor desde un solo lugar.</p>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Primary Column: Quick Actions */}
                <div className="lg:col-span-12 flex flex-col gap-10">
                    <div className="space-y-4">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] px-2 outline-none">
                            Acciones Rápidas
                        </h2>
                        <QuickActionsGrid />
                    </div>
                </div>

                {/* Secondary Column: Vehicle Info - HIDDEN AS REQUESTED */}
                {/* 
                <div className="lg:col-span-4 flex flex-col h-full">
                    <div className="space-y-4 h-full">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] px-2 outline-none">
                            Tu Vehículo
                        </h2>
                        <div className="h-full">
                            <VehicleDetailWidget vehicle={vehicle} />
                        </div>
                    </div>
                </div>
                */}
            </div>
        </div>
    );
}
