import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
    Battery, Zap, Gauge, Clock, CheckCircle2, User, MapPin,
    Calendar, CreditCard, MessageSquare, Phone, Tag, Layers,
    ChevronRight, AlertCircle,
} from 'lucide-react';
import { PrintButton } from './PrintButton';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    pending:     { label: 'Pendiente',       color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
    contacted:   { label: 'Contactado',      color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
    responded:   { label: 'Respondido',      color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200' },
    negotiation: { label: 'En Negociación',  color: 'text-violet-700',  bg: 'bg-violet-50 border-violet-200' },
    closed_won:  { label: 'Aprobada',        color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    closed_lost: { label: 'Cerrada',         color: 'text-slate-600',   bg: 'bg-slate-100 border-slate-300' },
};

const PAYMENT_LABELS: Record<string, string> = {
    cash:        'Contado',
    financing:   'Financiamiento',
    leasing:     'Leasing',
    trade_in:    'Con entrega de vehículo',
};

const CHANNEL_LABELS: Record<string, string> = {
    whatsapp:    'WhatsApp',
    email:       'Correo electrónico',
    phone:       'Llamada telefónica',
    presential:  'Visita presencial',
};

async function getQuote(referenceCode: string) {
    try {
        const res = await fetch(`${API_BASE}/api/quotes/public/${referenceCode}`, {
            next: { revalidate: 60 },
        });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
    } catch {
        return null;
    }
}

interface Props {
    params: Promise<{ referenceCode: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { referenceCode } = await params;
    return {
        title: `Cotización ${referenceCode} | Elemotor`,
        description: 'Documento de cotización de vehículo eléctrico Elemotor',
        robots: 'noindex',
    };
}

export default async function QuoteDocumentPage({ params }: Props) {
    const { referenceCode } = await params;
    const quote = await getQuote(referenceCode);
    if (!quote) notFound();

    const status = STATUS_LABELS[quote.status] ?? { label: quote.status, color: 'text-slate-600', bg: 'bg-slate-100 border-slate-200' };

    // Get vehicle image: prefer trim image, then model's first trim image
    const vehicleImage: string =
        quote.trim?.images?.[0]?.url ||
        quote.model?.trims?.[0]?.images?.[0]?.url ||
        '/placeholder-car.png';

    const spec = quote.trim?.spec;

    const formattedDate = new Date(quote.createdAt).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'long', year: 'numeric',
    });

    return (
        <div className="min-h-screen bg-slate-100 print:bg-white">
            {/* ── Header bar ── */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:static print:border-b-2 print:border-[#00D4AA]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo-dark.svg"
                            alt="Elemotor"
                            width={130}
                            height={36}
                            className="h-8 w-auto"
                            onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span className="hidden sm:block h-5 w-px bg-slate-200" />
                        <span className="hidden sm:block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            Documento de Cotización
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${status.bg} ${status.color}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {status.label}
                        </span>
                        <PrintButton />
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 print:py-4">

                {/* ── Reference + Date ── */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-0.5">Número de Cotización</p>
                        <h1 className="text-2xl font-black text-slate-900 font-mono tracking-tight">{quote.referenceCode}</h1>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formattedDate}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

                    {/* ── LEFT COLUMN ── */}
                    <div className="space-y-5">

                        {/* Vehicle card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                                <Image
                                    src={vehicleImage}
                                    alt={quote.model?.name ?? 'Vehículo'}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                {quote.model?.brand && (
                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        {quote.model.brand.logoUrl && (
                                            <Image
                                                src={quote.model.brand.logoUrl}
                                                alt={quote.model.brand.name}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 object-contain bg-white/90 rounded-lg p-1"
                                            />
                                        )}
                                        <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                                            {quote.model.brand.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                            {quote.model?.name ?? 'Vehículo'}
                                        </h2>
                                        {quote.trim && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <Layers className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-sm font-semibold text-[#00B38F]">{quote.trim.name}</span>
                                                {quote.trim.status && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                                                        {quote.trim.status === 'stock' ? 'En Stock' : quote.trim.status === 'transit' ? 'En Tránsito' : 'Por Pedido'}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {quote.model?.year && (
                                            <p className="text-xs text-slate-400 mt-1 font-medium">{quote.model.year} · {quote.model.type?.toUpperCase()}</p>
                                        )}
                                    </div>
                                    {quote.color && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                            <Tag className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="font-medium">{quote.color}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Specs grid */}
                                {spec && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {spec.rangeWltpKm && (
                                            <SpecCard
                                                icon={<Zap className="w-4 h-4 text-[#00B38F]" />}
                                                label="Autonomía WLTP"
                                                value={`${spec.rangeWltpKm} km`}
                                            />
                                        )}
                                        {!spec.rangeWltpKm && spec.rangeCltcKm && (
                                            <SpecCard
                                                icon={<Zap className="w-4 h-4 text-[#00B38F]" />}
                                                label="Autonomía CLTC"
                                                value={`${spec.rangeCltcKm} km`}
                                            />
                                        )}
                                        {spec.batteryKwh && (
                                            <SpecCard
                                                icon={<Battery className="w-4 h-4 text-[#00B38F]" />}
                                                label="Batería"
                                                value={`${spec.batteryKwh} kWh`}
                                            />
                                        )}
                                        {spec.zeroTo100 && (
                                            <SpecCard
                                                icon={<Gauge className="w-4 h-4 text-[#00B38F]" />}
                                                label="0 – 100 km/h"
                                                value={`${spec.zeroTo100}s`}
                                            />
                                        )}
                                        {spec.chargeTime3080 && (
                                            <SpecCard
                                                icon={<Clock className="w-4 h-4 text-[#00B38F]" />}
                                                label="Carga 30→80%"
                                                value={spec.chargeTime3080}
                                            />
                                        )}
                                        {spec.horsepower && (
                                            <SpecCard
                                                icon={<Zap className="w-4 h-4 text-[#00B38F]" />}
                                                label="Potencia"
                                                value={`${spec.horsepower} HP`}
                                            />
                                        )}
                                        {spec.topSpeed && (
                                            <SpecCard
                                                icon={<Gauge className="w-4 h-4 text-[#00B38F]" />}
                                                label="Vel. máxima"
                                                value={`${spec.topSpeed} km/h`}
                                            />
                                        )}
                                        {spec.trunkLiters && (
                                            <SpecCard
                                                icon={<CheckCircle2 className="w-4 h-4 text-[#00B38F]" />}
                                                label="Maletero"
                                                value={`${spec.trunkLiters} L`}
                                            />
                                        )}
                                        {spec.screenSize && (
                                            <SpecCard
                                                icon={<CheckCircle2 className="w-4 h-4 text-[#00B38F]" />}
                                                label="Pantalla"
                                                value={`${spec.screenSize}"`}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dimensions (if available) */}
                        {spec && (spec.lengthMm || spec.widthMm || spec.heightMm || spec.wheelbaseMm || spec.curbWeightKg) && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Dimensiones</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                                    {spec.lengthMm && <DimCell label="Largo" value={`${(spec.lengthMm / 1000).toFixed(2)} m`} />}
                                    {spec.widthMm && <DimCell label="Ancho" value={`${(spec.widthMm / 1000).toFixed(2)} m`} />}
                                    {spec.heightMm && <DimCell label="Alto" value={`${(spec.heightMm / 1000).toFixed(2)} m`} />}
                                    {spec.wheelbaseMm && <DimCell label="Batalla" value={`${(spec.wheelbaseMm / 1000).toFixed(2)} m`} />}
                                    {spec.curbWeightKg && <DimCell label="Peso" value={`${spec.curbWeightKg} kg`} />}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {quote.model?.description && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Descripción</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{quote.model.description}</p>
                            </div>
                        )}

                        {/* Client message */}
                        {quote.message && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <MessageSquare className="w-4 h-4 text-slate-400" />
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Mensaje del Cliente</h3>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed italic">&ldquo;{quote.message}&rdquo;</p>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div className="space-y-5">

                        {/* Client info */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Datos del Interesado</h3>
                            <div className="space-y-3">
                                <InfoRow icon={<User className="w-4 h-4" />} label="Nombre" value={quote.name} />
                                {quote.city && (
                                    <InfoRow icon={<MapPin className="w-4 h-4" />} label="Ciudad" value={quote.city} />
                                )}
                                {quote.preferredChannel && (
                                    <InfoRow
                                        icon={<Phone className="w-4 h-4" />}
                                        label="Canal preferido"
                                        value={CHANNEL_LABELS[quote.preferredChannel] ?? quote.preferredChannel}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Quote details */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Detalle de Cotización</h3>
                            <div className="space-y-3">
                                {quote.budgetRange && (
                                    <InfoRow
                                        icon={<CreditCard className="w-4 h-4" />}
                                        label="Presupuesto"
                                        value={quote.budgetRange}
                                    />
                                )}
                                {quote.paymentMethod && (
                                    <InfoRow
                                        icon={<CreditCard className="w-4 h-4" />}
                                        label="Forma de pago"
                                        value={PAYMENT_LABELS[quote.paymentMethod] ?? quote.paymentMethod}
                                    />
                                )}
                                {quote.color && (
                                    <InfoRow
                                        icon={<Tag className="w-4 h-4" />}
                                        label="Color de interés"
                                        value={quote.color}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Advisor */}
                        {quote.assignedTo && (
                            <div className="bg-[#00D4AA]/5 rounded-2xl border border-[#00D4AA]/20 p-5">
                                <h3 className="text-xs font-black text-[#00957A] uppercase tracking-widest mb-3">Tu Asesor</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#00D4AA]/20 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-[#00957A]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{quote.assignedTo.name}</p>
                                        <p className="text-xs text-slate-500">Asesor Comercial</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* What's next */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Próximos Pasos</h3>
                            <ol className="space-y-3">
                                {[
                                    'Un asesor se pondrá en contacto contigo',
                                    'Agendaremos una cita de prueba de manejo',
                                    'Te presentamos opciones de financiamiento',
                                    'Formalizamos tu pedido',
                                ].map((step, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                                        <span className="w-5 h-5 rounded-full bg-[#00D4AA]/15 text-[#00957A] text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {i + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
                            <div className="flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    Esta cotización tiene vigencia de 15 días hábiles. Los precios, especificaciones y disponibilidad pueden variar. No constituye una oferta comercial definitiva.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <footer className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo-dark.svg"
                            alt="Elemotor"
                            width={100}
                            height={28}
                            className="h-6 w-auto opacity-40"
                            onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span className="text-xs text-slate-400">elemotor.com.co</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-400 font-mono">{quote.referenceCode}</span>
                        <PrintButton />
                    </div>
                </footer>
            </main>
        </div>
    );
}

// ── Subcomponents ──────────────────────────────────────────────────────────────

function SpecCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex flex-col items-center text-center bg-slate-50 border border-slate-100 rounded-xl p-3 gap-1.5">
            {icon}
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-tight">{label}</span>
            <span className="text-sm font-bold text-slate-900">{value}</span>
        </div>
    );
}

function DimCell({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col items-center text-center py-2 px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{label}</span>
            <span className="text-sm font-bold text-slate-800">{value}</span>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 text-slate-400 flex-shrink-0">
                {icon}
                <span className="text-xs font-semibold text-slate-400">{label}</span>
            </div>
            <span className="font-semibold text-slate-800 text-right">{value}</span>
        </div>
    );
}
