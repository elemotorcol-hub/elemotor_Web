'use client';

import { useState } from 'react';

interface SpecRow { label: string; value: string; }

export function SpecsAccordion({ rows }: { rows: SpecRow[] }) {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ border: '1px solid #E1E3E5', borderRadius: 12, overflow: 'hidden', background: '#fff',
            fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" }}>
            <button type="button" onClick={() => setOpen(o => !o)}
                style={{
                    width: '100%', padding: '18px 24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#fff', cursor: 'pointer', border: 'none',
                    fontSize: 15, fontWeight: 700, color: '#4E5356',
                    fontFamily: 'inherit',
                }}>
                Ficha Técnica
                <div style={{
                    width: 30, height: 30, borderRadius: '50%', background: '#D70C19', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </button>

            <div style={{ maxHeight: open ? '2000px' : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                <div style={{ borderTop: '1px solid #E1E3E5' }}>
                    {rows.map((row, i) => (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '13px 24px',
                            borderBottom: i < rows.length - 1 ? '1px dotted #E1E3E5' : 'none',
                        }}>
                            <span style={{ fontSize: 13, color: '#5C5C5C' }}>{row.label}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#4E5356' }}>{row.value}</span>
                        </div>
                    ))}
                    <div style={{ padding: '12px 24px', borderTop: '1px solid #E1E3E5' }}>
                        <p style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.7, margin: 0 }}>
                            * Las especificaciones son informativas y pueden variar según versión y disponibilidad.<br />
                            * Los valores de autonomía son estimados bajo condiciones controladas de prueba.<br />
                            * Consulta las condiciones exactas del vehículo con tu asesor EleMotor.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
