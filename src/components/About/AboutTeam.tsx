import * as React from 'react';
import Image from 'next/image';
import { Mail } from 'lucide-react';

interface TeamMember {
    name: string;
    role: string;
    email: string;
    image: string;
}

const team: TeamMember[] = [
    {
        name: 'Javier Peña',
        role: 'CEO',
        email: 'gerencia@elemotor.com.co',
        image: '/nosotros/equipo/Javier Peña.png',
    },
    {
        name: 'Fernando Buitrago',
        role: 'Director Comercial',
        email: 'comercial@elemotor.com.co',
        image: '/nosotros/equipo/Fernando Buitrago.png',
    },
    {
        name: 'Camila Jaimes',
        role: 'Analista de Operaciones',
        email: 'administracion2@elemotor.com.co',
        image: '/nosotros/equipo/Camila Jaimes.png',
    },
    {
        name: 'Catalina Blanco',
        role: 'Comercial',
        email: 'administracioncomercial@elemotor.com.co',
        image: '/nosotros/equipo/Catalina Blanco.png',
    },
    {
        name: 'Monica Torres Perez',
        role: 'Administración',
        email: 'administracion@elemotor.com.co',
        image: '/nosotros/equipo/Monica Torres Perez.png',
    },
    {
        name: 'Rafael Muñoz',
        role: 'Comercial Cundinamarca',
        email: 'comercialcundinamarca@elemotor.com.co',
        image: '/nosotros/equipo/Ricardo Muñoz.png',
    },
];

export function AboutTeam() {
    return (
        <section className="py-24 bg-slate-900 px-6">
            <div className="container mx-auto">
                <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-20 uppercase tracking-widest">
                    NUESTRO EQUIPO
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {team.map((member, index) => (
                        <div key={index} className="bg-slate-800/30 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col group hover:bg-slate-800/50 transition-colors">
                            {/* Foto */}
                            <div className="relative w-full aspect-[3/4] bg-slate-700">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                                />
                                {/* Degradado inferior suave */}
                                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-800/60 to-transparent" />
                            </div>

                            {/* Info */}
                            <div className="p-6 flex flex-col items-center text-center">
                                <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">
                                    {member.name}
                                </h3>
                                <p className="text-[#00D4AA] text-[10px] font-black tracking-widest uppercase mb-2">
                                    {member.role}
                                </p>
                                <p className="text-slate-500 text-[11px] mb-5 break-all">
                                    {member.email}
                                </p>
                                <a
                                    href={`mailto:${member.email}`}
                                    className="flex items-center gap-2 text-slate-500 hover:text-[#00D4AA] transition-colors text-xs"
                                >
                                    <Mail className="w-4 h-4" />
                                    Contactar
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
