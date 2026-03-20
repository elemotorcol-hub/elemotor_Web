export interface VehicleTelemetry {
    battery: {
        percentage: number;
        status: string;
    };
    range: {
        value: number;
        unit: string;
    };
    odometer: {
        value: string;
        unit: string;
    };
}

export interface MaintenanceHistoryItem {
    id: string;
    title: string;
    date: string;
    mileage?: string;
    status: 'completed' | 'scheduled' | 'overdue';
    description: string;
}

export interface VehicleMaintenance {
    nextService: {
        name: string;
        suggestedDate: string;
    };
    batteryHealth: string;
    tirePressure: string;
    history?: MaintenanceHistoryItem[];
}

export interface VehicleWarranty {
    basic: {
        name: string;
        status: string;
        expiration: string;
        progress: number;
    };
    battery: {
        name: string;
        status: string;
        expiration: string;
        progress: number;
    };
}

export interface VehicleDocumentRef {
    name: string;
    info: string;
    actionType: 'download' | 'external';
}

export interface ClientVehicleData {
    status: string;
    lastUpdated: string;
    modelYear: string;
    modelName: string;
    vin: string;
    exteriorColor: { name: string; hex: string; };
    purchaseDate: string;
    telemetry: VehicleTelemetry;
    maintenance: VehicleMaintenance;
    warranty: VehicleWarranty;
    documents: VehicleDocumentRef[];
}

export interface QuoteData {
    id: string;
    model: string;
    date: string;
    status: string;
    statusColor: string;
    statusCode: 'approved' | 'pending' | 'expired';
    amount: string;
    validUntil: string;
    imageUrl?: string;
}

export interface ExtendedQuoteData extends QuoteData {
    city?: string;
    preferredChannel?: string;
    message?: string;
    images: string[];
    trimName?: string;
}

export interface ApiQuoteResponse {
    id: number;
    referenceCode: string;
    status: string;
    budgetRange?: number;
    city?: string;
    message?: string;
    preferredChannel?: string;
    createdAt: string;
    model: {
        id: number;
        name: string;
        brand?: { name: string; slug?: string; id?: number };
        trims?: Array<{ images: Array<{ url: string }> }>;
    };
    trim?: {
        id: number;
        name: string;
        images: Array<{ url: string }>;
    };
}

export interface ClientDocument {
    id: string;
    title: string;
    subtitle: string;
    uploadDate: string;
    iconType: 'receipt' | 'shield-check' | 'id-card' | 'shield-alert' | 'book';
    colorTheme: string;
    category: 'Legales' | 'Mantenimiento' | 'Facturas';
    isActive?: boolean;
    warningMessage?: string;
    fileUrl?: string;
}
