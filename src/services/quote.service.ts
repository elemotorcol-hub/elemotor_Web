import { fetchApi } from '@/lib/api';
import { QuoteStatus } from '@/types/crm';

export interface QuoteStats {
    total: number;
    totalToday: number;
    byStatus: { status: QuoteStatus; count: number }[];
    bySource: { source: string; count: number }[];
}

export interface QueryQuotesParams {
    status?: string;
    assignedToId?: number;
    source?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
}

class QuoteService {
    async fetchQuotes(params: QueryQuotesParams = {}) {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') query.append(key, String(value));
        });

        return fetchApi(`/api/quotes?${query.toString()}`);
    }

    async fetchStats() {
        return fetchApi('/api/quotes/stats');
    }

    async fetchOne(id: number) {
        return fetchApi(`/api/quotes/${id}`);
    }

    async updateQuote(id: number, data: { 
        status?: QuoteStatus; 
        assignedToId?: number; 
        notes?: string; 
        modelInterest?: string; 
        budgetRange?: number;
        name?: string;
        email?: string;
        phone?: string;
    }) {
        return fetchApi(`/api/quotes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
}

export const quoteService = new QuoteService();
