'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Share2, Plus, X, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VehicleModel } from '@/types/comparison';
import { availableModels, SPEC_KEYS } from '@/mocks/comparisonData';



export function VehicleComparison() {
    // Estado para los 3 slots de comparación. Inicialmente 1 seleccionado para mostrar cómo luce.
    const [selectedModels, setSelectedModels] = React.useState<(VehicleModel | null)[]>([
        availableModels[0],
        null,
        null,
    ]);

    // Estado para el modal de selección de vehículo
    const [isSelectingForSlot, setIsSelectingForSlot] = React.useState<number | null>(null);

    const handleRemoveModel = (index: number) => {
        const newModels = [...selectedModels];
        newModels[index] = null;
        setSelectedModels(newModels);
    };

    const handleSelectModel = (model: VehicleModel, slotIndex: number) => {
        const newModels = [...selectedModels];
        newModels[slotIndex] = model;
        setSelectedModels(newModels);
        setIsSelectingForSlot(null);
    };

    // Computar el modelo a cotizar
    const validModels = selectedModels.filter(m => m !== null);
    const hasMultipleModels = validModels.length > 1;
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    return (
        <section id="comparar" className="py-24 bg-[#0a111a] relative">
            <div className="container mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                            Compara <span className="text-[#00D4AA]">Modelos</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl text-lg">
                            Elige hasta 3 vehículos y descubre cuál es el ideal para ti. Analiza especificaciones, rendimiento y precio en detalle.
                        </p>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Compartir Comparación</span>
                    </button>
                </div>

                {/* Main Comparison Area */}
                <div className="w-full">

                    {/* Top Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {selectedModels.map((model, index) => (
                            <div key={`slot-${index}`} className="relative">
                                {model ? (
                                    // Tarjeta de Vehículo Seleccionado
                                    <div className="relative rounded-2xl overflow-hidden bg-slate-800/50 border border-white/10 aspect-[4/3] flex items-end p-6 group">

                                        {/* Botón Eliminar */}
                                        <button
                                            onClick={() => handleRemoveModel(index)}
                                            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-red-500/80 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10"
                                            aria-label="Remover vehículo"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        {/* Imagen de Fondo */}
                                        <Image
                                            src={model.image}
                                            alt={model.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a111a] via-[#0a111a]/60 to-transparent" />

                                        {/* Contenido Textual */}
                                        <div className="relative z-10 w-full">
                                            <span className="inline-block bg-[#00D4AA] text-[#0a111a] text-[10px] font-black px-2 py-1 rounded mb-2 uppercase tracking-wider">
                                                Seleccionado
                                            </span>
                                            <h3 className="text-2xl font-bold text-white leading-tight">
                                                {model.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm mt-1">
                                                {model.type}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    // Tarjeta Vacía / Agregar Vehículo
                                    <button
                                        onClick={() => setIsSelectingForSlot(index)}
                                        className="w-full h-full min-h-[250px] rounded-2xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-4 transition-all duration-300 group aspect-[4/3]"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-[#00D4AA]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Plus className="w-6 h-6 text-[#00D4AA]" />
                                        </div>
                                        <span className="text-gray-400 font-medium group-hover:text-white transition-colors">
                                            Agregar Vehículo
                                        </span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Specifications Table */}
                    <div className="bg-[#111827] rounded-3xl border border-white/10 overflow-hidden">

                        {/* Headers (Solo Desktop, móvil se esconde para simplificar si es necesario) */}
                        <div className="grid grid-cols-4 border-b border-white/10 bg-slate-800/30 p-6 hidden md:grid">
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Especificaciones</div>
                            {selectedModels.map((model, i) => (
                                <div key={`head-${i}`} className="text-sm font-bold text-white px-4">
                                    {model ? model.name : '--'}
                                </div>
                            ))}
                        </div>

                        {/* Filas de Datos */}
                        <div className="divide-y divide-white/5">
                            {SPEC_KEYS.map((spec, rowIndex) => (
                                <div key={spec.key} className="grid grid-cols-1 md:grid-cols-4 p-6 hover:bg-white/[0.02] transition-colors">
                                    <div className="text-sm font-medium text-[#00D4AA] mb-2 md:mb-0 flex items-center">
                                        {spec.label}
                                    </div>

                                    {selectedModels.map((model, colIndex) => (
                                        <div key={`${spec.key}-${colIndex}`} className="text-sm text-gray-300 px-0 md:px-4 py-1 md:py-0 font-medium whitespace-pre-line">
                                            {/* Si es móvil, mostramos el nombre del carro arriba del valor solo si hay carro seleccionado */}
                                            <span className="md:hidden text-xs text-gray-500 mb-1 block">
                                                {model ? model.name : `Vehículo ${colIndex + 1}`}
                                            </span>

                                            {model
                                                ? (spec.key === 'price' ? model.price : model?.specs?.[spec.key as keyof VehicleModel['specs']] ?? '--')
                                                : '--'}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom CTA Section */}
                <div className="mt-32 relative text-center">
                    {/* Resplandor Verde de fondo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-[#00D4AA] opacity-[0.08] blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            ¿Ya tienes tu favorito?
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                            Obtén una cotización personalizada con las mejores tasas de financiamiento para vehículos eléctricos del mercado.
                        </p>

                        {validModels.length === 0 ? (
                            <button disabled className="inline-flex items-center gap-3 bg-white/5 text-gray-400 font-black px-8 py-4 rounded-full cursor-not-allowed border border-white/10">
                                <span>Selecciona un vehículo</span>
                            </button>
                        ) : hasMultipleModels ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="inline-flex items-center gap-3 bg-[#00D4AA] hover:bg-[#00B38F] text-[#0A0F1C] font-black px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(0,212,170,0.3)] hover:shadow-[0_0_40px_rgba(0,212,170,0.5)]"
                                >
                                    <span>Seleccionar Modelo y Cotizar</span>
                                    <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50"
                                        >
                                            <div className="px-4 py-2 border-b border-white/5 mb-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Elige para cotizar</span>
                                            </div>
                                            {validModels.map(model => (
                                                <Link
                                                    key={model.id}
                                                    href={`/cotizar?model=${model.id}`}
                                                    className="w-full text-left px-4 py-3 text-sm font-bold text-white hover:bg-[#00D4AA]/10 hover:text-[#00D4AA] transition-colors flex items-center justify-between group"
                                                >
                                                    {model.name}
                                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            // Solo 1 modelo seleccionado
                            <Link
                                href={`/cotizar?model=${validModels[0]!.id}`}
                                className="inline-flex items-center gap-3 bg-[#00D4AA] hover:bg-[#00B38F] text-[#0A0F1C] font-black px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(0,212,170,0.3)] hover:shadow-[0_0_40px_rgba(0,212,170,0.5)]"
                            >
                                <span>Cotizar {validModels[0]!.name}</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                </div>

            </div>

            {/* Modal de Selección (Simple y funcional para esta iteración) */}
            <AnimatePresence>
                {isSelectingForSlot !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsSelectingForSlot(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-white/10 rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white">Seleccionar Vehículo</h3>
                                <button
                                    onClick={() => setIsSelectingForSlot(null)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {availableModels.map(model => (
                                    <button
                                        key={model.id}
                                        onClick={() => handleSelectModel(model, isSelectingForSlot)}
                                        className="group relative flex flex-col items-start p-4 rounded-xl border border-white/10 bg-slate-800/50 hover:bg-slate-800 hover:border-[#00D4AA]/50 transition-all text-left"
                                        // Deshabilitar si ya está seleccionado en otro slot
                                        disabled={selectedModels.some(m => m?.id === model.id)}
                                    >
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 border border-white/5">
                                            <Image
                                                src={model.image}
                                                alt={model.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Overlay si ya está seleccionado */}
                                            {selectedModels.some(m => m?.id === model.id) && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                                                    <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                                                        Ya Seleccionado
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="text-white font-bold mb-1">{model.name}</h4>
                                        <p className="text-sm font-medium text-[#00D4AA]">{model.price}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}
