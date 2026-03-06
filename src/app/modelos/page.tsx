import * as React from 'react';
import { Navbar } from '@/components/Navbar';
import { CatalogHeader } from '@/components/Catalog/CatalogHeader';
import { CatalogGrid } from '@/components/Catalog/CatalogGrid';
import { Footer } from '@/components/Footer';
import { buildMetadata } from '@/lib/metadata';

// Este archivo es puramente un Server Component.
// No tiene 'use client'. Todo su contenido HTML estático se genera en build.
// Todo el javascript interactivo queda recluido dentro de <CatalogGrid />

export const metadata = buildMetadata({
    title: 'Catálogo de Modelos',
    description:
        'Explora nuestra gama de vehículos premium 100% eléctricos. SUVs, sedanes y hatchbacks de las marcas más innovadoras del mundo, disponibles en Colombia.',
    path: '/modelos',
    keywords: ['catálogo eléctricos', 'BYD Colombia', 'SUV eléctrico', 'sedán eléctrico'],
});


export default function ModelosPage() {
    return (
        <main className="min-h-screen bg-[#0A0F1C] overflow-x-hidden">
            <header>
                <Navbar />
            </header>
            <CatalogHeader />
            <CatalogGrid />
            <Footer />
        </main>
    );
}
