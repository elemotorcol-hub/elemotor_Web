'use client';

import { useState } from 'react';

interface ColorOption {
    name: string;
    hex: string;
}

interface ColorSelectorProps {
    colors: ColorOption[];
}

export function ColorSelector({ colors }: ColorSelectorProps) {
    const [selectedColor, setSelectedColor] = useState(colors[0]);

    if (!colors || colors.length === 0) return null;

    return (
        <section className="flex flex-col items-center py-10">
            <h2 className="text-2xl font-bold text-white mb-8">Elige Tu Color</h2>

            <div
                className="flex gap-6 mb-6"
                role="group"
                aria-label="Selector de colores del vehículo"
            >
                {colors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                        <button
                            key={color.name}
                            onClick={() => setSelectedColor(color)}
                            aria-label={`Seleccionar color ${color.name}`}
                            aria-pressed={isSelected}
                            className={`w-12 h-12 rounded-full transition-all duration-300 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4AA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1C] ${isSelected ? 'scale-110' : 'scale-100 opacity-80 hover:opacity-100 hover:scale-105'
                                }`}
                            style={{ backgroundColor: color.hex }}
                        >
                            {/* Anillo exterior cuando está seleccionado */}
                            {isSelected && (
                                <span className="absolute -inset-2 rounded-full border-2 border-[var(--color-ring,#00D4AA)] pointer-events-none transition-colors" style={{ '--color-ring': color.hex } as any} />
                            )}
                        </button>
                    );
                })}
            </div>

            <p
                className="text-sm font-bold tracking-widest text-slate-400 capitalize transition-all"
                aria-live="polite"
            >
                {selectedColor.name}
            </p>
        </section>
    );
}
