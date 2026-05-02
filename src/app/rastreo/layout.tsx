import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
    title: 'Rastreo de Pedido',
    description: 'Consulta el estado de importación y entrega de tu vehículo eléctrico EleMotor en tiempo real con tu código de seguimiento.',
    path: '/rastreo',
    keywords: ['rastrear pedido vehículo eléctrico', 'estado importación carro eléctrico', 'seguimiento pedido EleMotor'],
});

export default function RastreoLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
