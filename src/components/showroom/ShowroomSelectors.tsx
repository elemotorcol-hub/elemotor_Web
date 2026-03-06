import { COLORS, TRIMS, type ColorKey, type TrimKey } from '@/config/showroom';

interface TrimSelectorProps {
    activeTrim: TrimKey;
    onSelect: (trim: TrimKey) => void;
}

export function TrimSelector({ activeTrim, onSelect }: TrimSelectorProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {(Object.entries(TRIMS) as [TrimKey, typeof TRIMS[TrimKey]][]).map(([key, trim]) => (
                <button
                    key={key}
                    onClick={() => onSelect(key)}
                    className={`text-left p-3 rounded-xl border transition-all ${activeTrim === key
                            ? 'border-emerald-500 bg-emerald-950/40'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                >
                    <p className={`text-sm font-bold ${activeTrim === key ? 'text-emerald-400' : 'text-white'}`}>
                        {trim.name}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{trim.sub}</p>
                </button>
            ))}
        </div>
    );
}

interface ColorSelectorProps {
    activeColor: ColorKey;
    onSelect: (color: ColorKey) => void;
}

export function ColorSelector({ activeColor, onSelect }: ColorSelectorProps) {
    return (
        <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 mb-3">EXTERIOR COLOR</p>
            <div className="flex gap-3">
                {(Object.entries(COLORS) as [ColorKey, typeof COLORS[ColorKey]][]).map(([key, { tw, label }]) => (
                    <button
                        key={key}
                        onClick={() => onSelect(key)}
                        title={label}
                        aria-label={`Seleccionar color ${label}`}
                        className={`w-9 h-9 rounded-full ${tw} transition-all duration-200 ${activeColor === key
                                ? 'ring-2 ring-offset-2 ring-offset-[#0A110F] ring-emerald-400 scale-110'
                                : 'opacity-70 hover:opacity-100 hover:scale-105'
                            }`}
                    />
                ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">{COLORS[activeColor].label}</p>
        </div>
    );
}
