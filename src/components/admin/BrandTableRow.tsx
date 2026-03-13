import React from 'react';
import Image from 'next/image';
import { Edit2, Ban, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { Brand } from '@/types/inventory';

interface BrandTableRowProps {
    brand: Brand;
    onEdit: (brand: Brand) => void;
    onDeactivate: (id: string) => Promise<void>;
    onReactivate: (id: string) => Promise<void>;
}

export function BrandTableRow({ brand, onEdit, onDeactivate, onReactivate }: BrandTableRowProps) {
    return (
        <tr className={`hover:bg-slate-800/40 transition-colors group ${!brand.active ? 'opacity-60' : ''}`}>
            <td className="p-4 pl-6">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-16 bg-slate-800 rounded-lg overflow-hidden relative shrink-0 border border-slate-700/50 flex items-center justify-center">
                        {brand.logo_url ? (
                            <Image
                                src={brand.logo_url}
                                alt={brand.name}
                                fill
                                className={`object-cover ${!brand.active ? 'grayscale' : ''}`}
                                sizes="64px"
                            />
                        ) : (
                            <ImageIcon className="text-slate-500" />
                        )}
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className={`font-semibold ${brand.active ? 'text-slate-100' : 'text-slate-400'}`}>{brand.name}</div>
                        <div className="text-slate-500 text-xs mt-0.5">Slug: {brand.slug}</div>
                    </div>
                </div>
            </td>
            <td className={`p-4 ${brand.active ? 'text-slate-300' : 'text-slate-500'}`}>
                {brand.country || 'No especificado'}
            </td>
            <td className="p-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${brand.active
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                    {brand.active ? 'Activa' : 'Inactiva'}
                </span>
            </td>
            <td className="p-4 text-right pr-6 align-middle">
                <div className="flex items-center justify-end gap-2 text-slate-400">
                    <button
                        onClick={() => onEdit(brand)}
                        className="p-2 hover:text-[#10B981] hover:bg-[#10B981]/10 rounded-md transition-all"
                        title="Editar Marca"
                    >
                        <Edit2 size={16} />
                    </button>
                    {brand.active ? (
                        <button 
                            onClick={() => onDeactivate(brand.id)}
                            className="p-2 hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-all" 
                            title="Desactivar Marca"
                        >
                            <Ban size={16} />
                        </button>
                    ) : (
                        <button 
                            onClick={() => onReactivate(brand.id)}
                            className="p-2 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-md transition-all" 
                            title="Reactivar Marca"
                        >
                            <RefreshCw size={16} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}
