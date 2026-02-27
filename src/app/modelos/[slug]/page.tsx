import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { vehiclesData } from '@/data/models';
import { VehicleHero } from '@/components/Catalog/VehicleHero';
import { VehicleSpecs } from '@/components/Catalog/VehicleSpecs';
import { ColorSelector } from '@/components/Catalog/ColorSelector';
import { VehicleFeatures } from '@/components/Catalog/VehicleFeatures';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

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
        return {
            title: 'Vehículo no encontrado | EleMotor',
            description: 'El vehículo solicitado no existe en nuestro catálogo.',
        };
    }

    return {
        title: `${vehicle.brand} ${vehicle.model} - Especificaciones y Precio | EleMotor`,
        description: `Descubre todo sobre el ${vehicle.brand} ${vehicle.model}. Autonomía de ${vehicle.range}km, aceleración de 0 a 100 en ${vehicle.acceleration}s. Especialistas en movilidad eléctrica.`,
        openGraph: {
            title: `${vehicle.brand} ${vehicle.model} | EleMotor`,
            description: `Vehículo 100% eléctrico. Potencia: ${vehicle.power}Hp, Batería: ${vehicle.battery}kWh.`,
            images: [
                {
                    url: vehicle.image,
                    width: 1200,
                    height: 630,
                    alt: `Fotografía oficial frontal del ${vehicle.brand} ${vehicle.model}`,
                },
            ],
            locale: 'es_CO',
            type: 'website',
        },
    };
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
    const defaultColors = [
        { name: 'Meteor Gray', hex: '#4A5568' },
        { name: 'Comet White', hex: '#F7FAFC' },
        { name: 'Eclipse Black', hex: '#1A202C' }
    ];

    const defaultFeatures = [
        { title: 'Pantalla 15.6" Rotatoria', desc: 'Centro de info-entretenimiento de alto rendimiento y conectividad global.' },
        { title: 'ADAS Level 2', desc: 'Asistencia de conducción autónoma inteligente, sensores y seguridad activa en toda vía.' },
        { title: 'Techo Panorámico', desc: 'Sky-view resistente con protección solar UV, ofreciendo máxima amplitud en cabina.' }
    ];

    return (
        <div className="bg-slate-900 selection:bg-[#00D4AA] selection:text-slate-900 overflow-x-hidden min-h-screen flex flex-col">
            <header>
                <Navbar />
            </header>

            <main className="flex-grow pt-20">
                {/* SSR + SSG Puros: LCP Optimizado en la Hero Image principal y Tipografías */}
                <VehicleHero vehicle={vehicle} />

                <div className="container mx-auto px-6 max-w-5xl flex flex-col gap-16 md:gap-24 mb-16">
                    <VehicleSpecs vehicle={vehicle} />

                    <hr className="border-white/5 w-full max-w-lg mx-auto" />

                    {/* Single Responsibility Client Component Partial Hydration */}
                    <ColorSelector colors={defaultColors} />

                    <VehicleFeatures features={defaultFeatures} />
                </div>
            </main>

            <Footer />
        </div>
    );
}
