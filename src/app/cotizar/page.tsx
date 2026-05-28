import { Navbar } from '@/components/Navbar';
import QuoteRequestView from '@/components/quote/QuoteRequestView';
import { Footer } from '@/components/Footer';
import { modelService } from '@/services/model.service';
import { fetchApi } from '@/lib/api';
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
    let advisors: { id: number; name: string }[] = [];

    try {
        const [modelsRes, advisorsRes] = await Promise.all([
            modelService.getModels({ active: true, limit: 100 }),
            fetchApi('/api/users/advisors', { method: 'GET' }),
        ]);
        models = modelsRes.data || [];
        advisors = Array.isArray(advisorsRes) ? advisorsRes : [];
    } catch (error) {
        console.error('Error fetching quote page data:', error);
    }

    return (
        <div className="bg-slate-900 min-h-screen flex flex-col selection:bg-[#00D4AA] selection:text-slate-900">
            <header>
                <Navbar />
            </header>

            <main className="flex-1 pt-[80px]">
                <QuoteRequestView models={models} advisors={advisors} />
            </main>

            <Footer />
        </div>
    );
}
