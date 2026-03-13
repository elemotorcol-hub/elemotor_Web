'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Fuel, Zap, Leaf, Wrench, BadgeDollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Models mock for the selector
const ELEMOTOR_MODELS = [
    { id: 'gt', name: 'Elemotor Sport GT', efficiency: 6.5 },
    { id: 'suv', name: 'Elemotor E-SUV', efficiency: 5.8 },
    { id: 'sedan', name: 'Elemotor Sedan Pro', efficiency: 7.2 },
];

export function SavingsCalculator() {
    // Current Vehicle State (Gasoline)
    const [monthlyKm, setMonthlyKm] = useState<number>(1500);
    const [fuelConsumption, setFuelConsumption] = useState<number>(40); // km/gal
    const [fuelPrice, setFuelPrice] = useState<number>(16000); // COP

    // EV State (Elemotor)
    const [selectedModelId, setSelectedModelId] = useState<string>('gt');
    const [electricityPrice, setElectricityPrice] = useState<number>(850); // COP / kWh

    const handleNumberValidation = (
        value: string,
        setter: React.Dispatch<React.SetStateAction<number>>,
        maxLimit: number,
        fieldName: string
    ) => {
        const numValue = Number(value);
        if (numValue < 0) {
            alert(`El valor de ${fieldName} no puede ser negativo.`);
            return;
        }
        if (numValue > maxLimit) {
            alert(`El valor de ${fieldName} no puede ser mayor a ${new Intl.NumberFormat('es-CO').format(maxLimit)}.`);
            return;
        }
        setter(numValue);
    };

    const selectedModel = useMemo(() => {
        return ELEMOTOR_MODELS.find(m => m.id === selectedModelId) || ELEMOTOR_MODELS[0];
    }, [selectedModelId]);

    // Calculate Costs
    const gasolineMonthlyCost = useMemo(() => {
        return (monthlyKm / fuelConsumption) * fuelPrice;
    }, [monthlyKm, fuelConsumption, fuelPrice]);

    const electricMonthlyCost = useMemo(() => {
        return (monthlyKm / selectedModel.efficiency) * electricityPrice;
    }, [monthlyKm, selectedModel.efficiency, electricityPrice]);

    // Calculate Savings
    const monthlySavings = Math.max(0, gasolineMonthlyCost - electricMonthlyCost);
    const annualSavings = monthlySavings * 12;

    // Formatting utilities
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Calculate progress bar percentages
    const maxCost = Math.max(gasolineMonthlyCost, electricMonthlyCost, 1);
    const gasPercentage = (gasolineMonthlyCost / maxCost) * 100;
    const evPercentage = (electricMonthlyCost / maxCost) * 100;
    const savingsPercentage = gasolineMonthlyCost > 0
        ? Math.round(((gasolineMonthlyCost - electricMonthlyCost) / gasolineMonthlyCost) * 100)
        : 0;

    return (
        <section className="w-full bg-[#050B09] py-16 md:py-24 font-sans relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex items-center bg-slate-900/50 rounded-full px-3 py-1.5 border border-white/5">
                            <Fuel className="w-4 h-4 text-red-400" />
                            <ArrowRight className="w-3 h-3 text-slate-500 mx-2" />
                            <Zap className="w-4 h-4 text-[#00D4AA]" />
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
                        Calculadora de <span className="text-[#00D4AA]">Ahorro</span>
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Descubre cuánto puedes ahorrar al cambiarte a la movilidad eléctrica comparando tu vehículo actual con un Elemotor.
                    </p>
                </div>

                {/* Main Cards Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                    {/* --- Gasolina Card --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#0A110F] border border-red-900/30 rounded-2xl p-6 md:p-8 relative overflow-hidden group shadow-[0_0_30px_rgba(220,38,38,0.02)]"
                    >
                        {/* Red Top Accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900/50" />

                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-red-950/50 flex items-center justify-center border border-red-900/50">
                                <Fuel className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Tu Vehículo Actual</h3>
                                <p className="text-xs font-bold text-red-500 tracking-wider">GASOLINA</p>
                            </div>
                        </div>

                        {/* Slider: Kilometers */}
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-4">
                                <label className="text-sm font-semibold text-slate-300">Kilómetros al mes</label>
                                <div className="text-2xl font-bold text-white">
                                    {new Intl.NumberFormat('es-CO').format(monthlyKm)} <span className="text-sm text-slate-500 font-medium">km</span>
                                </div>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="5000"
                                step="100"
                                value={monthlyKm}
                                onChange={(e) => setMonthlyKm(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400"
                            />
                            <div className="flex justify-between text-[10px] text-slate-600 font-medium mt-2">
                                <span>100 km</span>
                                <span>5,000 km</span>
                            </div>
                        </div>

                        {/* Inputs: Consumo & Precio */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div>
                                <label className="text-xs font-semibold text-slate-400 block mb-2">Consumo</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="200"
                                        value={fuelConsumption}
                                        onChange={(e) => handleNumberValidation(e.target.value, setFuelConsumption, 200, "Consumo")}
                                        className="w-full bg-[#15201D] border border-slate-800 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">km/gal</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 block mb-2">Precio Galón</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max="50000"
                                        value={fuelPrice}
                                        onChange={(e) => handleNumberValidation(e.target.value, setFuelPrice, 50000, "Precio Galón")}
                                        className="w-full bg-[#15201D] border border-slate-800 rounded-lg pl-8 pr-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">COP</span>
                                </div>
                            </div>
                        </div>

                        {/* Result Box */}
                        <div className="bg-[#1a0f11] border border-red-900/30 rounded-xl p-6 text-center">
                            <p className="text-[11px] font-bold text-red-500 tracking-widest uppercase mb-1">Gasto Mensual Estimado</p>
                            <div className="text-4xl font-extrabold text-red-500">
                                {formatCurrency(gasolineMonthlyCost)} <span className="text-sm text-red-500/60 font-medium">COP</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- Eléctrico Card --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#0A110F] border border-[#00D4AA]/30 rounded-2xl p-6 md:p-8 relative overflow-hidden group shadow-[0_0_40px_rgba(0,212,170,0.03)]"
                    >
                        {/* Teal Top Accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00D4AA] to-emerald-900/50" />

                        {/* Glow effect right */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4AA]/10 rounded-full blur-[80px] pointer-events-none" />

                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-teal-950/50 flex items-center justify-center border border-teal-900/50">
                                <Zap className="w-5 h-5 text-[#00D4AA]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Tu Nuevo Elemotor</h3>
                                <p className="text-xs font-bold text-[#00D4AA] tracking-wider">ELÉCTRICO</p>
                            </div>
                        </div>

                        {/* Selector de Modelo */}
                        <div className="mb-8 relative z-10">
                            <label className="text-xs font-semibold text-slate-400 block mb-2">Modelo Elemotor</label>
                            <select
                                value={selectedModelId}
                                onChange={(e) => setSelectedModelId(e.target.value)}
                                className="w-full bg-[#15201D] border border-slate-800 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00D4AA]/50 transition-colors appearance-none cursor-pointer"
                            >
                                {ELEMOTOR_MODELS.map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Inputs: Costo Electricidad & Eficiencia */}
                        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                            <div>
                                <label className="text-xs font-semibold text-slate-400 block mb-2">Costo Electricidad</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5000"
                                        value={electricityPrice}
                                        onChange={(e) => handleNumberValidation(e.target.value, setElectricityPrice, 5000, "Costo Electricidad")}
                                        className="w-full bg-[#15201D] border border-slate-800 rounded-lg pl-8 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">/kWh</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 block mb-2">Eficiencia</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        readOnly
                                        value={selectedModel.efficiency}
                                        className="w-full bg-[#15201D] opacity-80 border border-slate-800 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">km/kWh</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar Comparison */}
                        <div className="mb-8 relative z-10">
                            <div className="flex justify-between text-[10px] font-bold mb-2">
                                <span className="text-red-500">Gasolina</span>
                                <span className="text-[#00D4AA]">Eléctrico</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex relative">
                                {/* Base red bar */}
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-red-500/40 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${gasPercentage}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                                {/* Overlay teal bar */}
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-[#00D4AA] rounded-full z-10 shadow-[0_0_10px_#00D4AA]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${evPercentage}%` }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                />
                            </div>
                            <div className="text-right mt-2 text-[10px] text-slate-400 font-medium">
                                ~{savingsPercentage}% menos costo operativo
                            </div>
                        </div>

                        {/* Result Box */}
                        <div className="bg-[#0b1a16] border border-[#00D4AA]/30 rounded-xl p-6 text-center relative z-10">
                            <p className="text-[11px] font-bold text-[#00D4AA] tracking-widest uppercase mb-1">Gasto Mensual Estimado</p>
                            <div className="text-4xl font-extrabold text-[#00D4AA]">
                                {formatCurrency(electricMonthlyCost)} <span className="text-sm text-[#00D4AA]/60 font-medium">COP</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- Ahorro Potencial Full Width Card --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0A110F] border border-white/5 rounded-2xl p-6 md:p-10 mb-8 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    <div className="flex-1 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6">Tu Ahorro Potencial</h3>
                            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                                <div>
                                    <p className="text-sm font-semibold text-slate-400 mb-1">Ahorro Mensual</p>
                                    <p className="text-3xl font-bold text-white">{formatCurrency(monthlySavings)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[#00D4AA] mb-1 flex items-center gap-2">
                                        <Zap className="w-3.5 h-3.5" /> Ahorro Anual
                                    </p>
                                    <p className="text-4xl font-extrabold text-[#00D4AA] drop-shadow-[0_0_15px_rgba(0,212,170,0.3)]">
                                        {formatCurrency(annualSavings)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-3 text-center md:text-right">
                            <p className="text-[10px] text-slate-500">
                                *Cálculos estimados basados en promedios del mercado.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* --- Beneficios Extras --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#0A110F] border border-white/5 rounded-xl p-6 hover:bg-[#0f1715] transition-colors">
                        <div className="w-10 h-10 rounded-full bg-emerald-950/50 flex items-center justify-center mb-4">
                            <Leaf className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-2">Cero Emisiones</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Contribuye al planeta reduciendo tu huella de carbono a cero mientras conduces.
                        </p>
                    </div>

                    <div className="bg-[#0A110F] border border-white/5 rounded-xl p-6 hover:bg-[#0f1715] transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-950/50 flex items-center justify-center mb-4">
                            <Wrench className="w-5 h-5 text-blue-500" />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-2">Menor Mantenimiento</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Olvídate de cambios de aceite y filtros. Los motores eléctricos tienen menos piezas móviles.
                        </p>
                    </div>

                    <div className="bg-[#0A110F] border border-white/5 rounded-xl p-6 hover:bg-[#0f1715] transition-colors">
                        <div className="w-10 h-10 rounded-full bg-cyan-950/50 flex items-center justify-center mb-4">
                            <BadgeDollarSign className="w-5 h-5 text-cyan-500" />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-2">Beneficios Tributarios</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Accede a descuentos en impuestos y exenciones de pico y placa en ciudades principales.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}

