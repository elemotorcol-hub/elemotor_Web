import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SchemaScript } from '@/components/SchemaScript';
import { buildMetadata } from '@/lib/metadata';
import { siteConfig } from '@/config/seo';
import { fetchModelBySlug, fetchActiveCatalogModels } from '@/services/catalogModels.service';
import { VehicleDetailClient } from '@/components/Catalog/VehicleDetailClient';

// Allow Next.js to handle slugs added after build time via on-demand ISR
export const dynamicParams = true;

interface PageProps {
    params: Promise<{ slug: string }>;
}

// ── generateStaticParams ──────────────────────────────────────────────────────
// Pre-renders pages for all active models at build time (or first request with ISR)
export async function generateStaticParams() {
    try {
        const models = await fetchActiveCatalogModels();
        return models.map((m) => ({ slug: m.slug }));
    } catch {
        // If the API is unavailable at build time, skip pre-rendering gracefully
        return [];
    }
}

// ── generateMetadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const model = await fetchModelBySlug(slug);
        const firstTrim = model.trims[0];
        const firstImage = firstTrim?.images[0]?.url ?? null;

        const resolvedOgImage = firstImage
            ? firstImage
            : `${siteConfig.url}/og-default.jpg`;

        const range = firstTrim?.spec?.rangeCltcKm ?? firstTrim?.spec?.rangeWltpKm;
        const accel = firstTrim?.spec?.zeroTo100
            ? parseFloat(firstTrim.spec.zeroTo100).toFixed(1)
            : null;

        return buildMetadata({
            title: `${model.brand.name} ${model.name} ${model.year} – Especificaciones y Precio`,
            description:
                `Descubre el ${model.brand.name} ${model.name} ${model.year}. ` +
                (range ? `Autonomía de ${range} km. ` : '') +
                (accel ? `Aceleración 0-100 en ${accel}s. ` : '') +
                'Especialistas en movilidad eléctrica de lujo en Colombia.',
            path: `/modelos/${model.slug}`,
            ogImageUrl: resolvedOgImage,
            ogImageAlt: `Fotografía oficial del ${model.brand.name} ${model.name}`,
            keywords: [
                model.brand.name,
                model.name,
                `${model.brand.name} Colombia`,
                `${model.type} eléctrico`,
                `${model.name} ${model.year}`,
            ],
        });
    } catch {
        return buildMetadata({
            title: 'Vehículo no encontrado',
            description: 'El vehículo solicitado no existe en nuestro catálogo.',
            path: '/modelos',
        });
    }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function VehicleDetailsPage({ params }: PageProps) {
    const { slug } = await params;

    let model;
    try {
        model = await fetchModelBySlug(slug);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : '';
        if (message.startsWith('MODEL_NOT_FOUND')) {
            notFound();
        }
        throw error; // Unexpected error — let Next.js error boundary handle it
    }

    // Guard: model must have at least one active trim to render correctly
    if (!model.trims || model.trims.length === 0) {
        notFound();
    }

    const firstTrim = model.trims[0];
    const firstImage = firstTrim.images[0]?.url ?? null;

    // JSON-LD structured data for SEO
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${model.brand.name} ${model.name}`,
        description: model.description ??
            `Vehículo 100% eléctrico ${model.brand.name} ${model.name} ${model.year}.`,
        image: firstImage ?? `${siteConfig.url}/og-default.jpg`,
        url: `${siteConfig.url}/modelos/${model.slug}`,
        brand: { '@type': 'Brand', name: model.brand.name },
        offers: model.trims.map((trim) => ({
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: trim.price ? parseFloat(trim.price) : null,
            availability:
                trim.status === 'stock'
                    ? 'https://schema.org/InStock'
                    : trim.status === 'transit'
                        ? 'https://schema.org/PreOrder'
                        : 'https://schema.org/BackOrder',
            seller: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
        })),
    };

    return (
        <div className="bg-slate-900 selection:bg-[#00D4AA] selection:text-slate-900 overflow-x-hidden min-h-screen flex flex-col">
            <SchemaScript
                schema={productSchema}
                id={`schema-vehicle-${model.slug}`}
            />

            <header>
                <Navbar />
            </header>

            <main className="grow pt-20">
                {/*
                  VehicleDetailClient is a 'use client' component that owns the trim
                  selection state. It renders VehicleHero, TrimSelector, VehicleSpecs,
                  ColorSelector, and VehicleFeatures — all driven by the selected trim.
                  No additional API calls are made after this initial server-side fetch.
                */}
                <VehicleDetailClient model={model} />
            </main>

            <Footer />
        </div>
    );
}
