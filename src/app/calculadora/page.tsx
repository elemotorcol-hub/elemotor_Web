import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SavingsCalculator } from '@/components/calculator/SavingsCalculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Calculadora de Ahorro | EleMotor',
    description: 'Descubre cuánto puedes ahorrar al cambiarte a la movilidad eléctrica comparando tu vehículo actual de gasolina con un Elemotor.',
};

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
