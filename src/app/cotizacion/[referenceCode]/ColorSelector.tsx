'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Color { name: string; hexCode: string; swatchUrl?: string | null; }

interface Props {
    colors: Color[];
    images: { url: string }[];
    initialColor?: string | null;
    modelName: string;
}

export function ColorSelector({ colors, images, initialColor, modelName }: Props) {
    const initIdx = Math.max(0, colors.findIndex(
        c => c.name.toLowerCase() === (initialColor ?? '').toLowerCase()
    ));
    const [selectedIdx, setSelectedIdx] = useState(initIdx);

    const selected = colors[selectedIdx];
    const mainImage = selected?.swatchUrl ?? images[0]?.url ?? null;

    return (
        <div style={{ fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" }}>
            {/* Imagen con fondo degradado */}
            <div style={{
                background: 'linear-gradient(135deg, #eef0f2 0%, #dde0e3 100%)',
                borderRadius: 20,
                padding: '24px 32px 16px',
                marginBottom: 20,
                position: 'relative',
            }}>
                {mainImage ? (
                    <div style={{ position: 'relative', width: '100%', height: 380 }}>
                        <Image
                            src={mainImage}
                            alt={`${modelName}${selected ? ` — ${selected.name}` : ''}`}
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes="(max-width: 768px) 100vw, 700px"
                        />
                    </div>
                ) : (
                    <div style={{ height: 220 }} />
                )}
                <p style={{ textAlign: 'center', fontSize: 10, color: '#9CA3AF', fontStyle: 'italic', margin: '12px 0 0' }}>
                    *Las imágenes son referenciales. Los accesorios son solo para ambientación y no hacen parte del vehículo.
                </p>
            </div>

            {/* Nombre del color seleccionado */}
            {selected && (
                <p style={{ textAlign: 'center', fontSize: 18, fontWeight: 700, color: '#4E5356', marginBottom: 16 }}>
                    {selected.name}
                </p>
            )}

            {/* Círculos de color */}
            {colors.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 8 }}>
                    {colors.map((c, i) => {
                        const active = i === selectedIdx;
                        return (
                            <button key={i} type="button" onClick={() => setSelectedIdx(i)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: '50%',
                                    background: `#${c.hexCode}`,
                                    border: active ? '3px solid #2F9461' : '3px solid #D1D5DB',
                                    boxShadow: active ? '0 0 0 3px rgba(47,148,97,0.20)' : 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}>
                                    {active && (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"
                                            strokeLinecap="round" strokeLinejoin="round"
                                            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }}>
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
