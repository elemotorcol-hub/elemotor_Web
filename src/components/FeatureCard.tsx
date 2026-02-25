import * as React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
    children: React.ReactNode;
    className?: string;
}

export function FeatureCard({ children, className }: FeatureCardProps) {
    return (
        <div
            className={cn(
                'bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:bg-white/15 hover:border-white/30',
                className
            )}
        >
            {children}
        </div>
    );
}
