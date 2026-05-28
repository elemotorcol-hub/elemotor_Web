'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { QuoteForm } from './QuoteForm';
import { VehicleSummary } from './VehicleSummary';
import { VehicleModel } from '@/types/inventory';

interface Advisor {
    id: number;
    name: string;
}

interface Props {
    models: VehicleModel[];
    advisors: Advisor[];
}

export default function QuoteRequestView({ models, advisors }: Props) {
    const searchParams = useSearchParams();
    const modeloParam = searchParams.get('modelo');
    const initialColor = searchParams.get('color') ?? undefined;

    const initialVehicle = modeloParam
        ? models.find(v => String(v.id) === String(modeloParam)) ?? models[0]
        : models[0];

    const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | undefined>(initialVehicle);

    useEffect(() => {
        if (models.length > 0 && !selectedVehicle) {
            setSelectedVehicle(models[0]);
        }
    }, [models, selectedVehicle]);

    const handleModelChange = (modelId: string) => {
        // Usar == para permitir comparación entre string y number si fuera el caso
        const vehicle = models.find(v => String(v.id) === String(modelId));
        if (vehicle) {
            setSelectedVehicle(vehicle);
        }
    };

    return (
        <section id="cotizar" className="bg-[#0A110F] py-24 relative overflow-hidden flex items-center border-t border-white/5">
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00D4AA]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 py-4 xl:gap-12 items-stretch">
                    <QuoteForm
                        vehicles={models}
                        advisors={advisors}
                        initialModelId={initialVehicle ? String(initialVehicle.id) : ''}
                        initialColor={initialColor}
                        onModelChange={handleModelChange}
                    />

                    {/* Contenedor derecho para la previsualización */}
                    <div className="hidden lg:block h-full">
                        <VehicleSummary vehicle={selectedVehicle} />
                    </div>
                    {/* Versión mobile: se apila abajo */}
                    <div className="lg:hidden mt-4">
                        <VehicleSummary vehicle={selectedVehicle} />
                    </div>
                </div>
            </div>
        </section>
    );
}
