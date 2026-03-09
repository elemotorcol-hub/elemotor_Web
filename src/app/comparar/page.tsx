import { Navbar } from '@/components/Navbar';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const VehicleComparison = dynamic(() => import('@/components/VehicleComparison').then(mod => mod.VehicleComparison));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export const metadata: Metadata = {
    title: 'Compara Modelos | EleMotor',
    description: 'Compara especificaciones, rendimiento y precios de nuestros vehículos eléctricos premium.',
};

export default function CompararPage() {
    return (
        <div className="bg-[#0a111a] selection:bg-[#00D4AA] selection:text-[#0a111a] overflow-x-hidden min-h-screen flex flex-col">
            <header>
                {/* Usamos un div oscuro detrás del navbar para que no se mezcle con el contenido si el usuario no ha hecho scroll */}
                <div className="bg-[#0A0F1C] h-[104px] w-full absolute top-0 left-0 z-40 border-b border-white/5" />
                <Navbar />
            </header>

            <main className="flex-1 relative z-10 pt-10">
                {/* El componente VehicleComparison ya tiene su propio padding y diseño */}
                <VehicleComparison />
            </main>

            <Footer />
        </div>
    );
}
