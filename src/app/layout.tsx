import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import { SchemaScript } from '@/components/SchemaScript';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/schema';
import { siteConfig } from '@/config/seo';
import { buildMetadata } from '@/lib/metadata';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * metadataBase es requerido por Next.js para resolver URLs relativas
 * en Open Graph, Twitter Cards y canonical links en todo el sitio.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata({
    title: 'Importación de Vehículos Eléctricos de Lujo',
    description: siteConfig.defaultDescription,
    path: '/',
    keywords: [
      'Tesla Colombia',
      'BYD Colombia',
      'carro eléctrico importado',
      'vehículo eléctrico lujo',
    ],
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Schemas globales: visibles en todas las páginas del sitio */}
        <SchemaScript schema={getOrganizationSchema()} id="schema-organization" />
        <SchemaScript schema={getWebSiteSchema()} id="schema-website" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  );
}
