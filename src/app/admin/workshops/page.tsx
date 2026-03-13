import React from 'react';
import { Wrench } from 'lucide-react';
import WorkshopsTable from '@/components/admin/workshops/WorkshopsTable';

export const metadata = {
    title: 'Talleres Aliados | Admin',
    description: 'Gestión de talleres aliados y centros de servicio',
};

export default function WorkshopsPage() {
    return (
        <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Wrench className="w-8 h-8 text-[#10B981]" />
                    Talleres Aliados
                </h1>
                <p className="text-slate-400 mt-1 pl-11">
                    Administra la red de talleres, ubicaciones, servicios y disponibilidad.
                </p>
            </div>

            {/* Main Content (Table & SlideOver container) */}
            <WorkshopsTable />
        </div>
    );
}
