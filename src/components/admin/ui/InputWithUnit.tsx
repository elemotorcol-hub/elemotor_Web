import React from 'react';

interface InputWithUnitProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    unit: string;
}

export function InputWithUnit({ label, unit, className = '', ...props }: InputWithUnitProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{label}</label>
            <div className="relative flex items-center">
                <input
                    type="text"
                    className={`w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-12 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all ${className}`}
                    {...props}
                />
                <span className="absolute right-4 text-sm text-slate-500 font-medium pointer-events-none">
                    {unit}
                </span>
            </div>
        </div>
    );
}
