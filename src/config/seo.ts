/**
 * @file seo.ts
 * @description Configuración centralizada de SEO para EleMotor.
 * Controlada por variables de entorno para soportar múltiples dominios/países.
 *
 * Variables relevantes en .env:
 *   NEXT_PUBLIC_SITE_URL        → URL base (ej: https://elemotor.com.co)
 *   NEXT_PUBLIC_SITE_COUNTRY    → Código de país ISO (ej: CO o EC)
 *   NEXT_PUBLIC_SITE_CITY       → Ciudad principal (ej: Medellín o Quito)
 *   NEXT_PUBLIC_SITE_LOCALE     → Locale OG (ej: es_CO o es_EC)
 *   NEXT_PUBLIC_TWITTER_HANDLE  → Handle de Twitter sin @ (ej: elemotor_co)
 *   NEXT_PUBLIC_CONTACT_EMAIL   → Email de contacto
 */

const country = process.env.NEXT_PUBLIC_SITE_COUNTRY ?? 'CO';

const defaults: Record<string, { url: string; description: string; locale: string; twitter: string; email: string; city: string }> = {
  CO: {
    url: 'https://elemotor.com.co',
    description: 'Traemos a Colombia la vanguardia de la movilidad global. Importación exclusiva de Tesla, Lucid, Porsche y los mejores vehículos eléctricos del mundo.',
    locale: 'es_CO',
    twitter: 'elemotor_co',
    email: 'info@elemotor.co',
    city: 'Medellín',
  },
  EC: {
    url: 'https://elemotor.com.ec',
    description: 'Traemos a Ecuador la vanguardia de la movilidad global. Importación exclusiva de Tesla, Lucid, Porsche y los mejores vehículos eléctricos del mundo.',
    locale: 'es_EC',
    twitter: 'elemotor_ec',
    email: 'info@elemotor.com.ec',
    city: 'Quito',
  },
};

const d = defaults[country] ?? defaults.CO;

export const siteConfig = {
  /** URL base de producción (sin trailing slash) */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? d.url,

  /** Nombre de la marca */
  name: 'EleMotor',

  /** Separador usado en los <title> de cada página */
  titleSeparator: '|',

  /** Descripción por defecto del sitio */
  defaultDescription: d.description,

  /** Locale principal para Open Graph */
  locale: process.env.NEXT_PUBLIC_SITE_LOCALE ?? d.locale,

  /** Handle de Twitter / X sin "@"  */
  twitterHandle: `@${process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? d.twitter}`,

  /** Ruta al logo público (usado en JSON-LD) */
  logoPath: '/logo-elemotor.svg',

  /** Ruta a imagen OG por defecto (usada si la página no define una propia) */
  defaultOgImage: '/hero-bg.webp',

  /** Correo de contacto (usado en JSON-LD Organization) */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? d.email,

  /** País de operación */
  addressCountry: country,

  /** Ciudad principal */
  addressLocality: process.env.NEXT_PUBLIC_SITE_CITY ?? d.city,
};

export type SiteConfig = typeof siteConfig;
