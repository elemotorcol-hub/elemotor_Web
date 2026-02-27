import * as React from 'react';
import { Navbar } from '@/components/Navbar';
import { CatalogHeader } from '@/components/Catalog/CatalogHeader';
import { CatalogGrid } from '@/components/Catalog/CatalogGrid';
import { Footer } from '@/components/Footer';

// Este archivo es puramente un Server Component.
// No tiene 'use client'. Todo su contenido HTML estático se genera en build.
// Todo el javascript interactivo queda recluido dentro de <CatalogGrid />

export const metadata = {
    title: 'Catálogo de Modelos | EleMotor',
    description: 'Explora nuestra gama de vehículos premium 100% eléctricos.',
};

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
