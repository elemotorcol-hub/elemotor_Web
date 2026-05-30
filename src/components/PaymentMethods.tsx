const BANKS = [
    { name: 'Banco de Bogotá', bg: '#003087', text: '#FFFFFF' },
    { name: 'Bancolombia',     bg: '#FFD100', text: '#003366' },
    { name: 'Sufi',            bg: '#00A859', text: '#FFFFFF' },
    { name: 'BBVA',            bg: '#004481', text: '#FFFFFF' },
];

interface Props {
    variant: 'section' | 'inline';
}

export function PaymentMethods({ variant }: Props) {
    const isSection = variant === 'section';

    return (
        <div className={isSection ? 'bg-[#060B14] py-24 px-6' : 'py-12 px-0'}>
            <div className={`mx-auto ${isSection ? 'max-w-5xl text-center' : 'max-w-5xl'}`}>
                <h2 className={`font-bold text-white ${isSection ? 'text-3xl md:text-4xl mb-3' : 'text-2xl mb-2'}`}>
                    Financiamiento disponible
                </h2>
                <p className={`text-slate-400 ${isSection ? 'text-base mb-10' : 'text-sm mb-6'}`}>
                    Tenemos convenios con los principales bancos del país para facilitar tu compra.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {BANKS.map((bank) => (
                        <div
                            key={bank.name}
                            style={{ backgroundColor: bank.bg, color: bank.text }}
                            className="rounded-2xl p-6 flex flex-col items-center justify-center gap-2 min-h-[110px]"
                        >
                            <span className="font-bold text-lg text-center leading-tight">
                                {bank.name}
                            </span>
                            <span className="text-[11px] font-semibold uppercase tracking-widest opacity-70">
                                Convenio activo
                            </span>
                        </div>
                    ))}
                </div>

                <p className="text-slate-500 text-xs mt-5 text-center">
                    Consulta condiciones con tu asesor Elemotor.
                </p>
            </div>
        </div>
    );
}
