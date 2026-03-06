import React, { useState } from 'react';
import { ChevronDown, ChevronUp, UploadCloud } from 'lucide-react';
import { InputWithUnit } from '../ui/InputWithUnit';

export default function TrimsAndSpecsTab() {
    const [expandedTrim, setExpandedTrim] = useState<string | null>('max-premium');

    const toggleTrim = (trimId: string) => {
        setExpandedTrim(expandedTrim === trimId ? null : trimId);
    };

    return (
        <div className="flex flex-col gap-4">

            {/* Trim Item: Max Premium */}
            <div className="bg-[#1e293b]/40 border border-slate-800 rounded-xl overflow-hidden transition-all">
                {/* Header */}
                <button
                    onClick={() => toggleTrim('max-premium')}
                    className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-cyan-950/50 text-cyan-400 flex items-center justify-center font-bold text-sm border border-cyan-900">
                            MP
                        </div>
                        <div className="text-left">
                            <h4 className="text-slate-200 font-semibold">Max Premium</h4>
                            <p className="text-slate-500 text-xs mt-0.5">Top-tier configuration - AWD</p>
                        </div>
                    </div>
                    <div className="text-slate-500">
                        {expandedTrim === 'max-premium' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </button>

                {/* Expanded Content */}
                {expandedTrim === 'max-premium' && (
                    <div className="p-6 border-t border-slate-800 flex flex-col gap-8">

                        {/* Technical Specifications */}
                        <div className="flex flex-col gap-4">
                            <h5 className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Technical Specifications</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <InputWithUnit label="Range" unit="km" defaultValue="520" />
                                <InputWithUnit label="Top Speed" unit="km/h" defaultValue="200" />
                                <InputWithUnit label="0-100 km/h" unit="sec" defaultValue="3.8" />
                                <InputWithUnit label="Battery" unit="kWh" defaultValue="77.4" />
                                <InputWithUnit label="Motor Power" unit="kW" defaultValue="230" />
                                <InputWithUnit label="Torque" unit="Nm" defaultValue="360" />
                                <InputWithUnit label="Wheelbase" unit="mm" defaultValue="2900" />
                                <InputWithUnit label="Cargo Volume" unit="L" defaultValue="520" />
                            </div>
                        </div>

                        {/* Available Colors */}
                        <div className="flex flex-col gap-4">
                            <h5 className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Available Colors</h5>
                            <div className="flex items-center gap-6">

                                {/* Color: Stellar Gray */}
                                <button type="button" className="flex flex-col items-center gap-2 cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-[#52525b] border-2 border-cyan-500 ring-2 ring-cyan-500/20 transition-all"></div>
                                    <span className="text-[10px] text-slate-300 font-medium group-hover:text-cyan-400 transition-colors">Stellar Gray</span>
                                </button>

                                {/* Color: Arctic White */}
                                <button type="button" className="flex flex-col items-center gap-2 cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-[#f8fafc] border-2 border-slate-700 hover:border-slate-500 transition-all"></div>
                                    <span className="text-[10px] text-slate-500 font-medium group-hover:text-slate-300 transition-colors">Arctic White</span>
                                </button>

                                {/* Color: Obsidian Black */}
                                <button type="button" className="flex flex-col items-center gap-2 cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-[#0f172a] border-2 border-slate-700 hover:border-slate-500 transition-all"></div>
                                    <span className="text-[10px] text-slate-500 font-medium group-hover:text-slate-300 transition-colors">Obsidian Black</span>
                                </button>

                            </div>
                        </div>

                        {/* Trim Gallery */}
                        <div className="flex flex-col gap-4">
                            <h5 className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Trim Gallery</h5>
                            <div className="w-full border-2 border-dashed border-slate-700/60 rounded-xl bg-slate-900/30 hover:bg-slate-900/50 transition-colors flex flex-col items-center justify-center py-10 gap-3 cursor-pointer group">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-slate-800 transition-all">
                                    <UploadCloud size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-slate-200">Drag & drop vehicle images here</p>
                                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB each</p>
                                </div>
                                <button className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700">
                                    Browse Files
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* Trim Item: Standard Edition (Collapsed) */}
            <div className="bg-[#1e293b]/40 border border-slate-800 rounded-xl overflow-hidden transition-all">
                <button
                    onClick={() => toggleTrim('standard')}
                    className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-sm border border-slate-700">
                            SE
                        </div>
                        <div className="text-left">
                            <h4 className="text-slate-200 font-semibold">Standard Edition</h4>
                            <p className="text-slate-500 text-xs mt-0.5">Base configuration - RWD</p>
                        </div>
                    </div>
                    <div className="text-slate-500">
                        {expandedTrim === 'standard' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </button>
                {expandedTrim === 'standard' && (
                    <div className="p-6 border-t border-slate-800">
                        <p className="text-sm text-slate-500">Standard Edition Details...</p>
                    </div>
                )}
            </div>

        </div>
    );
}
