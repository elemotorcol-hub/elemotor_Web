import { MaintenanceHistoryItem } from '@/types/dashboard';

export interface MaintenanceMilestone {
    months: number;
    mileage: number;
    title: string;
    description: string;
}

const EV_MAINTENANCE_PLAN: MaintenanceMilestone[] = [
    {
        months: 6,
        mileage: 10000,
        title: 'Revisión de Seguridad y Fluidos',
        description: 'Chequeo de niveles de refrigerante de batería y líquido de frenos.'
    },
    {
        months: 12,
        mileage: 20000,
        title: 'Rotación de Neumáticos y Filtros',
        description: 'Rotación para un desgaste uniforme y cambio de filtro de aire de cabina (HEPA).'
    },
    {
        months: 18,
        mileage: 30000,
        title: 'Inspección de Tren Motriz',
        description: 'Verificación de conectores eléctricos y estado físico de la batería.'
    },
    {
        months: 24,
        mileage: 40000,
        title: 'Servicio de Sistema de Frenado',
        description: 'Cambio de líquido de frenos e inspección de pastillas (desgaste reducido por regeneración).'
    },
    {
        months: 30,
        mileage: 50000,
        title: 'Revisión Completa de Suspensión',
        description: 'Ajuste de amortiguadores y alineación láser.'
    },
    {
        months: 36,
        mileage: 60000,
        title: 'Mantenimiento Mayor de Batería',
        description: 'Diagnóstico profundo de celdas y balanceo de energía.'
    }
];

export function calculateMaintenanceHistory(purchaseDateStr: string): MaintenanceHistoryItem[] {
    const purchaseDate = new Date(purchaseDateStr);
    const today = new Date();

    const dateFormatter = new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return EV_MAINTENANCE_PLAN.map((milestone, index) => {
        const milestoneDate = new Date(purchaseDate);
        milestoneDate.setMonth(milestoneDate.getMonth() + milestone.months);
        
        let status: 'completed' | 'scheduled' | 'overdue' = 'scheduled';

        if (milestoneDate < today) {
            status = 'completed';
        }

        return {
            id: `maint-${index}`,
            title: milestone.title,
            date: dateFormatter.format(milestoneDate),
            mileage: milestone.mileage.toLocaleString(),
            status,
            description: milestone.description
        };
    });
}

export function getNextMaintenance(history: MaintenanceHistoryItem[]) {
    return history.find(h => h.status === 'scheduled') || history[history.length - 1];
}
