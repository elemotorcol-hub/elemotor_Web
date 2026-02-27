/**
 * @file robots.ts
 * @description Genera el archivo robots.txt del sitio.
 * Next.js lo expone en /robots.txt en build y en dev.
 *
 * Política: permitir rastreo completo de páginas públicas.
 * Bloquear rutas internas, de autenticación y de administración.
 */

import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',      // Endpoints de API interna
          '/_next/',    // Archivos de build de Next.js
          '/admin/',    // Área de administración (si se implementa)
          '/auth/',     // Rutas de autenticación (si se implementa)
        ],
      },
    ],
    // Referencia al sitemap para que los crawlers lo encuentren automáticamente
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
