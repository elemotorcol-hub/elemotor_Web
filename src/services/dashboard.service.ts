import { fetchApi } from '../lib/api';

export interface DashboardMetrics {
    leadsToday: number;
    leadsWeekly: number;
    activeOrders: number;
    vehiclesInStock: number;
}

export interface ActivityItem {
    id: string;
    type: 'order_status' | 'new_quote';
    message: string;
    date: string;
}

export interface ChartDataPoint {
    date: string;
    leads: number;
}

export interface DashboardSummary {
    metrics: DashboardMetrics;
    recentQuotes: any[];
    recentActivity: ActivityItem[];
    chartData: ChartDataPoint[];
}

export const dashboardService = {
    getSummary: async (): Promise<DashboardSummary> => {
        return fetchApi<DashboardSummary>('/api/dashboard/summary');
    }
};
