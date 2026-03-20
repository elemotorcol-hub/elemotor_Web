export type OrderStatus = 'confirmed' | 'port_origin' | 'transit' | 'customs' | 'nationalization' | 'ready' | 'delivered';

export interface OrderStatusHistory {
    status: OrderStatus;
    date: string;
    description?: string;
}

export interface Order {
    id: string | number;
    trackingCode: string;
    userId: number;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    trimId: number;
    trim?: {
        id: number;
        name: string;
        images?: { url: string; public_url?: string }[];
        model?: {
            id: number;
            name: string;
            brand?: {
                id: number;
                name: string;
            };
        };
    };
    colorId: number;
    color?: {
        id: number;
        name: string;
        hexCode: string;
    };
    status: OrderStatus;
    estimatedDelivery?: string;
    vin?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    totalPrice?: number;
    statusHistory?: OrderStatusHistory[];
    
    // Legacy mapping compatibility
    clientName?: string;
    vehicleModel?: string;
    trimName?: string;
    colorName?: string;
}
