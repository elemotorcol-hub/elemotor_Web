/**
 * @file seo.ts
 * @description Configuración centralizada de SEO para EleMotor.
 * Modificar este archivo para actualizar datos del sitio en todos los módulos SEO.
 */

export const siteConfig = {
  /** URL base de producción (sin trailing slash) */
  url: 'https://www.elemotor.co',

  /** Nombre de la marca */
  name: 'EleMotor',

  /** Separador usado en los <title> de cada página */
  titleSeparator: '|',

  /** Descripción por defecto del sitio */
  defaultDescription:
    'Traemos a Colombia la vanguardia de la movilidad global. Importación exclusiva de Tesla, Lucid, Porsche y los mejores vehículos eléctricos del mundo.',

  /** Locale principal para Open Graph */
  locale: 'es_CO',

  /** Handle de Twitter / X sin "@"  */
  twitterHandle: '@elemotor_co',

  /** Ruta al logo público (usado en JSON-LD) */
  logoPath: '/logo-elemotor.svg',

  /** Ruta a imagen OG por defecto (usada si la página no define una propia) */
  defaultOgImage: '/og-default.png',

  /** Correo de contacto (usado en JSON-LD Organization) */
  contactEmail: 'info@elemotor.co',

  /** País de operación */
  addressCountry: 'CO',

  /** Ciudad principal */
  addressLocality: 'Medellín',
} as const;

export type SiteConfig = typeof siteConfig;
