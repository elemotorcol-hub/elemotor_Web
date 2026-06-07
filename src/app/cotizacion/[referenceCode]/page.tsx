import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PrintButton } from './PrintButton';
import { ColorSelector } from './ColorSelector';
import { SpecsAccordion } from './SpecsAccordion';

const FONT  = "'Inter','Helvetica Neue',Arial,system-ui,sans-serif";
const G     = '#2F9461';   // Verde primario
const GD    = '#10592B';   // Verde oscuro (texto botones)
const GWA   = '#25D366';   // Verde WhatsApp
const RED   = '#D70C19';   // Rojo acento
const GRD   = '#4E5356';   // Gris oscuro
const GRM   = '#5C5C5C';   // Gris medio

const PAYMENT_LABELS: Record<string, string> = {
    cash: 'Contado', financing: 'Financiamiento',
    leasing: 'Leasing', trade_in: 'Con entrega de vehículo',
};

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getQuote(referenceCode: string) {
    try {
        const res = await fetch(`${API_BASE}/api/quotes/public/${referenceCode}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return await res.json();
    } catch { return null; }
}

interface Props { params: Promise<{ referenceCode: string }> }

export async function generateMetadata({ params }: Props) {
    const { referenceCode } = await params;
    return { title: `Cotización ${referenceCode} | Elemotor`, robots: 'noindex' };
}

export default async function QuoteDocumentPage({ params }: Props) {
    const { referenceCode } = await params;
    const quote = await getQuote(referenceCode);
    if (!quote) notFound();

    function getYouTubeEmbed(url: string): string | null {
        try {
            const u = new URL(url);
            let id: string | null = null;
            if (u.hostname.includes('youtube.com')) id = u.searchParams.get('v');
            else if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
            if (!id) return null;
            return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0&modestbranding=1`;
        } catch { return null; }
    }

    const trimData   = quote.trim ?? quote.model?.trims?.[0] ?? null;
    const spec       = trimData?.spec ?? null;
    const allImages: { url: string; type?: string }[] = trimData?.images ?? [];
    const exteriorImages = allImages.filter((img) => img.type === 'exterior');
    const interiorImages = allImages.filter((img) => img.type === 'interior');
    const galleryImages  = allImages.filter((img) => img.type === 'gallery' || img.type === 'hero');
    const images = exteriorImages.length > 0 ? exteriorImages : allImages.filter((img) => img.type !== 'interior');
    const colors: { name: string; hexCode: string; swatchUrl?: string }[] = trimData?.colors ?? [];
    const heroImage  = allImages[0]?.url ?? null;
    const rawVideoUrl: string | null = quote.model?.videoUrl ?? null;
    const videoEmbed: string | null  = rawVideoUrl ? getYouTubeEmbed(rawVideoUrl) ?? rawVideoUrl : null;
    const isYouTube  = !!rawVideoUrl && (rawVideoUrl.includes('youtube.com') || rawVideoUrl.includes('youtu.be'));

    const clientName = quote.name  || 'Cliente';
    const firstName  = clientName.split(' ')[0];
    const modelName  = quote.model?.name ?? 'Vehículo Eléctrico';
    const trimName   = trimData?.name  ?? '';
    const brandName  = quote.model?.brand?.name ?? 'Elemotor';

    const createdDate  = new Date(quote.createdAt);
    const expiresDate  = new Date(createdDate);
    expiresDate.setDate(expiresDate.getDate() + 10);
    const fmtDate = (d: Date) => d.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });

    const price = quote.budgetRange ? Number(quote.budgetRange) : null;
    const iva   = price ? Math.round(price / 1.19 * 0.19) : null;
    const base  = price && iva ? price - iva : null;
    const fmtCOP = (n: number) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

    const advisorPhone = quote.assignedTo?.phone ?? null;
    const advisorEmail = quote.assignedTo?.email ?? null;
    const advisorName  = quote.assignedTo?.name  ?? null;
    const waLink = advisorPhone
        ? `https://wa.me/${advisorPhone.replace(/\D/g,'')}?text=Hola%20${encodeURIComponent(advisorName??'asesor')}%2C%20me%20interesa%20la%20cotizaci%C3%B3n%20${referenceCode}`
        : null;
    const telLink = advisorPhone ? `tel:${advisorPhone.replace(/\s/g,'')}` : null;

    const specRows = spec ? [
        spec.batteryKwh     && { label: 'Capacidad de Batería',  value: `${spec.batteryKwh} kWh` },
        spec.rangeWltpKm    && { label: 'Autonomía WLTP',        value: `${spec.rangeWltpKm} km` },
        (!spec.rangeWltpKm && spec.rangeCltcKm) && { label: 'Autonomía CLTC', value: `${spec.rangeCltcKm} km` },
        spec.kwhPer100km    && { label: 'Consumo promedio',       value: `${spec.kwhPer100km} kWh/100km` },
        spec.chargeTime3080 && { label: 'Carga 30→80%',          value: String(spec.chargeTime3080) },
        spec.horsepower     && { label: 'Potencia máxima',        value: `${spec.horsepower} HP` },
        spec.torque         && { label: 'Torque máximo',          value: `${spec.torque} Nm` },
        spec.zeroTo100      && { label: '0 – 100 km/h',          value: `${spec.zeroTo100} s` },
        spec.topSpeed       && { label: 'Velocidad máxima',       value: `${spec.topSpeed} km/h` },
        spec.adasLevel      && { label: 'Nivel ADAS',             value: `Nivel ${spec.adasLevel}` },
        spec.screenSize     && { label: 'Pantalla central',       value: `${spec.screenSize}"` },
        spec.trunkLiters    && { label: 'Maletero',               value: `${spec.trunkLiters} L` },
    ].filter(Boolean) as { label: string; value: string }[] : [];

    const keySpecs = spec ? [
        spec.batteryKwh  && { label: 'Batería',   value: `${spec.batteryKwh} kWh`, sub: 'Blade LFP' },
        spec.horsepower  && { label: 'Potencia',  value: `${spec.horsepower} HP`,  sub: 'Motor eléctrico' },
        (spec.rangeWltpKm || spec.rangeCltcKm) && {
            label: 'Autonomía',
            value: `${spec.rangeWltpKm ?? spec.rangeCltcKm} KM`,
            sub: 'Ciclo mixto',
        },
    ].filter(Boolean) as { label: string; value: string; sub: string }[] : [];

    // Tarjetas de características oscuras — imágenes fijas de assets
    const featureCards = spec ? [
        (spec.screenSize || spec.adasLevel) && {
            title: spec.screenSize ? `Pantalla ${spec.screenSize}"` : `ADAS Nivel ${spec.adasLevel}`,
            desc: spec.screenSize
                ? 'Centro de info-entretenimiento de alto rendimiento con conectividad global y actualizaciones OTA.'
                : 'Sistema avanzado de asistencia al conductor con múltiples sensores y cámara 360°.',
            image: '/MODELOS/info/pantalla.webp',
        },
        spec.batteryKwh && {
            title: `Batería ${spec.batteryKwh} kWh`,
            desc: 'Paquete de baterías de alta densidad energética con mayor seguridad, durabilidad y autonomía real.',
            image: '/MODELOS/info/bateria.webp',
        },
        spec.chargeTime3080 && {
            title: 'Carga rápida',
            desc: `Recarga del 30% al 80% en solo ${spec.chargeTime3080}. Compatible con cargadores AC y DC de alta potencia.`,
            image: '/MODELOS/info/cargaRapida.webp',
        },
        !spec.screenSize && !spec.adasLevel && (spec.rangeWltpKm || spec.rangeCltcKm) && {
            title: `Autonomía ${spec.rangeWltpKm ?? spec.rangeCltcKm} km`,
            desc: 'Autonomía real en ciclo mixto con gestión energética inteligente y recuperación regenerativa.',
            image: '/MODELOS/info/bateria.webp',
        },
    ].filter(Boolean).slice(0, 3) as { title: string; desc: string; image: string | null }[] : [];

    // ─────────────────────────────────────────────────────────────────
    return (
        <div style={{ background: '#1A1A1A', minHeight: '100vh', fontFamily: FONT }}>
        <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', color: '#1A1A1A', boxShadow: '0 0 80px rgba(0,0,0,0.5)' }}>

            {/* ══ 1. HEADER ══ */}
            <header style={{
                background: '#111', padding: '14px 28px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 50,
            }} className="no-print-sticky">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
                        ELE<span style={{ color: G }}>MOTOR</span>
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 18 }}>|</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{brandName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: `${G}22`, border: `1px solid ${G}55`,
                        borderRadius: 6, padding: '5px 12px',
                        fontSize: 11, fontWeight: 700, color: G,
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: G, display: 'inline-block' }} />
                        Vigente
                    </div>
                    <div className="no-print"><PrintButton /></div>
                </div>
            </header>

            {/* ══ 2. HERO ══ */}
            <section style={{ position: 'relative', background: '#000', overflow: 'hidden' }}>
                {videoEmbed && isYouTube ? (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', overflow: 'hidden' }}>
                        <iframe
                            src={videoEmbed}
                            allow="autoplay; encrypted-media"
                            style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%,-50%)',
                                width: '100%', height: '100%',
                                border: 'none', opacity: 0.65, pointerEvents: 'none',
                            }}
                            title={`Video ${modelName}`}
                        />
                    </div>
                ) : videoEmbed ? (
                    <video autoPlay muted loop playsInline
                        style={{ width: '100%', display: 'block', maxHeight: 600, objectFit: 'cover', opacity: 0.65 }}
                        src={videoEmbed} />
                ) : heroImage ? (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7' }}>
                        <Image src={heroImage} alt={modelName} fill
                            style={{ objectFit: 'cover', opacity: 0.65 }} priority sizes="100vw" />
                    </div>
                ) : (
                    <div style={{ height: 420, background: 'linear-gradient(135deg,#0D1F14,#1A3828)' }} />
                )}

                {/* Gradient overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.15) 100%)',
                }} />

                {/* Client name + decorative line */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', padding: '0 24px 52px' }}>
                    <h1 style={{
                        fontSize: 'clamp(30px, 7.5vw, 62px)',
                        fontWeight: 400, color: '#fff',
                        letterSpacing: '0.1em', lineHeight: 1.1, marginBottom: 14,
                        textShadow: '0 2px 24px rgba(0,0,0,0.35)',
                    }}>
                        {clientName.toUpperCase()}
                    </h1>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                        <div style={{ width: 72, height: 2, background: 'rgba(255,255,255,0.75)' }} />
                    </div>
                    <p style={{
                        fontSize: 'clamp(13px, 2vw, 17px)',
                        color: 'rgba(255,255,255,0.8)', fontStyle: 'italic',
                    }}>
                        Lo único que le hace falta al {modelName} {trimName} ¡eres tú!
                    </p>
                </div>
            </section>

            {/* ══ 3. SALUDO + ASESOR ══ */}
            <section style={{
                background: `linear-gradient(160deg, #F0F7F3 0%, #E8F5EE 50%, #F8FAF9 100%)`,
                padding: '80px 24px', borderTop: `5px solid ${G}`,
            }}>
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>

                    {/* Metadata pill */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center',
                        background: '#fff', border: '1px solid #D1E8DA', borderRadius: 100,
                        padding: '10px 24px', marginBottom: 40,
                        fontSize: 12, color: '#9CA3AF', fontWeight: 600,
                        boxShadow: '0 2px 12px rgba(47,148,97,0.1)',
                    }}>
                        <span style={{ color: G, fontWeight: 800 }}>{referenceCode}</span>
                        <span style={{ color: '#D1E8DA' }}>•</span>
                        <span>Versión 1</span>
                        <span style={{ color: '#D1E8DA' }}>•</span>
                        <span>Emitida {fmtDate(createdDate)}</span>
                        <span style={{ color: '#D1E8DA' }}>•</span>
                        <span style={{ color: '#EF4444', fontWeight: 700 }}>Vence {fmtDate(expiresDate)}</span>
                    </div>

                    {/* Título principal */}
                    <h1 style={{
                        fontSize: 'clamp(36px, 6.5vw, 72px)',
                        fontWeight: 900, color: GRD,
                        letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 20,
                    }}>
                        Tu cotización{' '}
                        <span style={{ color: G }}>{brandName}</span>
                    </h1>

                    {/* Línea decorativa */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 36 }}>
                        <div style={{ width: 64, height: 4, borderRadius: 2, background: G }} />
                        <div style={{ width: 16, height: 4, borderRadius: 2, background: `${G}55` }} />
                        <div style={{ width: 8, height: 4, borderRadius: 2, background: `${G}22` }} />
                    </div>

                    {/* Saludo */}
                    <p style={{ fontSize: 26, fontWeight: 800, color: '#111', marginBottom: 14 }}>
                        ¡Hola, {firstName}!
                    </p>
                    <p style={{ fontSize: 17, color: GRM, lineHeight: 1.8, maxWidth: 640, margin: '0 auto 56px' }}>
                        Nos alegra que estés interesado en el{' '}
                        <strong style={{ color: '#111' }}>{modelName}{trimName ? ` ${trimName}` : ''}</strong>.
                        Hemos preparado esta guía completa para que lo conozcas al detalle.
                    </p>

                    {/* Advisor card centrada */}
                    {advisorName && (
                        <div style={{
                            display: 'inline-block', textAlign: 'left',
                            border: `1.5px solid ${G}33`, borderRadius: 24,
                            padding: '36px 40px', background: '#fff',
                            boxShadow: '0 8px 40px rgba(47,148,97,0.13)',
                            minWidth: 380, maxWidth: 600,
                            width: '100%',
                        }}>
                            {/* Header asesor */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <div style={{
                                        width: 72, height: 72, borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${G}22, ${G}44)`,
                                        border: `2.5px solid ${G}66`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                        </svg>
                                    </div>
                                    <div style={{
                                        position: 'absolute', bottom: 3, right: 3,
                                        width: 16, height: 16, borderRadius: '50%',
                                        background: G, border: '3px solid #fff',
                                    }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 20, fontWeight: 900, color: '#111', marginBottom: 6 }}>{advisorName}</div>
                                    <div style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        fontSize: 11, color: G, fontWeight: 700,
                                        textTransform: 'uppercase', letterSpacing: '0.1em',
                                        background: `${G}15`, borderRadius: 100, padding: '4px 12px',
                                    }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: G, display: 'inline-block' }} />
                                        Asesor Comercial · Disponible
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ height: 1, background: '#F0F7F3', marginBottom: 20 }} />

                            {/* Contacto */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, fontSize: 14, color: GRM }}>
                                {advisorEmail && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: 10, background: '#F0F7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                        </div>
                                        {advisorEmail}
                                    </div>
                                )}
                                {advisorPhone && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: 10, background: '#F0F7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 4.68 13.37a19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 3.59 2.69h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l1.58-1.58a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                        </div>
                                        {advisorPhone}
                                    </div>
                                )}
                            </div>

                            {/* Botones */}
                            <div style={{ display: 'flex', gap: 12 }}>
                                {waLink && (
                                    <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                        background: GWA, color: '#fff',
                                        padding: '16px 20px', borderRadius: 14,
                                        fontWeight: 800, fontSize: 15, textDecoration: 'none',
                                        boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                                        </svg>
                                        ¡Escríbeme!
                                    </a>
                                )}
                                {telLink && (
                                    <a href={telLink} style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                        background: '#fff', color: GD,
                                        padding: '16px 20px', borderRadius: 14,
                                        fontWeight: 800, fontSize: 15, textDecoration: 'none',
                                        border: `2px solid ${G}`,
                                        boxShadow: '0 4px 16px rgba(47,148,97,0.12)',
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 4.68 13.37a19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 3.59 2.69h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l1.58-1.58a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                        ¡Llámame!
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ══ 4. SELECTOR DE COLORES ══ */}
            <section style={{ background: '#fff', padding: '48px 40px', borderTop: '1px solid #F3F4F6' }}>
                <h2 style={{ fontSize: 32, fontWeight: 700, color: '#111', textAlign: 'center', marginBottom: 32 }}>
                    Ponle color a tu camino
                </h2>
                <ColorSelector colors={colors} images={images} initialColor={quote.color ?? null} modelName={modelName} />
            </section>

            {/* ══ 5. CARACTERÍSTICAS CON IMÁGENES ══ */}
            <div style={{ borderTop: '1px solid #F3F4F6' }}>

                {/* 5a. Header + descripción del modelo */}
                <section style={{ background: '#fff', padding: '40px 40px 32px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 16 }}>
                        {brandName} {modelName} {trimName}
                    </h2>
                    {quote.model?.description && (
                        <p style={{ fontSize: 14, color: GRM, lineHeight: 1.8, maxWidth: 640, margin: '0 auto' }}>
                            <strong>e-Platform 3.0:</strong> {quote.model.description}
                        </p>
                    )}
                </section>


                {/* 5c. Dark feature cards con imagen de fondo + texto overlay */}
                {featureCards.length > 0 && (
                    <section style={{ background: '#0F1923', padding: '40px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${featureCards.length}, 1fr)`, gap: 16 }}>
                            {featureCards.map((card, i) => (
                                <div key={i} style={{
                                    position: 'relative', borderRadius: 16, overflow: 'hidden',
                                    aspectRatio: '3/4', minHeight: 260, background: '#1A2535',
                                }}>
                                    {card.image && (
                                        <Image src={card.image} alt={card.title} fill
                                            style={{ objectFit: 'cover', opacity: 0.6 }} sizes="33vw" />
                                    )}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(to top, rgba(10,18,30,0.95) 0%, rgba(10,18,30,0.4) 55%, rgba(10,18,30,0.1) 100%)',
                                    }} />
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 24px' }}>
                                        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>
                                            {card.title}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                                            {card.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </div>

            {/* ══ 6. GALERÍA EXTERIOR ══ */}
            {images.length > 0 && (
                <section style={{ background: '#fff', borderTop: '1px solid #F3F4F6' }}>
                    {/* Título */}
                    <div style={{ padding: '36px 24px 20px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', lineHeight: 1.3 }}>
                            Diseño único: Conoce los detalles que<br />definirán tu conducción
                        </h2>
                    </div>

                    {/* Mosaico exterior */}
                    <div style={{ display: 'grid', gap: 3 }}>
                        {/* Fila 1: texto + imagen */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                            {/* Celda texto con imagen de fondo */}
                            <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#1A1A1A' }}>
                                {images[0] && (
                                    <Image src={images[0].url} alt={`${modelName} 1`} fill
                                        style={{ objectFit: 'cover', opacity: 0.45 }} sizes="50vw" priority />
                                )}
                                <div style={{
                                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '20px',
                                }}>
                                    <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.4 }}>
                                        Diseño único inspirado<br />en la Estética Eléctrica
                                    </p>
                                </div>
                            </div>
                            {/* Imagen derecha */}
                            {images[1] && (
                                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#F4F6F8' }}>
                                    <Image src={images[1].url} alt={`${modelName} 2`} fill style={{ objectFit: 'cover' }} sizes="50vw" />
                                </div>
                            )}
                        </div>

                        {/* Fila 2: imagen grande */}
                        {images[2] && (
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', overflow: 'hidden', background: '#F4F6F8' }}>
                                <Image src={images[2].url} alt={`${modelName} 3`} fill style={{ objectFit: 'cover' }} sizes="100vw" />
                            </div>
                        )}

                        {/* Fila 3: imágenes adicionales en 3 col si hay más */}
                        {images.length > 3 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
                                {images.slice(3).map((img, i) => (
                                    <div key={i} style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#F4F6F8' }}>
                                        <Image src={img.url} alt={`${modelName} ${i + 4}`} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ══ 7. TEXTO IMPACTO ══ */}
            <section style={{ background: '#E6E6EA', padding: '64px 40px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
                {/* Watermark */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    fontSize: 'clamp(76px,17vw,138px)',
                    fontWeight: 700, color: 'rgba(51,51,51,0.07)',
                    whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none',
                    lineHeight: 1,
                }}>
                    EFICIENTE
                </div>
                {/* Car image on top */}
                {heroImage && (
                    <div style={{ position: 'relative', zIndex: 1, width: '85%', maxWidth: 580, margin: '0 auto 20px', aspectRatio: '16/9' }}>
                        <Image src={heroImage} alt={modelName} fill style={{ objectFit: 'contain' }} sizes="85vw" />
                    </div>
                )}
                <div style={{
                    position: 'relative', zIndex: 1,
                    fontSize: 'clamp(30px,6vw,56px)',
                    fontWeight: 700, color: 'rgba(51,51,51,0.22)', letterSpacing: '-1px',
                }}>
                    Y PODEROSO
                </div>
            </section>

            {/* ══ 8. GALERÍA INTERIOR ══ */}
            {interiorImages.length > 0 && (
                <section style={{ background: '#fff', borderTop: '1px solid #F3F4F6' }}>
                    <div style={{ display: 'grid', gap: 3 }}>
                        {/* Fila 1: 3 columnas */}
                        {interiorImages.length >= 3 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
                                {interiorImages.slice(0, 3).map((img, i) => (
                                    <div key={i} style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#F4F6F8' }}>
                                        <Image src={img.url} alt={`Interior ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Fila 2: 2 columnas (imgs 4 y 5) */}
                        {interiorImages.length >= 5 && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                                {interiorImages.slice(3, 5).map((img, i) => (
                                    <div key={i} style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#F4F6F8' }}>
                                        <Image src={img.url} alt={`Interior ${i + 4}`} fill style={{ objectFit: 'cover' }} sizes="50vw" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Fila final: imagen + tarjeta de texto (al estilo BYD) */}
                        <div style={{ display: 'grid', gridTemplateColumns: interiorImages.length >= 6 ? '1fr 1fr' : '1fr', gap: 3 }}>
                            {interiorImages[5] && (
                                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#F4F6F8' }}>
                                    <Image src={interiorImages[5].url} alt="Interior 6" fill style={{ objectFit: 'cover' }} sizes="50vw" />
                                </div>
                            )}
                            <div style={{
                                background: GRD, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '32px 28px', aspectRatio: interiorImages.length >= 6 ? '4/3' : 'auto',
                                minHeight: interiorImages.length < 6 ? 120 : undefined,
                            }}>
                                <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.4, textAlign: 'center', margin: 0 }}>
                                    Su diseño Interior es<br />muy tecnológico y con<br />detalles especiales<br />que te cautivan
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ══ 9. FICHA TÉCNICA (acordeón) ══ */}
            {specRows.length > 0 && (
                <section style={{ background: '#F9FAFB', padding: '48px 40px', borderTop: '1px solid #F3F4F6' }}>
                    <SpecsAccordion rows={specRows} />
                </section>
            )}

            {/* ══ 10. VALOR DE LA INVERSIÓN ══ */}
            <section style={{ background: '#fff', padding: '48px 40px', borderTop: '1px solid #F3F4F6' }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: GRD, textAlign: 'center', marginBottom: 4 }}>
                    Valor de la inversión
                </h2>
                <div style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginBottom: 28 }}>
                    {brandName} {modelName} {trimName}
                </div>

                {heroImage && (
                    <div style={{ position: 'relative', width: '100%', marginBottom: 28, aspectRatio: '16/9', maxHeight: 300 }}>
                        <Image src={heroImage} alt={modelName} fill style={{ objectFit: 'contain' }} sizes="100vw" />
                    </div>
                )}

                {price && (
                    <>
                        {/* Price rows */}
                        <div style={{ border: '1px solid #E1E3E5', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                            <div style={{ padding: '13px 20px', borderBottom: '1px dotted #E1E3E5', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                <span style={{ color: GRM }}>Cantidad</span>
                                <span style={{ fontWeight: 600, color: GRD }}>1</span>
                            </div>
                            {base && (
                                <div style={{ padding: '13px 20px', borderBottom: '1px dotted #E1E3E5', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                    <span style={{ color: GRM }}>Subtotal (sin IVA)</span>
                                    <span style={{ fontWeight: 600, color: GRD }}>{fmtCOP(base)}</span>
                                </div>
                            )}
                            {iva && (
                                <div style={{ padding: '13px 20px', borderBottom: '1px dotted #E1E3E5', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                    <span style={{ color: GRM }}>IVA (19%)</span>
                                    <span style={{ fontWeight: 600, color: GRD }}>{fmtCOP(iva)}</span>
                                </div>
                            )}
                            <div style={{ padding: '13px 20px', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                <span style={{ color: GRM }}>Valores adicionales</span>
                                <span style={{ color: '#9CA3AF' }}>Por definir</span>
                            </div>
                        </div>

                        {/* Total — gray box */}
                        <div style={{ background: '#DEDEDE', borderRadius: 12, padding: '28px 24px', textAlign: 'center', marginBottom: 12 }}>
                            <div style={{ fontSize: 'clamp(28px,6vw,44px)', fontWeight: 900, color: GRD, lineHeight: 1 }}>
                                {fmtCOP(price)}*
                            </div>
                            <div style={{ fontSize: 12, color: GRM, marginTop: 6 }}>Total cotización</div>
                        </div>
                    </>
                )}

                <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginBottom: 28 }}>
                    *El precio incluye IVA. Valores de matrícula, SOAT y otros trámites no están incluidos.
                </p>

                {/* Valores adicionales */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: GRD, marginBottom: 8 }}>Valores adicionales</div>
                    <p style={{ fontSize: 12, color: GRM, lineHeight: 1.7, marginBottom: 8 }}>
                        Al momento de la compra el cliente deberá asumir los siguientes conceptos:
                    </p>
                    {['Valor de la matrícula', 'Valor del trámite + IVA', 'Impuesto vehicular', 'SOAT (Seguro Obligatorio de Accidentes de Tránsito)'].map(item => (
                        <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: GRM, marginBottom: 4 }}>
                            <span style={{ color: G, fontWeight: 800, marginTop: 1 }}>•</span>
                            {item}
                        </div>
                    ))}
                </div>

                {/* Condiciones especiales — dark box */}
                <div style={{ background: GRD, borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flexShrink: 0, width: 40, height: 40, background: G, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 2 }}>Condiciones especiales</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                            {quote.paymentMethod ? PAYMENT_LABELS[quote.paymentMethod] ?? quote.paymentMethod : 'Opciones de financiamiento disponibles'} · Kit de carretera y cargador incluidos
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ 11. POST-VENTA ══ */}
            <section style={{ background: '#fff', padding: '48px 40px', borderTop: '1px solid #F3F4F6' }}>
                <h2 style={{ fontSize: 25, fontWeight: 700, color: '#111', marginBottom: 24 }}>
                    Lo que debes tener en cuenta después de estrenar
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                        { title: 'Renovaciones anuales', desc: 'Para circular con tranquilidad, recuerda renovar el SOAT y pagar el impuesto vehicular cada año.', icon: 'calendar' },
                        { title: 'Seguro para ti y tu familia', desc: 'Se recomienda contar con un seguro todo riesgo. Con nosotros puedes acceder a los mejores planes al mejor precio.', icon: 'shield' },
                        { title: 'Mantenimientos preventivos', desc: 'Hay mantenimientos preventivos según el uso del vehículo. Al comprar con nosotros accedes a descuentos exclusivos.', icon: 'wrench' },
                    ].map((item, i) => (
                        <div key={i} style={{ border: '1px solid #E1E3E5', borderRadius: 14, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#111', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {i === 0 && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                                {i === 1 && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                                {i === 2 && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="m14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>}
                            </div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: GRD, marginBottom: 4 }}>{item.title}</div>
                                <div style={{ fontSize: 12, color: GRM, lineHeight: 1.7 }}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ 12. CTA BANNER ══ */}
            <section style={{
                background: 'linear-gradient(135deg, #0D1F14 0%, #1A3828 100%)',
                padding: '64px 40px', textAlign: 'center',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(47,148,97,0.12) 0%, transparent 70%)' }} />
                <div style={{ position: 'relative' }}>
                    <div style={{ fontSize: 'clamp(22px,5vw,38px)', fontWeight: 900, color: '#fff', marginBottom: 6 }}>
                        ¡Da el siguiente paso!
                    </div>
                    <div style={{ fontSize: 'clamp(15px,2.5vw,20px)', fontWeight: 400, color: 'rgba(255,255,255,0.7)', marginBottom: 28 }}>
                        Separa tu vehículo y asegura el precio de esta cotización.
                    </div>
                    {waLink && (
                        <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 10,
                            background: RED, color: '#fff',
                            padding: '14px 36px', borderRadius: 8,
                            fontWeight: 800, fontSize: 15, textDecoration: 'none',
                            border: '2px solid rgba(255,255,255,0.25)',
                            boxShadow: '0 4px 24px rgba(215,12,25,0.45)',
                        }}>
                            Quiero separar
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                        </a>
                    )}
                </div>
            </section>

            {/* ══ 13. FOOTER ══ */}
            <footer style={{ background: GRD, padding: '32px 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: 6 }}>
                            ELE<span style={{ color: G }}>MOTOR</span>
                        </div>
                        <div style={{ width: 80, height: 1, background: 'rgba(255,255,255,0.4)' }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', fontWeight: 700 }}>
                        {referenceCode}
                    </div>
                </div>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, marginBottom: 16 }}>
                    No somos representantes oficiales de las marcas en Colombia. Esta cotización es un documento informativo y no constituye una oferta
                    comercial definitiva. Precios, especificaciones y disponibilidad sujetos a cambios sin previo aviso. Válida por 10 días hábiles.
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Ak 27 #55-16, Bucaramanga</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>314 466 3469</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>comercial@elemotor.com.co</span>
                </div>
            </footer>

            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                @media print {
                    .no-print, .no-print-sticky { display: none !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    video, iframe { display: none !important; }
                }
            `}</style>
        </div>
        </div>
    );
}
