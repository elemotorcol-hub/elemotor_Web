'use client';

import * as React from 'react';
import { TrimSelector } from '@/components/Catalog/TrimSelector';
import { VehicleHero } from '@/components/Catalog/VehicleHero';
import { VehicleSpecs } from '@/components/Catalog/VehicleSpecs';
import { VehicleFeatures } from '@/components/Catalog/VehicleFeatures';
import { VehiclePhotoGallery } from '@/components/Catalog/VehiclePhotoGallery';
import type { DetailModel, DetailTrim } from '@/services/catalogModels.service';

interface VehicleDetailClientProps {
    model: DetailModel;
}

// Derive feature cards from spec fields that contain meaningful info
function toFeatures(trim: DetailTrim) {
    const spec = trim.spec;
    const features: { title: string; desc: string }[] = [];

    if (spec?.adasLevel != null) {
        features.push({
            title: `ADAS Nivel ${spec.adasLevel}`,
            desc: 'Asistencia de conducción autónoma inteligente con sensores de imagen, radar y seguridad activa en todas las vías.',
        });
    }
    if (spec?.screenSize != null) {
        features.push({
            title: `Pantalla ${spec.screenSize}"`,
            desc: 'Centro de info-entretenimiento de alto rendimiento with connectividad global y actualizaciones OTA.',
        });
    }
    if (spec?.batteryKwh != null) {
        const kw = parseFloat(spec.batteryKwh).toFixed(1);
        features.push({
            title: `Batería ${kw} kWh`,
            desc: `Paquete de baterías de alta densidad energética que otorgan hasta ${spec.rangeCltcKm ?? spec.rangeWltpKm ?? '—'} km de autonomía real.`,
        });
    }
    if (spec?.chargeTime3080) {
        features.push({
            title: `Carga rápida`,
            desc: `Recarga del 30% al 80% en solo ${spec.chargeTime3080}. Compatible con cargadores AC y DC de alta potencia.`,
        });
    }

    // Fallback: provide at least one if no spec data
    if (features.length === 0) {
        features.push({
            title: 'Vehículo 100% eléctrico',
            desc: 'Tecnología eléctrica de vanguardia con cero emisiones. Desempeño superior y sostenibilidad en cada kilómetro.',
        });
    }

    return features;
}

export function VehicleDetailClient({ model }: VehicleDetailClientProps) {
    const [activeTrim, setActiveTrim] = React.useState<DetailTrim>(model.trims[0]);

    const features = React.useMemo(() => toFeatures(activeTrim), [activeTrim]);

    return (
        <>
            {/* Hero with gallery — key resets internal image state on trim change */}
            <VehicleHero
                key={activeTrim.id}
                model={model}
                activeTrim={activeTrim}
            />

            {/* Trim selector — contained */}
            {model.trims.length > 1 && (
                <div className="container mx-auto px-6 max-w-5xl pt-12">
                    <TrimSelector
                        trims={model.trims}
                        selectedTrimId={activeTrim.id}
                        onTrimChange={setActiveTrim}
                    />
                </div>
            )}

            {/* Specs — full width section */}
            <VehicleSpecs
                spec={activeTrim.spec}
                trimName={model.trims.length > 1 ? activeTrim.name : undefined}
            />

            {/* Features */}
            <div className="container mx-auto px-6 max-w-7xl">
                <VehicleFeatures features={features} />
            </div>

            {/* Gallery & Video — full width sections */}
            <VehiclePhotoGallery
                images={activeTrim.images}
                modelName={`${model.brand.name} ${model.name}`}
                videoUrl={model.videoUrl ?? undefined}
            />
        </>
    );
}
