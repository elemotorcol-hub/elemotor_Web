export type OrderStatus = 'Fabricación' | 'En Puerto' | 'En Tránsito' | 'Aduanas' | 'Listo para Entrega';

export interface OrderStatusHistory {
    status: OrderStatus;
    date: string;
    description?: string;
}

export interface Order {
    id: string; // Internal DB ID usually
    trackingCode: string; // EJ: ELE-2401-ABC
    clientId: string;
    clientName: string;
    vehicleModelId: string;
    vehicleModel: string;
    trimId: string;
    trimName: string;
    colorId: string;
    colorName: string;
    status: OrderStatus;
    estimatedDelivery: string;
    totalPrice: number;
    vin?: string;
    notes?: string;
    history: OrderStatusHistory[];
}
