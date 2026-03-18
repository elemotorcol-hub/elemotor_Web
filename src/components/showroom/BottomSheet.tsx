'use client';

/**
 * BottomSheet.tsx
 *
 * Swipeable bottom sheet for mobile devices.
 * Shows a peek of ~70px at the bottom; user can drag up to see full panel.
 */

import { useRef, useState, useCallback, useEffect } from 'react';

interface BottomSheetProps {
    children: React.ReactNode;
}

const PEEK_HEIGHT = 72; // px always visible at bottom

export function BottomSheet({ children }: BottomSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null);
    const [sheetHeight, setSheetHeight] = useState(0); // full content height
    const [translateY, setTranslateY] = useState(0); // how much it's translated down (0 = fully open)
    const [isOpen, setIsOpen] = useState(false);
    const dragStartY = useRef<number | null>(null);
    const dragStartTranslate = useRef<number>(0);
    const [isDragging, setIsDragging] = useState(false);

    // On mount, measure the sheet and collapse it (show only peek)
    useEffect(() => {
        const el = sheetRef.current;
        if (!el) return;
        const fullH = el.scrollHeight;
        setSheetHeight(fullH);
        // Start collapsed: translate down so only PEEK_HEIGHT is visible
        setTranslateY(fullH - PEEK_HEIGHT);
    }, []);

    const getCollapsedY = useCallback(() => sheetHeight - PEEK_HEIGHT, [sheetHeight]);

    const open = useCallback(() => {
        setTranslateY(0);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setTranslateY(getCollapsedY());
        setIsOpen(false);
    }, [getCollapsedY]);

    // ── Pointer events for drag ──────────────────────────────────────────────

    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            dragStartY.current = e.clientY;
            dragStartTranslate.current = translateY;
            setIsDragging(true);
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        },
        [translateY],
    );

    const onPointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!isDragging || dragStartY.current === null) return;
            const delta = e.clientY - dragStartY.current;
            const newY = Math.max(0, Math.min(getCollapsedY(), dragStartTranslate.current + delta));
            setTranslateY(newY);
        },
        [isDragging, getCollapsedY],
    );

    const onPointerUp = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        // Snap to open or closed based on midpoint
        const mid = getCollapsedY() / 2;
        if (translateY < mid) {
            open();
        } else {
            close();
        }
    }, [isDragging, translateY, getCollapsedY, open, close]);

    return (
        <>
            {/* Backdrop overlay when open */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm"
                    onClick={close}
                />
            )}

            <div
                ref={sheetRef}
                className="fixed bottom-0 left-0 right-0 z-30 bg-[#0A110F] border-t border-white/10 rounded-t-2xl shadow-2xl"
                style={{
                    transform: sheetHeight ? `translateY(${translateY}px)` : 'translateY(100%)',
                    transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
                    maxHeight: '90vh',
                    overflowY: isOpen ? 'auto' : 'hidden',
                }}
            >
                {/* Drag Handle */}
                <div
                    className="sticky top-0 z-10 flex flex-col items-center pt-3 pb-2 bg-[#0A110F] cursor-grab select-none touch-none"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                >
                    <div className="w-10 h-1 rounded-full bg-white/20" />

                    {/* Peek label — visible when collapsed */}
                    <div className="flex items-center justify-between w-full px-5 mt-2.5">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-emerald-500/80">
                            CONFIGURAR VEHÍCULO
                        </p>
                        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                            <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                                <path d="M1 6L6 1L11 6" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Panel content */}
                <div className="px-5 py-4 space-y-6 pb-8">
                    {children}
                </div>
            </div>
        </>
    );
}
