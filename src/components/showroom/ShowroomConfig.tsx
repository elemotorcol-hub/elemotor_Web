import Link from 'next/link';
import { INTERIORS, TRIMS, type InteriorKey, type TrimKey } from '@/config/showroom';

interface SpecsGridProps {
    activeTrim: TrimKey;
}

export function SpecsGrid({ activeTrim }: SpecsGridProps) {
    const specs = TRIMS[activeTrim].specs;
    return (
        <div className="grid grid-cols-3 gap-4 py-5 border-y border-white/5">
            {specs.map(({ value, unit, label }) => (
                <div key={label} className="text-center">
                    <p className="text-white font-black text-xl leading-none">
                        {value}
                        <span className="text-emerald-400 text-xs font-bold ml-0.5">{unit}</span>
                    </p>
                    <p className="text-slate-500 text-[9px] tracking-widest font-semibold mt-1.5">{label}</p>
                </div>
            ))}
        </div>
    );
}

interface InteriorPickerProps {
    activeInterior: InteriorKey;
    onSelect: (interior: InteriorKey) => void;
}

export function InteriorPicker({ activeInterior, onSelect }: InteriorPickerProps) {
    return (
        <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 mb-3">INTERIOR FINISH</p>
            <div className="space-y-2">
                {INTERIORS.map(({ key, name, price }) => (
                    <button
                        key={key}
                        onClick={() => onSelect(key)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${activeInterior === key
                                ? 'border-emerald-500/50 bg-emerald-950/30'
                                : 'border-white/5 hover:border-white/15'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${activeInterior === key ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'
                                    }`}
                            >
                                {activeInterior === key && (
                                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 12 12">
                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-sm text-slate-300 font-medium">{name}</span>
                        </div>
                        <span className={`text-xs font-semibold flex-shrink-0 ml-2 ${price.type === 'included' ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {price.type === 'included' ? 'included' : price.amount}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

interface CTAFooterProps {
    activeTrim: TrimKey;
    border?: boolean;
}

export function CTAFooter({ activeTrim, border = true }: CTAFooterProps) {
    const { price, originalPrice, delivery } = TRIMS[activeTrim];
    return (
        <div className={`flex-shrink-0 px-5 pt-4 pb-6 bg-[#0A110F] space-y-4 ${border ? 'border-t border-white/5' : ''}`}>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-[9px] tracking-[0.2em] text-slate-500 font-semibold">ESTIMATED DELIVERY</p>
                    <p className="text-sm text-slate-300 font-semibold mt-0.5">{delivery}</p>
                </div>
                <div className="text-right">
                    <p className="text-slate-500 text-xs line-through">{originalPrice}</p>
                    <p className="text-white font-black text-2xl leading-none">{price}</p>
                </div>
            </div>
            <Link
                href="/cotizar"
                className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold text-sm tracking-widest py-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20"
            >
                COTIZAR CONFIGURACIÓN <span className="text-base">→</span>
            </Link>
            <p className="text-center text-[9px] text-slate-600 tracking-widest">PRICE INCLUDES LOCAL TAX INCENTIVES</p>
        </div>
    );
}
