import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const contactData: Record<string, {
    address: string;
    city: string;
    phones: string[];
    emails: string[];
    mapSrc: string;
}> = {
    CO: {
        address: 'Ak 27 #55-16',
        city: 'Bucaramanga, Santander',
        phones: ['314 466 3469'],
        emails: ['comercial@elemotor.com.co'],
        mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.13867767628!2d-73.11461229999999!3d7.1099231000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e683f006f63e109%3A0x7c6503f27678a31e!2sELEMOTOR!5e0!3m2!1ses-419!2sco!4v1773678039061!5m2!1ses-419!2sco',
    },
    EC: {
        address: 'Av. Pampite y Chimborazo, Centro Plaza Local 104',
        city: 'Quito, Ecuador',
        phones: ['0991897344', '+593 98 033 1363'],
        emails: ['lorena.sanchez@elemotor.com.co', 'carlos.cadena@elemotor.com.co'],
        mapSrc: 'https://maps.google.com/maps?q=Av+Pampite+y+Chimborazo,+Centro+Plaza,+Quito,+Ecuador&output=embed',
    },
};

export function Footer() {
    const country = process.env.NEXT_PUBLIC_SITE_COUNTRY ?? 'CO';
    const contact = contactData[country] ?? contactData.CO;

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
                        <p className="text-gray-500 mb-4 leading-relaxed">
                            Líderes en importación de vehículos eléctricos de alta gama. <br />
                            Vanguardia, lujo y sostenibilidad.
                        </p>
                        <div className="mb-8 space-y-1 border-l-2 border-[#00D4AA]/40 pl-3">
                            <p className="text-white text-sm font-semibold leading-snug">Vehículos importados directamente por Elemotor.</p>
                            <p className="text-slate-400 text-sm leading-snug">No somos representantes oficiales de la marca en Colombia.</p>
                        </div>
                        <div className="flex gap-4">
                            <a
                                href="https://www.facebook.com/p/Electric-Motor-Colombia-SAS-61573094475720/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visitar nuestra página de Facebook"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#00D4AA] hover:text-slate-900 transition-all hover:border-[#00D4AA]"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.instagram.com/elemotor.co/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visitar nuestro perfil de Instagram"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#00D4AA] hover:text-slate-900 transition-all hover:border-[#00D4AA]"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.tiktok.com/@elemotor.co"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visitar nuestro perfil de TikTok"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#00D4AA] hover:text-slate-900 transition-all hover:border-[#00D4AA]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                                </svg>
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
                                    {contact.address}, <br />
                                    {contact.city}
                                </p>
                            </div>
                            {contact.phones.map((phone, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <p className="text-gray-400 text-sm">{phone}</p>
                                </div>
                            ))}
                            {contact.emails.map((email, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <p className="text-gray-400 text-sm">{email}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Col 3: Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 uppercase tracking-wider text-[#00D4AA]">Enlaces</h4>
                        <nav className="flex flex-col gap-4">
                            <Link href="/modelos" className="text-gray-400 hover:text-white transition-colors">Modelos</Link>
                            <Link href="/showroom" className="text-gray-400 hover:text-white transition-colors">Showroom 3D</Link>
                            <Link href="/calculadora" className="text-gray-400 hover:text-white transition-colors">Calculadora</Link>
                            <Link href="/nosotros" className="text-gray-400 hover:text-white transition-colors">Nosotros</Link>
                            <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
                            <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors">Términos y Condiciones</Link>
                            <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</Link>
                        </nav>
                    </div>

                    {/* Col 4: Ubicaciones */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 uppercase tracking-wider text-[#00D4AA]">Ubicación</h4>
                        <div className="flex flex-col gap-3">
                            {[
                                {
                                    name: 'EleMotor Bucaramanga',
                                    address: 'Ak 27 #55-16, Bucaramanga',
                                    href: 'https://maps.google.com/?q=ELEMOTOR,Ak+27+%2355-16,Bucaramanga,Santander,Colombia',
                                },
                                {
                                    name: 'EleMotor Barrancabermeja',
                                    address: 'Carrera 29 #48-31, Barrancabermeja',
                                    href: 'https://maps.google.com/?q=Carrera+29+%2348-31,Barrancabermeja,Santander,Colombia',
                                },
                                {
                                    name: 'EleMotor Ecuador',
                                    address: 'Av. Pampite y Chimborazo, Quito',
                                    href: 'https://maps.google.com/?q=Av+Pampite+y+Chimborazo,Centro+Plaza+Local+104,Quito,Ecuador',
                                },
                            ].map((loc) => (
                                <a
                                    key={loc.name}
                                    href={loc.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 p-3 rounded-xl border border-white/5 hover:border-[#00D4AA]/30 hover:bg-white/5 transition-all duration-300 group"
                                >
                                    <MapPin className="w-4 h-4 text-[#00D4AA] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <p className="text-white text-sm font-semibold group-hover:text-[#00D4AA] transition-colors">{loc.name}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">{loc.address}</p>
                                    </div>
                                </a>
                            ))}
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
