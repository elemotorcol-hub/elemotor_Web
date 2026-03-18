'use client';

/**
 * ViewerLoader.tsx
 *
 * Elegant loading screen displayed while the 3D model is being fetched.
 * Shows a vehicle silhouette SVG, an animated progress bar, and a percentage.
 * Fades out smoothly when the model finishes loading.
 */

interface ViewerLoaderProps {
    progress: number; // 0–100
    visible: boolean;
}

export function ViewerLoader({ progress, visible }: ViewerLoaderProps) {
    return (
        <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050B09] transition-opacity duration-700 pointer-events-none"
            style={{ opacity: visible ? 1 : 0 }}
        >
            {/* Vehicle Silhouette SVG */}
            <div className="relative mb-10">
                {/* Glow beneath the car */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-400 opacity-20 blur-xl"></div>

                <svg
                    viewBox="0 0 240 80"
                    className="w-56 h-auto opacity-60"
                    style={{ filter: 'drop-shadow(0 0 18px #10B98155)' }}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Car body */}
                    <path
                        d="M20 55 L30 55 Q32 35 50 30 L80 22 Q100 16 130 16 Q158 16 175 22 L200 30 Q215 35 218 55 L224 55 Q228 55 228 60 L228 65 Q228 67 226 67 L218 67 Q217 72 215 72 Q210 72 207 67 L55 67 Q52 72 48 72 Q43 72 40 67 L14 67 Q12 67 12 65 L12 60 Q12 55 20 55 Z"
                        fill="#10B981"
                        fillOpacity="0.15"
                        stroke="#10B981"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                    {/* Windshield */}
                    <path
                        d="M78 28 L90 20 L150 20 L165 28 Z"
                        fill="#10B981"
                        fillOpacity="0.10"
                        stroke="#10B981"
                        strokeWidth="1"
                    />
                    {/* Rear windshield */}
                    <path
                        d="M165 28 L175 22 L200 28 Z"
                        fill="#10B981"
                        fillOpacity="0.08"
                        stroke="#10B981"
                        strokeWidth="1"
                    />
                    {/* Front wheel */}
                    <circle
                        cx="55"
                        cy="67"
                        r="11"
                        fill="#0A110F"
                        stroke="#10B981"
                        strokeWidth="1.5"
                    />
                    <circle cx="55" cy="67" r="5" fill="#10B981" fillOpacity="0.3" />
                    {/* Rear wheel */}
                    <circle
                        cx="185"
                        cy="67"
                        r="11"
                        fill="#0A110F"
                        stroke="#10B981"
                        strokeWidth="1.5"
                    />
                    <circle cx="185" cy="67" r="5" fill="#10B981" fillOpacity="0.3" />
                </svg>

                {/* Animated scan line */}
                <div
                    className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-70"
                    style={{
                        animation: 'scanLine 1.8s ease-in-out infinite',
                    }}
                />
            </div>

            {/* Loading text */}
            <p className="text-[10px] font-bold tracking-[0.3em] text-emerald-500/80 mb-5">
                LOADING SHOWROOM
            </p>

            {/* Progress bar */}
            <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden mb-3">
                <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Percentage */}
            <p className="text-slate-500 text-[11px] font-mono tabular-nums">
                {Math.round(progress)}%
            </p>

            <style jsx>{`
                @keyframes scanLine {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 0.7; }
                    90% { opacity: 0.7; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
