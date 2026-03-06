import * as React from 'react';
import Image from 'next/image';
import { Linkedin, Mail } from 'lucide-react';

interface TeamMember {
    name: string;
    role: string;
    image: string;
}

const team: TeamMember[] = [
    {
        name: 'Alejandro Suarez',
        role: 'CEO & FOUNDER',
        image: '/team/alejo.jpg',
    },
    {
        name: 'Elena Martinez',
        role: 'DIR. LOGÍSTICA',
        image: '/team/elena.jpg',
    },
    {
        name: 'Ricardo Gómez',
        role: 'ASESOR COMERCIAL',
        image: '/team/ricardo.jpg',
    },
    {
        name: 'Claudia Torres',
        role: 'ATENCIÓN POST-VENTA',
        image: '/team/claudia.jpg',
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
                        <div key={index} className="bg-slate-800/30 border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center group hover:bg-slate-800/50 transition-colors">
                            <div className="relative w-32 h-32 mb-6">
                                {/* Image Placeholder with fallback to a colored circle if file doesn't exist yet */}
                                <div className="absolute inset-0 rounded-full bg-slate-700 overflow-hidden border-2 border-[#00D4AA]/20 group-hover:border-[#00D4AA] transition-colors">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100"
                                        sizes="(max-width: 768px) 128px, 128px"
                                    />
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">
                                {member.name}
                            </h3>
                            <p className="text-[#00D4AA] text-[10px] font-black tracking-widest uppercase mb-6">
                                {member.role}
                            </p>

                            <div className="flex gap-4">
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <Mail className="w-4 h-4" />
                                </button>
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
