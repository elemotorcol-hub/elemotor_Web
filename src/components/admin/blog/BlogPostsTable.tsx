'use client';

import { PostSummary } from '@/services/blog.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2, Trash2, Eye, EyeOff, PlusCircle } from 'lucide-react';

interface Props {
    posts: PostSummary[];
    onEdit: (post: PostSummary) => void;
    onDelete: (post: PostSummary) => void;
    onNew: () => void;
    isLoading: boolean;
}

export function BlogPostsTable({ posts, onEdit, onDelete, onNew, isLoading }: Props) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Blog</h1>
                    <p className="text-slate-400 text-sm mt-1">Gestiona las entradas del blog.</p>
                </div>
                <button
                    onClick={onNew}
                    className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold rounded-lg transition-colors"
                >
                    <PlusCircle size={16} />
                    Nueva Entrada
                </button>
            </div>

            <div className="bg-[#0E1A17] border border-white/5 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <p>No hay entradas todavía.</p>
                        <button onClick={onNew} className="mt-4 text-[#10B981] hover:underline text-sm">
                            Crear primera entrada
                        </button>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="text-left px-6 py-4">Título</th>
                                <th className="text-left px-6 py-4 hidden md:table-cell">Autor</th>
                                <th className="text-left px-6 py-4 hidden lg:table-cell">Fecha</th>
                                <th className="text-left px-6 py-4">Estado</th>
                                <th className="text-right px-6 py-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-white font-medium line-clamp-1">{post.title}</p>
                                        <p className="text-slate-500 text-xs mt-0.5">/blog/{post.slug}</p>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell text-slate-400">
                                        {post.author.name}
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell text-slate-400">
                                        {format(new Date(post.createdAt), "d MMM yyyy", { locale: es })}
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.status === 'published' ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                                                <Eye size={11} /> Publicado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-400/10 px-2.5 py-1 rounded-full">
                                                <EyeOff size={11} /> Borrador
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(post)}
                                                className="p-1.5 text-slate-400 hover:text-[#10B981] hover:bg-[#10B981]/10 rounded-lg transition-all"
                                                title="Editar"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(post)}
                                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
