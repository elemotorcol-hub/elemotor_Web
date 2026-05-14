import { Navbar } from '@/components/Navbar';
import QuoteRequestView from '@/components/quote/QuoteRequestView';
import { Footer } from '@/components/Footer';
import { modelService } from '@/services/model.service';
import { buildMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
    title: 'Solicita Tu Cotización',
    description: 'Solicita una cotización personalizada para tu vehículo eléctrico importado. Asesores especializados en movilidad eléctrica en Colombia.',
    path: '/cotizar',
    keywords: ['cotizar carro eléctrico Colombia', 'precio vehículo eléctrico importado', 'cotización EleMotor'],
});

export default async function CotizarPage() {
    let models = [];
    try {
        const response = await modelService.getModels({ active: true, limit: 100 });
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
