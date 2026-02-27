'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center gap-2 mt-16 pb-16">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous Page"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                        currentPage === page
                            ? "bg-[#00D4AA] text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                            : "border border-white/10 text-slate-400 hover:text-white hover:border-white/30"
                    )}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next Page"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
