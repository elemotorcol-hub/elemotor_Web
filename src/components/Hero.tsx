import Image from 'next/image';
import { Button } from '@/components/Button';

export function Hero() {
    return (
        <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <Image
                src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=2070&auto=format&fit=crop"
                alt="Vehículo eléctrico de lujo en carretera al atardecer"
                fill
                priority
                className="object-cover transition-opacity duration-1000"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+pNPQAIXwM9ov86OQAAAABJRU5ErkJggg=="
            />

            {/* Overlay - Gradient for better readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900" />

            {/* Content */}
            <div className="container relative z-10 px-6 text-center max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                    IMPORTAMOS EL VEHÍCULO <br />
                    <span className="text-[#00D4AA]">ELÉCTRICO DE TUS</span> SUEÑOS
                </h1>

                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Lujo, tecnología y sostenibilidad sin límites. <br className="hidden md:block" />
                    Traemos a Colombia la vanguardia de la movilidad global.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        size="lg"
                        className="bg-[#00D4AA] hover:bg-[#00B38F] text-slate-900 font-bold px-8 py-7 text-lg min-w-[200px]"
                    >
                        EXPLORAR MODELOS
                    </Button>
                    <Button
                        size="lg"
                        variant="ghost"
                        className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-7 text-lg min-w-[200px]"
                    >
                        VER SHOWROOM
                    </Button>
                </div>
            </div>

            {/* Bottom accent bar */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
        </section>
    );
}
