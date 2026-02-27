/**
 * @file metadata.ts
 * @description Helper functions para generar objetos `Metadata` de Next.js.
 * Centraliza Open Graph, Twitter Cards y canonical URLs.
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/config/seo';

/** Parámetros opcionales para sobreescribir la metadata base */
export interface PageMetadataInput {
  /** Título de la página (sin el sufijo de marca) */
  title: string;
  /** Descripción de la página */
  description?: string;
  /** Ruta de la página relativa a la URL base (ej: '/modelos') */
  path?: string;
  /** URL absoluta de la imagen para Open Graph (1200×630 px recomendado) */
  ogImageUrl?: string;
  /** Texto alternativo de la imagen OG */
  ogImageAlt?: string;
  /** Palabras clave adicionales para la página */
  keywords?: string[];
}

/**
 * Construye un objeto `Metadata` completo de Next.js para cualquier página.
 *
 * @example
 * export const metadata = buildMetadata({
 *   title: 'Catálogo de Modelos',
 *   description: 'Explora nuestra gama de vehículos eléctricos premium.',
 *   path: '/modelos',
 * });
 */
export function buildMetadata({
  title,
  description = siteConfig.defaultDescription,
  path = '/',
  ogImageUrl,
  ogImageAlt,
  keywords = [],
}: PageMetadataInput): Metadata {
  const canonicalUrl = `${siteConfig.url}${path}`;
  const resolvedOgImage = ogImageUrl ?? `${siteConfig.url}${siteConfig.defaultOgImage}`;
  const resolvedOgAlt = ogImageAlt ?? `${title} – ${siteConfig.name}`;
  const fullTitle = `${title} ${siteConfig.titleSeparator} ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,

    // Canonical URL explícita por página
    alternates: {
      canonical: canonicalUrl,
    },

    // Palabras clave base + específicas de la página
    keywords: [
      'vehículos eléctricos Colombia',
      'importación eléctricos lujo',
      'movilidad sostenible',
      'EleMotor',
      ...keywords,
    ],

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: resolvedOgAlt,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      images: [resolvedOgImage],
    },
  };
}
