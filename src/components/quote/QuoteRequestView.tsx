'use client';

import { useState } from 'react';
import { QuoteForm } from './QuoteForm';
import { VehicleSummary } from './VehicleSummary';
import { MOCK_VEHICLES, VehicleInfo } from '@/mocks/vehiclesData';

export default function QuoteRequestView() {
    // Inicializar el modelo seleccionado basado en el primer vehículo del mock
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleInfo | undefined>(MOCK_VEHICLES[0]);

    const handleModelChange = (modelId: string) => {
        const vehicle = MOCK_VEHICLES.find(v => v.id === modelId);
        if (vehicle) {
            setSelectedVehicle(vehicle);
        }
    };

    return (
        <section id="cotizar" className="bg-[#0A110F] py-24 relative overflow-hidden flex items-center border-t border-white/5">
            {/* Opcional: algún elemento de fondo estilo glow */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00D4AA]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 py-4 xl:gap-12 items-stretch">
                    <QuoteForm vehicles={MOCK_VEHICLES} onModelChange={handleModelChange} />

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
