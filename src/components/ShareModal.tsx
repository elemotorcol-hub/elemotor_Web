'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, MessageCircle } from 'lucide-react';

interface ShareModalProps {
    url: string;
    title: string;
    onClose: () => void;
}

export function ShareModal({ url, title, onClose }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            if (inputRef.current) {
                inputRef.current.select();
                document.execCommand('copy');
            }
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm bg-[#0d1f1a] border border-[#00D4AA]/20 rounded-2xl p-6 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white font-semibold text-base">Compartir</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Link input */}
                <div className="flex items-center gap-2 mb-4">
                    <input
                        ref={inputRef}
                        readOnly
                        value={url}
                        className="flex-1 bg-[#0a1612] border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm truncate focus:outline-none focus:border-[#00D4AA]/50"
                    />
                    <button
                        onClick={copyLink}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#00D4AA]/10 hover:bg-[#00D4AA]/20 border border-[#00D4AA]/30 text-[#00D4AA] text-sm font-medium transition-all shrink-0"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copiado' : 'Copiar'}
                    </button>
                </div>

                {/* WhatsApp */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 transition-all"
                >
                    <MessageCircle size={18} className="text-[#25D366]" />
                    <span className="text-white text-sm font-medium">Compartir en WhatsApp</span>
                </a>
            </div>
        </div>
    );
}
