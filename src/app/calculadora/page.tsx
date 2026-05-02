import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SavingsCalculator } from '@/components/calculator/SavingsCalculator';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
    title: 'Calculadora de Ahorro Eléctrico',
    description: 'Descubre cuánto puedes ahorrar al cambiarte a la movilidad eléctrica comparando tu vehículo actual de gasolina con un Elemotor.',
    path: '/calculadora',
    keywords: ['ahorro vehículo eléctrico', 'calculadora eléctrico vs gasolina', 'costo movilidad eléctrica Colombia'],
});

export default function CalculadoraPage() {
    return (
        <main className="min-h-screen bg-[#050B09] flex flex-col pt-[72px]">
            <Navbar />

            <div className="flex-grow flex flex-col items-center justify-center">
                <SavingsCalculator />
            </div>

            <Footer />
        </main>
    );
}
