import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/seo';
import { modelService } from '@/services/model.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/modelos`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/nosotros`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/showroom`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/cotizar`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/calculadora`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/comparar`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/talleres`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Dynamic routes from real API slugs
  let dynamicModelRoutes: MetadataRoute.Sitemap = [];
  try {
    const response = await modelService.getModels({ active: true, limit: 200 });
    const models = response.data ?? [];
    dynamicModelRoutes = models.map((m: { slug: string; updatedAt?: string }) => ({
      url: `${baseUrl}/modelos/${m.slug}`,
      lastModified: m.updatedAt ? new Date(m.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // If API is unreachable during build, skip dynamic routes
  }

  return [...staticRoutes, ...dynamicModelRoutes];
}
