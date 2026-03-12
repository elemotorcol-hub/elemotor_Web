import { Navbar } from '@/components/Navbar';
import { WorkshopsMap } from '@/components/talleres/WorkshopsMap';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Talleres Aliados | EleMotor',
    description: 'Encuentra la red de servicio técnico certificado y estaciones de carga de Elemotor más cercana a ti.',
};

export default function TalleresPage() {
    return (
        <main className="h-screen bg-[#111618] overflow-hidden flex flex-col">
            <Navbar />
            <WorkshopsMap />
        </main>
    );
}
