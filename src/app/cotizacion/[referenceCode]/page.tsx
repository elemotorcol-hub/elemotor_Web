import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PrintButton } from './PrintButton';

const FONT = "'Inter', 'Helvetica Neue', Arial, system-ui, sans-serif";
const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const PAYMENT_LABELS: Record<string, string> = {
    cash: 'Contado', financing: 'Financiamiento',
    leasing: 'Leasing', trade_in: 'Con entrega de vehículo',
};

async function getQuote(referenceCode: string) {
    const url = `${API_BASE}/api/quotes/public/${referenceCode}`;
    try {
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (res.status === 404) return null;
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

    const trimData = quote.trim ?? quote.model?.trims?.[0] ?? null;
    const spec = trimData?.spec ?? null;
    const images: { url: string }[] = trimData?.images ?? [];
    const heroImage = images[0]?.url ?? null;
    const galleryImages = images.slice(0, 6);
    const featureImages = images.slice(0, 2);

    const date = new Date(quote.createdAt).toLocaleDateString('es-CO', {
        day: 'numeric', month: 'long', year: 'numeric',
    });

    const price = quote.budgetRange
        ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(quote.budgetRange))
        : null;

    const energyRows = spec ? [
        spec.batteryKwh     && { label: 'Capacidad de Batería',  value: `${spec.batteryKwh} kWh` },
        spec.rangeWltpKm    && { label: 'Autonomía WLTP',         value: `${spec.rangeWltpKm} km` },
        (!spec.rangeWltpKm && spec.rangeCltcKm) && { label: 'Autonomía CLTC', value: `${spec.rangeCltcKm} km` },
        spec.kwhPer100km    && { label: 'Consumo Promedio',        value: `${spec.kwhPer100km} kWh/100km` },
        spec.chargeTime3080 && { label: 'Carga 30→80%',           value: String(spec.chargeTime3080) },
    ].filter(Boolean) as { label: string; value: string }[] : [];

    const perfRows = spec ? [
        spec.horsepower && { label: 'Potencia Máxima',  value: `${spec.horsepower} HP` },
        spec.torque     && { label: 'Torque Máximo',    value: `${spec.torque} Nm` },
        spec.zeroTo100  && { label: '0 – 100 km/h',    value: `${spec.zeroTo100} s` },
        spec.topSpeed   && { label: 'Vel. Máxima',      value: `${spec.topSpeed} km/h` },
        spec.adasLevel  && { label: 'Nivel ADAS',       value: `Nivel ${spec.adasLevel}` },
        spec.screenSize && { label: 'Pantalla Central', value: `${spec.screenSize}"` },
        spec.trunkLiters && { label: 'Maletero',        value: `${spec.trunkLiters} L` },
    ].filter(Boolean) as { label: string; value: string }[] : [];

    const quickStats = spec ? [
        spec.rangeWltpKm    ? { val: String(spec.rangeWltpKm), unit: 'KM',  sub: 'AUTONOMÍA WLTP' }
            : spec.rangeCltcKm ? { val: String(spec.rangeCltcKm), unit: 'KM', sub: 'AUTONOMÍA CLTC' } : null,
        spec.zeroTo100      ? { val: String(spec.zeroTo100),  unit: 'S',   sub: '0 – 100 KM/H' }     : null,
        spec.horsepower     ? { val: String(spec.horsepower), unit: 'HP',  sub: 'POTENCIA MÁX.' }     : null,
        spec.chargeTime3080 ? { val: String(spec.chargeTime3080), unit: '', sub: 'CARGA 30→80%' }     : null,
    ].filter(Boolean) as { val: string; unit: string; sub: string }[] : [];

    return (
        <div style={{ background: '#080E0C', color: '#fff', fontFamily: FONT, minHeight: '100vh' }}>

            {/* ════════════════════════════════════
                HEADER
            ════════════════════════════════════ */}
            <header style={{
                borderBottom: '1px solid rgba(0,214,143,0.15)',
                background: '#0a1410',
                padding: '16px 40px',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-1px', color: '#fff', lineHeight: 1 }}>
                            ELE<span style={{ color: '#00D68F' }}>MOTOR</span>
                        </div>
                        <div style={{ fontSize: 9, color: '#4B6A5E', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 3 }}>
                            Movilidad Eléctrica Premium
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 9, color: '#4B6A5E', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                Cotización de Vehículo
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#00D68F', marginTop: 2 }}>
                                {quote.referenceCode}
                            </div>
                            <div style={{ fontSize: 10, color: '#6B7280', marginTop: 1 }}>{date} · Válida 10 días</div>
                        </div>
                        <div className="no-print">
                            <PrintButton />
                        </div>
                    </div>
                </div>
            </header>

            {/* ════════════════════════════════════
                HERO — Vehículo
            ════════════════════════════════════ */}
            <section style={{
                background: 'linear-gradient(135deg, #080E0C 0%, #0D1F18 50%, #080E0C 100%)',
                borderBottom: '1px solid rgba(0,214,143,0.12)',
                overflow: 'hidden',
                position: 'relative',
            }}>
                {/* Decorative glow */}
                <div style={{
                    position: 'absolute', top: '-100px', right: '15%',
                    width: 500, height: 500, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0,214,143,0.07) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 40px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}
                     className="hero-grid">

                    {/* Left: info */}
                    <div>
                        {/* Green label */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(0,214,143,0.08)', border: '1px solid rgba(0,214,143,0.25)',
                            borderRadius: 999, padding: '5px 14px', marginBottom: 20,
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D68F', display: 'inline-block' }} />
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#00D68F', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                                {quote.model?.brand?.name ?? 'Vehículo Eléctrico'}
                            </span>
                        </div>

                        {/* Model name */}
                        <h1 style={{
                            fontSize: 'clamp(42px, 6vw, 72px)',
                            fontWeight: 900,
                            color: '#fff',
                            lineHeight: 0.95,
                            letterSpacing: '-2px',
                            marginBottom: 14,
                        }}>
                            {quote.model?.name ?? 'Vehículo'}
                        </h1>

                        {/* Trim */}
                        {trimData?.name && (
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#00D68F', letterSpacing: '-0.5px', marginBottom: 8 }}>
                                {trimData.name.toUpperCase()}
                            </div>
                        )}

                        {/* Meta */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                            {[
                                quote.model?.year && `Modelo ${quote.model.year}`,
                                quote.model?.type?.toUpperCase(),
                            ].filter(Boolean).map((t) => (
                                <span key={String(t)} style={{
                                    fontSize: 11, color: '#6B7280', fontWeight: 600,
                                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 6, padding: '4px 10px',
                                }}>
                                    {t}
                                </span>
                            ))}
                        </div>

                        {/* Feature badges */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {['Importación Directa', 'Garantía Total', 'Financiamiento'].map((b) => (
                                <div key={b} style={{
                                    fontSize: 10, fontWeight: 700, color: '#9CA3AF',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 999, padding: '6px 14px',
                                    background: 'rgba(255,255,255,0.03)',
                                }}>
                                    ✓ {b}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: image */}
                    <div style={{ position: 'relative', minHeight: 280 }}>
                        {heroImage ? (
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                                {/* Glow under the car */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '30%',
                                    background: 'radial-gradient(ellipse, rgba(0,214,143,0.18) 0%, transparent 70%)',
                                    filter: 'blur(20px)',
                                }} />
                                <Image
                                    src={heroImage}
                                    alt={quote.model?.name ?? 'Vehículo'}
                                    fill
                                    style={{ objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,214,143,0.15))' }}
                                    priority
                                    sizes="(max-width: 768px) 100vw, 580px"
                                />
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280, color: '#4B6A5E', fontSize: 13 }}>
                                Sin imagen disponible
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════
                STATS
            ════════════════════════════════════ */}
            {quickStats.length > 0 && (
                <section style={{ background: '#0a1410', borderBottom: '1px solid rgba(0,214,143,0.1)' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
                        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${quickStats.length}, 1fr)` }}>
                            {quickStats.map((s, i) => (
                                <div key={i} style={{
                                    padding: '32px 24px',
                                    borderRight: i < quickStats.length - 1 ? '1px solid rgba(0,214,143,0.1)' : 'none',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: 'clamp(36px, 5vw, 54px)', fontWeight: 900, color: '#00D68F', letterSpacing: '-1.5px', lineHeight: 1 }}>
                                        {s.val}
                                        {s.unit && (
                                            <span style={{ fontSize: '40%', fontWeight: 700, color: '#4B6A5E', marginLeft: 4 }}>{s.unit}</span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 9, fontWeight: 800, color: '#4B6A5E', letterSpacing: '0.2em', marginTop: 8, textTransform: 'uppercase' }}>
                                        {s.sub}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ════════════════════════════════════
                CLIENTE + ASESOR
            ════════════════════════════════════ */}
            <section style={{ background: '#080E0C', padding: '40px 40px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                        {/* Cliente */}
                        <div style={{
                            background: '#0F1A16',
                            border: '1px solid rgba(0,214,143,0.12)',
                            borderRadius: 16, padding: '24px 28px',
                        }}>
                            <div style={{ fontSize: 9, fontWeight: 800, color: '#00D68F', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
                                ▸ Información del Cliente
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <div style={{ fontSize: 9, color: '#4B6A5E', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Nombre</div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{quote.name || '—'}</div>
                                </div>
                                {quote.user?.cedula && (
                                    <div>
                                        <div style={{ fontSize: 9, color: '#4B6A5E', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Identificación</div>
                                        <div style={{ fontSize: 14, color: '#9CA3AF' }}>CC {quote.user.cedula}</div>
                                    </div>
                                )}
                                {quote.city && (
                                    <div>
                                        <div style={{ fontSize: 9, color: '#4B6A5E', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Ciudad</div>
                                        <div style={{ fontSize: 14, color: '#9CA3AF' }}>{quote.city}</div>
                                    </div>
                                )}
                                {quote.paymentMethod && (
                                    <div>
                                        <div style={{ fontSize: 9, color: '#4B6A5E', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Forma de Pago</div>
                                        <div style={{ fontSize: 14, color: '#9CA3AF' }}>{PAYMENT_LABELS[quote.paymentMethod] ?? quote.paymentMethod}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Asesor */}
                        <div style={{
                            background: '#0F1A16',
                            border: '1px solid rgba(0,214,143,0.12)',
                            borderRadius: 16, padding: '24px 28px',
                        }}>
                            <div style={{ fontSize: 9, fontWeight: 800, color: '#00D68F', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
                                ▸ Asesor Comercial
                            </div>
                            {quote.assignedTo ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <div style={{ fontSize: 9, color: '#4B6A5E', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Nombre</div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{quote.assignedTo.name}</div>
                                    </div>
                                    {(quote.assignedTo.phone || quote.assignedTo.email) && (
                                        <div>
                                            <div style={{ fontSize: 9, color: '#4B6A5E', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Contacto</div>
                                            <div style={{ fontSize: 14, color: '#9CA3AF' }}>
                                                {quote.assignedTo.phone || quote.assignedTo.email}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <div style={{ fontSize: 9, color: '#4B6A5E', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Cargo</div>
                                        <div style={{ fontSize: 14, color: '#9CA3AF' }}>Asesor Senior Elemotor</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 9, color: '#4B6A5E', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Referencia</div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#00D68F', fontFamily: 'monospace' }}>{quote.referenceCode}</div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ fontSize: 13, color: '#4B6A5E' }}>Sin asesor asignado</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════
                ESPECIFICACIONES TÉCNICAS
            ════════════════════════════════════ */}
            {(energyRows.length > 0 || perfRows.length > 0) && (
                <section style={{ background: '#0a1410', padding: '48px 40px', borderTop: '1px solid rgba(0,214,143,0.1)' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                            <div style={{ width: 3, height: 28, background: '#00D68F', borderRadius: 2 }} />
                            <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: '#4B6A5E', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                    Ficha Técnica
                                </div>
                                <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
                                    Especificaciones
                                </div>
                            </div>
                        </div>

                        <div className="spec-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            {/* Energía */}
                            {energyRows.length > 0 && (
                                <div style={{ background: '#0F1A16', border: '1px solid rgba(0,214,143,0.1)', borderRadius: 16, overflow: 'hidden' }}>
                                    <div style={{
                                        padding: '12px 20px',
                                        background: 'rgba(0,214,143,0.06)',
                                        borderBottom: '1px solid rgba(0,214,143,0.1)',
                                        fontSize: 9, fontWeight: 800, color: '#00D68F',
                                        letterSpacing: '0.2em', textTransform: 'uppercase',
                                    }}>
                                        ⚡ Energía &amp; Batería
                                    </div>
                                    <div style={{ padding: '4px 0' }}>
                                        {energyRows.map((row, i) => (
                                            <div key={i} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '12px 20px',
                                                borderBottom: i < energyRows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                            }}>
                                                <span style={{ fontSize: 12, color: '#6B7280' }}>{row.label}</span>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{row.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Performance */}
                            {perfRows.length > 0 && (
                                <div style={{ background: '#0F1A16', border: '1px solid rgba(0,214,143,0.1)', borderRadius: 16, overflow: 'hidden' }}>
                                    <div style={{
                                        padding: '12px 20px',
                                        background: 'rgba(0,214,143,0.06)',
                                        borderBottom: '1px solid rgba(0,214,143,0.1)',
                                        fontSize: 9, fontWeight: 800, color: '#00D68F',
                                        letterSpacing: '0.2em', textTransform: 'uppercase',
                                    }}>
                                        🏎 Performance &amp; Tecnología
                                    </div>
                                    <div style={{ padding: '4px 0' }}>
                                        {perfRows.map((row, i) => (
                                            <div key={i} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '12px 20px',
                                                borderBottom: i < perfRows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                            }}>
                                                <span style={{ fontSize: 12, color: '#6B7280' }}>{row.label}</span>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{row.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ════════════════════════════════════
                GALERÍA + FEATURE CARDS
            ════════════════════════════════════ */}
            {galleryImages.length > 0 && (
                <section style={{ background: '#080E0C', padding: '48px 40px', borderTop: '1px solid rgba(0,214,143,0.08)' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                            <div style={{ width: 3, height: 28, background: '#00D68F', borderRadius: 2 }} />
                            <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: '#4B6A5E', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                    Diseño &amp; Detalles
                                </div>
                                <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
                                    Galería del Modelo
                                </div>
                            </div>
                        </div>

                        {/* Main gallery grid */}
                        {galleryImages.length >= 3 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                {/* Large image */}
                                <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', gridRow: '1 / 3', background: '#0F1A16' }}>
                                    <Image src={galleryImages[0].url} alt="Vista 1" fill style={{ objectFit: 'cover' }} sizes="60vw" />
                                </div>
                                {/* Small images */}
                                {galleryImages.slice(1, 3).map((img, i) => (
                                    <div key={i} style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', background: '#0F1A16' }}>
                                        <Image src={img.url} alt={`Vista ${i + 2}`} fill style={{ objectFit: 'cover' }} sizes="30vw" />
                                    </div>
                                ))}
                            </div>
                        ) : galleryImages.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${galleryImages.length}, 1fr)`, gap: 12, marginBottom: 12 }}>
                                {galleryImages.map((img, i) => (
                                    <div key={i} style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', background: '#0F1A16' }}>
                                        <Image src={img.url} alt={`Vista ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="50vw" />
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {/* Remaining images row */}
                        {galleryImages.length > 3 && (
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(galleryImages.length - 3, 3)}, 1fr)`, gap: 12 }}>
                                {galleryImages.slice(3, 6).map((img, i) => (
                                    <div key={i} style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', background: '#0F1A16' }}>
                                        <Image src={img.url} alt={`Vista ${i + 4}`} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ════════════════════════════════════
                FEATURE CARDS
            ════════════════════════════════════ */}
            <section style={{ background: '#080E0C', padding: '0 40px 48px', borderTop: 'none' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>

                        {/* Card 1 */}
                        {featureImages[0] ? (
                            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '3/2' }}>
                                <Image src={featureImages[0].url} alt="Tecnología" fill style={{ objectFit: 'cover' }} sizes="33vw" />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                                }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px' }}>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                                        {spec?.screenSize ? `Pantalla ${spec.screenSize}"` : 'Tecnología de Punta'}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                                        {spec?.screenSize
                                            ? `Sistema táctil de ${spec.screenSize}" con OS propio, procesador Snapdragon y conectividad total.`
                                            : 'Equipamiento tecnológico de última generación.'}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                borderRadius: 16, aspectRatio: '3/2', background: '#0F1A16',
                                border: '1px solid rgba(0,214,143,0.1)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 36, marginBottom: 12 }}>🖥️</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Tecnología Avanzada</div>
                                <div style={{ fontSize: 12, color: '#6B7280' }}>Sistema multimedia inteligente de última generación</div>
                            </div>
                        )}

                        {/* Card 2 */}
                        {featureImages[1] ? (
                            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '3/2' }}>
                                <Image src={featureImages[1].url} alt="Eficiencia" fill style={{ objectFit: 'cover' }} sizes="33vw" />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                                }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px' }}>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Eficiencia Aerodinámica</div>
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                                        {spec?.kwhPer100km
                                            ? `Coeficiente de arrastre optimizado. Solo ${spec.kwhPer100km} kWh/100km para máxima autonomía.`
                                            : 'Diseño aerodinámico optimizado para máxima eficiencia energética.'}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                borderRadius: 16, aspectRatio: '3/2', background: '#0F1A16',
                                border: '1px solid rgba(0,214,143,0.1)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Alta Eficiencia</div>
                                <div style={{ fontSize: 12, color: '#6B7280' }}>Máxima autonomía por carga</div>
                            </div>
                        )}

                        {/* Card 3: Garantía */}
                        <div style={{
                            borderRadius: 16, aspectRatio: '3/2',
                            background: 'linear-gradient(135deg, #00D68F 0%, #00A36B 100%)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', padding: 28, textAlign: 'center',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute', top: '-30px', right: '-30px',
                                width: 120, height: 120, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                            }} />
                            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 14 }}>
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 8, letterSpacing: '0.06em' }}>
                                GARANTÍA ELEMOTOR
                            </div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>
                                5 años garantía mecánica · 8 años batería de tracción
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════
                PRECIO
            ════════════════════════════════════ */}
            <section style={{
                background: 'linear-gradient(180deg, #0a1410 0%, #080E0C 100%)',
                borderTop: '1px solid rgba(0,214,143,0.12)',
                padding: '56px 40px',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div className="price-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>

                        {/* Left: price */}
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 800, color: '#4B6A5E', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
                                Inversión Total
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#00D68F', marginBottom: 16 }}>
                                Importación Directa · Sin Intermediarios
                            </div>

                            {price ? (
                                <div style={{
                                    fontSize: 'clamp(32px, 5vw, 52px)',
                                    fontWeight: 900,
                                    color: '#fff',
                                    letterSpacing: '-1.5px',
                                    lineHeight: 1,
                                    marginBottom: 12,
                                }}>
                                    {price}
                                </div>
                            ) : (
                                <div style={{ fontSize: 20, fontWeight: 700, color: '#4B6A5E', marginBottom: 12 }}>
                                    Consultar con asesor
                                </div>
                            )}

                            <div style={{ fontSize: 12, color: '#4B6A5E', marginBottom: 24 }}>
                                Incluye gastos de nacionalización e IVA
                                {quote.paymentMethod && (
                                    <> · Pago: <span style={{ color: '#9CA3AF' }}>{PAYMENT_LABELS[quote.paymentMethod] ?? quote.paymentMethod}</span></>
                                )}
                            </div>

                            {/* Incluye */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ fontSize: 9, fontWeight: 800, color: '#4B6A5E', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
                                    Incluye en el Valor
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    {['Cargador Domiciliario 7kW', 'Kit de Carretera Pro', 'Tapetes de Lujo', 'Trámites RUNT'].map((item) => (
                                        <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: '#9CA3AF' }}>
                                            <span style={{ color: '#00D68F', fontWeight: 800, fontSize: 14 }}>✓</span>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: terms */}
                        <div style={{
                            background: '#0F1A16',
                            border: '1px solid rgba(0,214,143,0.12)',
                            borderRadius: 16, padding: '28px 28px',
                        }}>
                            <div style={{ fontSize: 9, fontWeight: 800, color: '#00D68F', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
                                ▸ Términos de Pago
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                {[
                                    { step: '01', text: 'Reserva del 10% del valor total del vehículo.' },
                                    { step: '02', text: '50% a la llegada del vehículo a puerto nacional.' },
                                    { step: '03', text: 'Saldo contra entrega y trámites de matrícula.' },
                                ].map((t, i, arr) => (
                                    <div key={i} style={{
                                        display: 'flex', gap: 16, padding: '16px 0',
                                        borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                    }}>
                                        <div style={{
                                            fontSize: 22, fontWeight: 900, color: 'rgba(0,214,143,0.25)',
                                            letterSpacing: '-1px', lineHeight: 1, flexShrink: 0, width: 32,
                                        }}>
                                            {t.step}
                                        </div>
                                        <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.5, paddingTop: 2 }}>
                                            {t.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                marginTop: 20, padding: '14px 16px',
                                background: 'rgba(0,214,143,0.06)',
                                border: '1px solid rgba(0,214,143,0.15)',
                                borderRadius: 10,
                                fontSize: 11, color: '#6B7280', lineHeight: 1.6,
                            }}>
                                Cotización válida por <strong style={{ color: '#9CA3AF' }}>10 días hábiles</strong>. Precios sujetos a disponibilidad de inventario. No incluye matrícula ni traspaso.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════
                FOOTER
            ════════════════════════════════════ */}
            <footer style={{
                background: '#050B08',
                borderTop: '1px solid rgba(0,214,143,0.1)',
                padding: '28px 40px',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: 4 }}>
                            ELE<span style={{ color: '#00D68F' }}>MOTOR</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#4B6A5E' }}>
                            Ak 27 #55-16, Bucaramanga · 314 466 3469 · comercial@elemotor.com.co
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#00D68F' }}>{quote.referenceCode}</div>
                        <div style={{ fontSize: 10, color: '#4B6A5E', marginTop: 2 }}>{date}</div>
                    </div>
                </div>
                <div style={{ maxWidth: 1200, margin: '16px auto 0', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 16 }}>
                    <p style={{ fontSize: 9, color: '#2D4A3E', lineHeight: 1.7, textAlign: 'center' }}>
                        No somos representantes oficiales de las marcas en Colombia. Esta cotización es un documento informativo y no constituye una oferta comercial definitiva.
                        Los precios, especificaciones y disponibilidad están sujetos a cambios sin previo aviso.
                    </p>
                </div>
            </footer>

            <style>{`
                * { box-sizing: border-box; }
                @media (max-width: 640px) {
                    .hero-grid, .info-grid, .spec-grid,
                    .price-grid, .feat-grid { grid-template-columns: 1fr !important; }
                    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .stats-grid > div { border-right: none !important; border-bottom: 1px solid rgba(0,214,143,0.1); }
                }
                @media print {
                    .no-print { display: none !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}</style>
        </div>
    );
}
