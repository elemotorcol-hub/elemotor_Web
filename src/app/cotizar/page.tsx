import { Navbar } from '@/components/Navbar';
import QuoteRequestView from '@/components/quote/QuoteRequestView';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Solicita Tu Cotización - Elemotor',
    description: 'Solicita una cotización para tu vehículo eléctrico de Elemotor.'
};

export default function CotizarPage() {
    return (
        <div className="bg-slate-900 min-h-screen flex flex-col selection:bg-[#00D4AA] selection:text-slate-900">
            <header>
                <Navbar />
            </header>

            <main className="flex-1 pt-[80px]">
                {/* Adding padding top to account for fixed navbar if any, or just spacing */}
                <QuoteRequestView />
            </main>

            <Footer />
        </div>
    );
}
