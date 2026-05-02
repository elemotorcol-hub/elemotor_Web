import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
    title: 'Showroom 3D Virtual',
    description: 'Explora y configura tu vehículo eléctrico en nuestro showroom 3D interactivo. Elige versión, color exterior e interior y cotiza al instante.',
    path: '/showroom',
    keywords: ['showroom 3D vehículo eléctrico', 'configurador eléctrico Colombia', 'visualizador 3D carro eléctrico'],
});

export default function ShowroomLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
