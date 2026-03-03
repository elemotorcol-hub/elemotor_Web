export type OrderStatus = 'Listo para Entrega' | 'En Tránsito' | 'Aduanas' | 'En Puerto' | 'Fabricación';

export interface Order {
    id: string;
    clientName: string;
    vehicleModel: string;
    status: OrderStatus;
    estimatedDelivery: string;
}
