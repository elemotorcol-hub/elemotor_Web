import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
    return (
        <footer id="contacto" className="bg-black text-white pt-24 pb-12 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Col 1: Logo & Social */}
                    <div>
                        <Link href="/" className="relative z-10 flex items-center group shrink-0 mb-8">
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
                            <a
                                href="#"
                                aria-label="Visitar nuestra página de Facebook"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#00D4AA] hover:text-slate-900 transition-all hover:border-[#00D4AA]"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                aria-label="Visitar nuestro perfil de Instagram"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#00D4AA] hover:text-slate-900 transition-all hover:border-[#00D4AA]"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                aria-label="Visitar nuestra cuenta de Twitter / X"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#00D4AA] hover:text-slate-900 transition-all hover:border-[#00D4AA]"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Col 2: Contact */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 uppercase tracking-wider text-[#00D4AA]">Contacto</h4>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                                <p className="text-gray-400 text-sm">
                                    Ak 27 #55-16, <br />
                                    Bucaramanga, Santander
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
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.13867767628!2d-73.11461229999999!3d7.1099231000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e683f006f63e109%3A0x7c6503f27678a31e!2sELEMOTOR!5e0!3m2!1ses-419!2sco!4v1773678039061!5m2!1ses-419!2sco"
                                width="400" height="325"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-gray-600 text-xs">
                        © 2026 ELEMOTOR. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
