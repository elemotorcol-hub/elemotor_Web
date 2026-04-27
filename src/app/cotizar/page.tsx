import { Navbar } from '@/components/Navbar';
import QuoteRequestView from '@/components/quote/QuoteRequestView';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import { modelService } from '@/services/model.service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Solicita Tu Cotización - Elemotor',
    description: 'Solicita una cotización para tu vehículo eléctrico de Elemotor.'
};

export default async function CotizarPage() {
    let models = [];
    try {
        const response = await modelService.getModels({ active: true });
        models = response.data || [];
    } catch (error) {
        console.error('Error fetching models for quote page:', error);
    }

    return (
        <div className="bg-slate-900 min-h-screen flex flex-col selection:bg-[#00D4AA] selection:text-slate-900">
            <header>
                <Navbar />
            </header>

            <main className="flex-1 pt-[80px]">
                <QuoteRequestView models={models} />
            </main>

            <Footer />
        </div>
    );
}
