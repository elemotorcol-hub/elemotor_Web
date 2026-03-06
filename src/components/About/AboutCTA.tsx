import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ArrowLeftRight, CreditCard } from 'lucide-react';

export function AboutCTA() {
    return (
        <section className="container mx-auto px-6 mb-24">
            <div className="bg-[#00D4AA] rounded-[3rem] p-8 lg:p-20 text-center flex flex-col items-center">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-8 md:mb-10 max-w-2xl">
                    ¿Listo para conocer tu próximo vehículo?
                </h2>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <Link href="/modelos" className="w-full sm:w-auto">
                        <Button
                            size="lg"
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 md:px-10 py-6 md:py-7 w-full min-w-[220px] flex items-center justify-center gap-2"
                        >
                            <ArrowLeftRight className="w-5 h-5" />
                            EXPLORAR MODELOS
                        </Button>
                    </Link>
                    <Link href="#cotizar" className="w-full sm:w-auto">
                        <Button
                            size="lg"
                            variant="ghost"
                            className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold px-8 md:px-10 py-6 md:py-7 w-full min-w-[220px] flex items-center justify-center gap-2 transition-all"
                        >
                            <CreditCard className="w-5 h-5" />
                            SOLICITAR COTIZACIÓN
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
