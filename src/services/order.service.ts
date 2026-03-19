import { fetchApi } from '@/lib/api';
import { Order, OrderStatus } from '@/types/orders';

export interface UpdateOrderDto {
    vin?: string;
    notes?: string;
    estimatedDelivery?: string;
}

export interface UpdateOrderStatusDto {
    status: OrderStatus;
    description?: string;
}

export const orderService = {
    /**
     * [Admin] Listar todos los pedidos con filtros
     */
    async fetchAllOrders(params?: Record<string, any>): Promise<{ data: Order[]; total: number }> {
        let url = '/api/orders';
        if (params) {
            const query = new URLSearchParams(params).toString();
            if (query) url += `?${query}`;
        }
        return fetchApi(url);
    },

    /**
     * [Admin] Actualizar detalles de un pedido (VIN, notas, etc.)
     */
    async updateOrderDetails(id: number | string, data: UpdateOrderDto): Promise<Order> {
        return fetchApi(`/api/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * [Admin] Actualizar el estado de un pedido
     */
    async updateOrderStatus(id: number | string, data: UpdateOrderStatusDto): Promise<Order> {
        return fetchApi(`/api/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * [Admin] Crear un nuevo pedido — POST /api/orders
     * Body: { userId, trimId, colorId, vin?, notes?, estimatedDelivery? }
     */
    async createOrder(data: {
        userId: number;
        trimId: number;
        colorId: number;
        vin?: string;
        notes?: string;
        estimatedDelivery?: string;
    }): Promise<Order> {
        return fetchApi('/api/orders', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * [Admin] Listar clientes — GET /api/users?role=client
     */
    async fetchUsers(): Promise<{ data: any[]; meta: any }> {
        return fetchApi('/api/users?role=client&limit=100');
    },

    /**
     * [Público] Listar trims — GET /api/trims
     */
    async fetchTrims(): Promise<{ data: any[]; meta: any }> {
        return fetchApi('/api/trims?limit=100');
    },

    /**
     * [Público] Colores de un trim — GET /api/colors/by-trim/:trimId
     */
    async fetchColorsByTrim(trimId: number): Promise<any[]> {
        return fetchApi(`/api/colors/by-trim/${trimId}`);
    },

    /**
     * [Cliente] Listar mis pedidos
     */
    async fetchMyOrders(params?: Record<string, any>): Promise<{ data: any[]; total: number }> {
        let url = '/api/orders/my';
        if (params) {
            const query = new URLSearchParams(params).toString();
            if (query) url += `?${query}`;
        }
        return fetchApi(url);
    },

    /**
     * [Cliente] Obtener detalle de uno de mis pedidos
     */
    async fetchMyOrderDetail(id: number | string): Promise<any> {
        return fetchApi(`/api/orders/my/${id}`);
    },

    /**
     * [Cliente] Obtener el vehículo activo (dashboard)
     */
    async fetchMyVehicle(): Promise<any> {
        return fetchApi('/api/orders/my-vehicle');
    },
};
