/**
 * @file schema.ts
 * @description Funciones para generar datos estructurados JSON-LD (schema.org).
 * Se usan en el componente <SchemaScript> para inyectarlos en el <head>.
 */

import { siteConfig } from '@/config/seo';
import type { Vehicle } from '@/data/models';

// ─── Organization ────────────────────────────────────────────────────────────

/**
 * Schema de tipo `Organization` para EleMotor.
 * Representa la empresa ante los motores de búsqueda.
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}${siteConfig.logoPath}`,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.contactEmail,
      contactType: 'customer support',
      areaServed: siteConfig.addressCountry,
      availableLanguage: 'Spanish',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: siteConfig.addressCountry,
      addressLocality: siteConfig.addressLocality,
    },
    sameAs: [
      // Agregar perfiles sociales reales cuando estén disponibles
      // 'https://www.instagram.com/elemotor_co',
      // 'https://www.facebook.com/elemotor',
    ],
  };
}

// ─── WebSite ─────────────────────────────────────────────────────────────────

/**
 * Schema de tipo `WebSite` con acción de búsqueda.
 * Permite que Google muestre un cuadro de búsqueda en los resultados.
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/modelos?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ─── Product (Vehicle) ───────────────────────────────────────────────────────

/**
 * Schema de tipo `Product` para un vehículo del catálogo.
 * Incluye nombre, imagen, descripción y precio para Rich Results de Google Shopping.
 *
 * @param vehicle - Objeto `Vehicle` del catálogo
 */
export function getVehicleSchema(vehicle: Vehicle) {
  const vehicleUrl = `${siteConfig.url}/modelos/${vehicle.id}`;
  const imageUrl = vehicle.image.startsWith('http')
    ? vehicle.image
    : `${siteConfig.url}${vehicle.image}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${vehicle.brand} ${vehicle.model}`,
    description: `Vehículo 100% eléctrico ${vehicle.brand} ${vehicle.model}. `
      + `Autonomía: ${vehicle.range} km, aceleración 0-100 en ${vehicle.acceleration}s, `
      + `potencia: ${vehicle.power} Hp, batería: ${vehicle.battery} kWh.`,
    image: imageUrl,
    url: vehicleUrl,
    brand: {
      '@type': 'Brand',
      name: vehicle.brand,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: vehicle.price,
      availability:
        vehicle.stockStatus === 'EN STOCK'
          ? 'https://schema.org/InStock'
          : vehicle.stockStatus === 'PREVENTA'
            ? 'https://schema.org/PreOrder'
            : 'https://schema.org/BackOrder',
      seller: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
      },
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Autonomía', value: `${vehicle.range} km` },
      { '@type': 'PropertyValue', name: 'Aceleración 0-100', value: `${vehicle.acceleration}s` },
      { '@type': 'PropertyValue', name: 'Potencia', value: `${vehicle.power} Hp` },
      { '@type': 'PropertyValue', name: 'Batería', value: `${vehicle.battery} kWh` },
      { '@type': 'PropertyValue', name: 'Velocidad máxima', value: `${vehicle.topSpeed} km/h` },
      { '@type': 'PropertyValue', name: 'Categoría', value: vehicle.category },
    ],
  };
}
