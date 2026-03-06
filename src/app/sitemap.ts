/**
 * @file sitemap.ts
 * @description Genera automáticamente el sitemap.xml del sitio.
 * Next.js lo expone en /sitemap.xml en build y en dev.
 *
 * Para agregar nuevas secciones: añadir rutas estáticas en `staticRoutes`
 * o registrar una nueva fuente de datos dinámica similar a `vehiclesData`.
 */

import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/seo';
import { vehiclesData } from '@/data/models';

/** Rutas estáticas públicas del sitio con sus metadatos de rastreo */
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: siteConfig.url,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  },
  {
    url: `${siteConfig.url}/modelos`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${siteConfig.url}/nosotros`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
];

/** Rutas dinámicas generadas desde el inventario de vehículos */
const vehicleRoutes: MetadataRoute.Sitemap = vehiclesData.map((vehicle) => ({
  url: `${siteConfig.url}/modelos/${vehicle.id}`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.8,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticRoutes, ...vehicleRoutes];
}
