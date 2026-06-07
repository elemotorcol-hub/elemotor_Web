'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import type { PostSummary } from '@/services/blog.service';

interface BlogSectionProps {
    posts: PostSummary[];
}

export function BlogSection({ posts }: BlogSectionProps) {
    if (!posts.length) return null;

    return (
        <section className="py-24 bg-slate-900 border-t border-white/5 relative overflow-hidden">
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-[0.06]"
                style={{ background: 'radial-gradient(ellipse at center, #00D4AA 0%, transparent 70%)' }} />

            <div className="container mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-6"
                >
                    <div>
                        <span className="text-[#00D4AA] font-bold tracking-widest uppercase text-sm mb-3 block">Blog y Recursos</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">Últimas Noticias</h2>
                    </div>
                    <Link href="/blog" className="inline-flex items-center gap-2 border border-white/10 hover:border-[#00D4AA]/40 text-white hover:text-[#00D4AA] text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all duration-300 flex-shrink-0">
                        Ver Todos los Artículos <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.slice(0, 3).map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group"
                        >
                            <Link href={`/blog/${post.slug}`} className="block bg-[#131f1c] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full hover:border-[#00D4AA]/30 transition-colors duration-300">

                                {/* Cover image */}
                                <div className="relative aspect-[16/9] bg-[#0d1f1a] overflow-hidden">
                                    {post.coverUrl ? (
                                        <Image
                                            src={post.coverUrl}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 opacity-20"
                                                style={{ backgroundImage: 'linear-gradient(45deg, rgba(0,212,170,0.1) 1px, transparent 1px), linear-gradient(-45deg, rgba(0,212,170,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-20 h-20 rounded-full blur-2xl opacity-30" style={{ background: '#00D4AA' }} />
                                                <span className="text-[#00D4AA] text-5xl font-black opacity-10 absolute">E</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-white font-black text-lg leading-tight mb-3 group-hover:text-[#00D4AA] transition-colors duration-300">
                                        {post.title}
                                    </h3>
                                    {post.excerpt && (
                                        <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-5">{post.excerpt}</p>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{post.author?.name ?? 'Elemotor'}</span>
                                            <span className="mx-1 text-white/10">·</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <span className="text-[#00D4AA] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                            Leer más <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>

                {/* Mobile CTA */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex justify-center mt-10 md:hidden"
                >
                    <Link href="/blog" className="inline-flex items-center gap-2 border border-white/10 hover:border-[#00D4AA]/40 text-white hover:text-[#00D4AA] text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all duration-300">
                        Ver Todos los Artículos <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
