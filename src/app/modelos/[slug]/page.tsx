import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { vehiclesData } from '@/data/models';
import { VehicleHero } from '@/components/Catalog/VehicleHero';
import { VehicleSpecs } from '@/components/Catalog/VehicleSpecs';
import { VehicleFeatures } from '@/components/Catalog/VehicleFeatures';
import { VehicleDetailedSpecs } from '@/components/Catalog/VehicleDetailedSpecs';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SchemaScript } from '@/components/SchemaScript';
import { buildMetadata } from '@/lib/metadata';
import { getVehicleSchema } from '@/lib/schema';
import { siteConfig } from '@/config/seo';

// SSG estricto: forzar comportamiento de "falla si la ruta no existe previamente generada" (DynamicParams)
// O puede dejarse true si se quieren agregar autos en Runtime usando revalidate
export const dynamicParams = true;

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// 1. generateStaticParams: Compila (Build Time) todas las rutas HTML en base al inventario para rating 100
export async function generateStaticParams() {
    return vehiclesData.map((vehicle) => ({
        slug: vehicle.id,
    }));
}

// 2. generateMetadata: Dynamic SEO Automático para Redes Sociales
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const vehicle = vehiclesData.find((v) => v.id === resolvedParams.slug);

    if (!vehicle) {
        return buildMetadata({
            title: 'Vehículo no encontrado',
            description: 'El vehículo solicitado no existe en nuestro catálogo.',
            path: '/modelos',
        });
    }

    // La imagen puede ser una ruta relativa o una URL absoluta
    const resolvedOgImage = vehicle.image.startsWith('http')
        ? vehicle.image
        : `${siteConfig.url}${vehicle.image}`;

    return buildMetadata({
        title: `${vehicle.brand} ${vehicle.model} – Especificaciones y Precio`,
        description: `Descubre todo sobre el ${vehicle.brand} ${vehicle.model}. `
            + `Autonomía de ${vehicle.range} km, aceleración de 0 a 100 en ${vehicle.acceleration}s. `
            + `Especialistas en movilidad eléctrica de lujo en Colombia.`,
        path: `/modelos/${vehicle.id}`,
        ogImageUrl: resolvedOgImage,
        ogImageAlt: `Fotografía oficial del ${vehicle.brand} ${vehicle.model}`,
        keywords: [
            vehicle.brand,
            vehicle.model,
            `${vehicle.brand} Colombia`,
            `${vehicle.category} eléctrico`,
        ],
    });
}

// 3. Server Component Principal
export default async function VehicleDetailsPage({ params }: PageProps) {
    const resolvedParams = await params;
    const vehicle = vehiclesData.find((v) => v.id === resolvedParams.slug);

    // Early return defensivo y limpieza UX si no existe
    if (!vehicle) {
        notFound();
    }

    // Datos simulados (mockups) para los módulos de características adicionales
    // idealmente cargados desde un CMS o models.ts en el futuro
    const defaultFeatures = [
        { title: 'Pantalla 15.6" Rotatoria', desc: 'Centro de info-entretenimiento de alto rendimiento y conectividad global.' },
        { title: 'ADAS Level 2', desc: 'Asistencia de conducción autónoma inteligente, sensores y seguridad activa en toda vía.' },
        { title: 'Techo Panorámico', desc: 'Sky-view resistente con protección solar UV, ofreciendo máxima amplitud en cabina.' },
    ];

    return (
        <div className="bg-slate-900 selection:bg-[#00D4AA] selection:text-slate-900 overflow-x-hidden min-h-screen flex flex-col">
            {/* Schema de Producto específico para este vehículo */}
            <SchemaScript
                schema={getVehicleSchema(vehicle)}
                id={`schema-vehicle-${vehicle.id}`}
            />

            <header>
                <Navbar />
            </header>

            <main className="grow pt-20">
                {/* SSR + SSG Puros: LCP Optimizado en la Hero Image principal y Tipografías */}
                <VehicleHero vehicle={vehicle} />

                <div className="container mx-auto px-6 max-w-5xl flex flex-col gap-16 md:gap-24 mb-16">
                    <VehicleSpecs vehicle={vehicle} />

                    <hr className="border-white/5 w-full max-w-lg mx-auto" />

                    <VehicleFeatures features={defaultFeatures} />

                    <hr className="border-white/5 w-full max-w-lg mx-auto" />

                    <VehicleDetailedSpecs vehicle={vehicle} />
                </div>
            </main>

            <Footer />
        </div>
    );
}

