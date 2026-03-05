import { type QuoteStatus } from '@/types/crm';
import { STATUS_CONFIG } from '@/config/crm';

interface QuoteStatusBadgeProps {
    status: QuoteStatus;
    className?: string;
}

export function QuoteStatusBadge({ status, className = '' }: QuoteStatusBadgeProps) {
    const config = STATUS_CONFIG[status];
    if (!config) return null;

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className} ${className}`}>
            {config.label}
        </span>
    );
}
