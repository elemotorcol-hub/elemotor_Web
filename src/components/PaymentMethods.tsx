'use client';

const BANKS = [
    { name: 'Banco de Bogotá', bg: '#003087', text: '#FFFFFF', accent: '#1a4fa0' },
    { name: 'Bancolombia',     bg: '#FFD100', text: '#003366', accent: '#e6bc00' },
    { name: 'Sufi',            bg: '#00A859', text: '#FFFFFF', accent: '#008a47' },
    { name: 'BBVA',            bg: '#004481', text: '#FFFFFF', accent: '#1a5a9a' },
];

// Stacked (resting) transforms
const STACKED: string[] = [
    'rotate(-8deg) translate(-8px, 4px)',
    'rotate(-3deg) translate(-3px, 2px)',
    'rotate(3deg) translate(3px, 2px)',
    'rotate(8deg) translate(8px, 4px)',
];

// Fanned (hover) transforms — spread horizontally
const FANNED: string[] = [
    'rotate(-15deg) translateX(-140px)',
    'rotate(-5deg) translateX(-47px)',
    'rotate(5deg) translateX(47px)',
    'rotate(15deg) translateX(140px)',
];

interface Props {
    variant: 'section' | 'inline';
}

export function PaymentMethods({ variant }: Props) {
    const isSection = variant === 'section';

    const deck = (
        /*
         * The group container triggers the CSS sibling trick via group-hover.
         * Tailwind cannot generate arbitrary transform values dynamically,
         * so we use inline style for the actual transforms and rely only on
         * Tailwind for the transition and z-index utilities.
         */
        <div
            className="group relative"
            style={{ width: '320px', height: '280px' }}
        >
            {BANKS.map((bank, i) => (
                <div
                    key={bank.name}
                    className="absolute top-0 left-0 w-64 h-40 rounded-2xl select-none"
                    style={{
                        backgroundColor: bank.bg,
                        color: bank.text,
                        zIndex: i + 1,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
                        transform: STACKED[i],
                        transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                    onMouseEnter={(e) => {
                        const parent = (e.currentTarget as HTMLElement).parentElement;
                        if (!parent) return;
                        const cards = parent.querySelectorAll<HTMLElement>(':scope > div');
                        cards.forEach((card, idx) => {
                            card.style.transform = FANNED[idx];
                        });
                    }}
                    onMouseLeave={(e) => {
                        const parent = (e.currentTarget as HTMLElement).parentElement;
                        if (!parent) return;
                        const cards = parent.querySelectorAll<HTMLElement>(':scope > div');
                        cards.forEach((card, idx) => {
                            card.style.transform = STACKED[idx];
                        });
                    }}
                >
                    {/* Card surface */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        {/* Subtle gradient overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(135deg, ${bank.accent}66 0%, transparent 60%)`,
                            }}
                        />
                        {/* Decorative circle */}
                        <div
                            className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-20"
                            style={{ backgroundColor: bank.text }}
                        />
                        <div
                            className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full opacity-10"
                            style={{ backgroundColor: bank.text }}
                        />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-5">
                        <span
                            className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60"
                        >
                            Convenio activo
                        </span>
                        <span className="font-black text-xl leading-tight">
                            {bank.name}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );

    if (!isSection) {
        return (
            <div className="py-12 px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold text-white mb-2">Financiamiento disponible</h2>
                        <p className="text-slate-400 text-sm mb-1">
                            Convenios con los principales bancos del país.
                        </p>
                        <p className="text-slate-600 text-xs">
                            Consulta condiciones con tu asesor Elemotor.
                        </p>
                    </div>
                    <div className="shrink-0 flex items-center justify-center" style={{ minWidth: '320px', minHeight: '280px' }}>
                        {deck}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="bg-[#060B14] py-24 px-6 overflow-hidden">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">

                {/* Left: text */}
                <div className="flex-1 min-w-0">
                    <p className="text-[#00D4AA] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                        Financiamiento
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
                        Financiamiento<br />disponible
                    </h2>
                    <p className="text-slate-400 text-base leading-relaxed mb-6 max-w-sm">
                        Tenemos convenios con los principales bancos del país para facilitar tu compra.
                        Tasas competitivas y plazos flexibles.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                        {BANKS.map((bank) => (
                            <span
                                key={bank.name}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/10 text-slate-300"
                            >
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: bank.bg === '#FFD100' ? bank.bg : bank.bg }}
                                />
                                {bank.name}
                            </span>
                        ))}
                    </div>
                    <p className="text-slate-600 text-xs">
                        * Consulta condiciones y requisitos con tu asesor Elemotor.
                    </p>
                </div>

                {/* Right: card deck */}
                <div className="shrink-0 flex items-center justify-center" style={{ minWidth: '340px', minHeight: '300px' }}>
                    {deck}
                </div>

            </div>
        </section>
    );
}
