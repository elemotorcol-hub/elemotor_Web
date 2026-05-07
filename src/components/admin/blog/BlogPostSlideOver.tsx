'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { blogAdminService, PostSummary, PostDetail, CreatePostData } from '@/services/blog.service';
import { RichTextEditor } from './RichTextEditor';
import Image from 'next/image';

interface Props {
    post: PostSummary | null; // null = nuevo
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

const EMPTY: CreatePostData = {
    slug: '', title: '', excerpt: '', content: '', coverUrl: '', coverPublicId: '', status: 'draft',
};

export function BlogPostSlideOver({ post, open, onClose, onSaved }: Props) {
    const [form, setForm] = useState<CreatePostData>(EMPTY);
    const [detail, setDetail] = useState<PostDetail | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [slugManual, setSlugManual] = useState(false);

    useEffect(() => {
        if (!open) return;
        setError('');
        setSlugManual(false);
        if (post) {
            blogAdminService.findOne(post.id).then((d) => {
                setDetail(d);
                setForm({
                    slug: d.slug,
                    title: d.title,
                    excerpt: d.excerpt ?? '',
                    content: d.content,
                    coverUrl: d.coverUrl ?? '',
                    coverPublicId: d.coverPublicId ?? '',
                    status: d.status,
                });
            });
        } else {
            setDetail(null);
            setForm(EMPTY);
        }
    }, [open, post]);

    const handleTitleChange = (title: string) => {
        setForm((f) => ({
            ...f,
            title,
            slug: slugManual ? f.slug : slugify(title),
        }));
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const { publicUrl, publicId } = await blogAdminService.uploadCover(file);
            setForm((f) => ({ ...f, coverUrl: publicUrl, coverPublicId: publicId }));
        } catch {
            setError('Error al subir la imagen de portada');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
            setError('Título, slug y contenido son obligatorios.');
            return;
        }
        setIsSaving(true);
        setError('');
        try {
            if (post) {
                await blogAdminService.update(post.id, form);
            } else {
                await blogAdminService.create(form);
            }
            onSaved();
            onClose();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error al guardar el post';
            setError(msg);
        } finally {
            setIsSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative ml-auto w-full max-w-3xl h-full bg-[#0A1410] border-l border-white/10 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
                    <h2 className="text-white font-bold text-lg">
                        {post ? 'Editar entrada' : 'Nueva entrada'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

                        {/* Título */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Título *
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Título del artículo"
                                className="w-full bg-[#0E1A17] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#10B981]/50"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Slug (URL) *
                            </label>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => { setSlugManual(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
                                placeholder="mi-articulo"
                                className="w-full bg-[#0E1A17] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#10B981]/50"
                            />
                            <p className="text-slate-500 text-xs mt-1">elemotor.com.co/blog/<span className="text-slate-300">{form.slug || '...'}</span></p>
                        </div>

                        {/* Extracto */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Extracto
                            </label>
                            <textarea
                                value={form.excerpt}
                                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                                rows={2}
                                placeholder="Breve descripción para el listado..."
                                className="w-full bg-[#0E1A17] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-[#10B981]/50"
                            />
                        </div>

                        {/* Portada */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Imagen de portada
                            </label>
                            {form.coverUrl ? (
                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 mb-2">
                                    <Image src={form.coverUrl} alt="Portada" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, coverUrl: '', coverPublicId: '' }))}
                                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-red-500/80 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center border border-dashed border-white/20 rounded-xl py-8 cursor-pointer hover:border-[#10B981]/50 transition-colors">
                                    {isUploading ? (
                                        <Loader2 size={24} className="text-[#10B981] animate-spin" />
                                    ) : (
                                        <>
                                            <Upload size={24} className="text-slate-400 mb-2" />
                                            <span className="text-slate-400 text-sm">Subir imagen de portada</span>
                                            <span className="text-slate-600 text-xs mt-1">JPG, PNG, WEBP — máx. 5 MB</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={isUploading} />
                                </label>
                            )}
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Estado
                            </label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'draft' | 'published' }))}
                                className="bg-[#0E1A17] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#10B981]/50"
                            >
                                <option value="draft">Borrador</option>
                                <option value="published">Publicado</option>
                            </select>
                        </div>

                        {/* Contenido */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Contenido *
                            </label>
                            <RichTextEditor
                                value={form.content}
                                onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{error}</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-white/10 shrink-0 flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-white/10 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                        >
                            {isSaving && <Loader2 size={14} className="animate-spin" />}
                            {post ? 'Guardar cambios' : 'Publicar entrada'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
