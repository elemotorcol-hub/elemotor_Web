'use client';

import * as React from 'react';
import { TrimSelector } from '@/components/Catalog/TrimSelector';
import { VehicleHero } from '@/components/Catalog/VehicleHero';
import { VehicleSpecs } from '@/components/Catalog/VehicleSpecs';
import { ColorSelector } from '@/components/Catalog/ColorSelector';
import { VehicleFeatures } from '@/components/Catalog/VehicleFeatures';
import type { DetailModel, DetailTrim } from '@/services/catalogModels.service';

interface VehicleDetailClientProps {
    model: DetailModel;
}

// Map exterior colors to ColorSelector shape
function toColorOptions(trim: DetailTrim) {
    const exteriorColors = trim.colors.filter((c) => c.type === 'exterior');
    const allColors = exteriorColors.length > 0 ? exteriorColors : trim.colors;
    return allColors.map((c) => ({ name: c.name, hex: `#${c.hexCode}` }));
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

    const colorOptions = React.useMemo(() => toColorOptions(activeTrim), [activeTrim]);
    const features = React.useMemo(() => toFeatures(activeTrim), [activeTrim]);

    return (
        <>
            {/* Hero with gallery — key resets internal image state on trim change */}
            <VehicleHero
                key={activeTrim.id}
                model={model}
                activeTrim={activeTrim}
            />

            <div className="container mx-auto px-6 max-w-5xl flex flex-col gap-16 md:gap-24 pt-12 md:pt-16 mb-16">

                {/* Trim selector — only if multiple trims */}
                {model.trims.length > 1 && (
                    <TrimSelector
                        trims={model.trims}
                        selectedTrimId={activeTrim.id}
                        onTrimChange={setActiveTrim}
                    />
                )}

                <VehicleSpecs
                    spec={activeTrim.spec}
                    trimName={model.trims.length > 1 ? activeTrim.name : undefined}
                />

                <hr className="border-white/5 w-full max-w-lg mx-auto" />

                {colorOptions.length > 0 && (
                    <ColorSelector colors={colorOptions} />
                )}

                <VehicleFeatures features={features} />
            </div>
        </>
    );
}
