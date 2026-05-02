import { Navbar } from '@/components/Navbar';
import { WorkshopsMap } from '@/components/talleres/WorkshopsMap';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
    title: 'Talleres Aliados y Red de Servicio',
    description: 'Encuentra la red de servicio técnico certificado y estaciones de carga de EleMotor más cercana a ti en Colombia.',
    path: '/talleres',
    keywords: ['taller vehículo eléctrico Colombia', 'servicio técnico eléctrico', 'carga eléctrica Colombia'],
});

export default function TalleresPage() {
    return (
        <main className="h-screen bg-[#111618] overflow-hidden flex flex-col">
            <Navbar />
            <WorkshopsMap />
        </main>
    );
}
