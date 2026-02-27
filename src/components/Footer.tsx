import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
    return (
        <footer id="contacto" className="bg-black text-white pt-24 pb-12 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Col 1: Logo & Social */}
                    <div>
                        <Link href="/" className="inline-block relative z-10 flex items-center group flex-shrink-0 mb-8">
                            <Image
                                src="/logo-elementor1.avif"
                                alt="EleMotor Logo"
                                width={180}
                                height={40}
                                className="h-8 md:h-10 w-auto object-contain brightness-110"
                            />
                        </Link>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Líderes en importación de vehículos eléctricos de alta gama. <br />
                            Vanguardia, lujo y sostenibilidad.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#00D4AA] hover:text-slate-900 transition-all hover:border-[#00D4AA]"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2: Contact */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 uppercase tracking-wider text-[#00D4AA]">Contacto</h4>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                                <p className="text-gray-400 text-sm">
                                    Cabecera, Bucaramanga <br />
                                    Santander, Colombia
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <p className="text-gray-400 text-sm">+57 (300) 123-4567</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <p className="text-gray-400 text-sm">info@elemotor.co</p>
                            </div>
                        </div>
                    </div>

                    {/* Col 3: Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 uppercase tracking-wider text-[#00D4AA]">Enlaces</h4>
                        <nav className="flex flex-col gap-4">
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Modelos</Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Términos y Condiciones</Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
                        </nav>
                    </div>

                    {/* Col 4: Map Placeholder */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 uppercase tracking-wider text-[#00D4AA]">Ubicación</h4>
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                            <Image
                                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000&auto=format&fit=crop"
                                alt="Mapa de ubicación"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 bg-[#00D4AA] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,212,170,0.5)] animate-pulse">
                                    <MapPin className="w-6 h-6 text-slate-900 fill-current" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-gray-600 text-xs">
                        © 2026 ELEMOTOR. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-6 opacity-30 grayscale saturate-0">
                        <span className="text-sm font-black text-white italic tracking-widest">TESLA</span>
                        <span className="text-sm font-black text-white italic tracking-widest">LUCID</span>
                        <span className="text-sm font-black text-white italic tracking-widest">LOTUS</span>
                        <span className="text-sm font-black text-white italic tracking-widest">RIVIAN</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
