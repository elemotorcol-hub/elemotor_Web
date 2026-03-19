import { fetchApi } from '@/lib/api';

export enum DocumentType {
    INVOICE = 'invoice',
    SOAT = 'soat',
    IMPORT_CERT = 'import_cert',
    PROPERTY_CARD = 'property_card',
    MANUAL = 'manual',
    OTHER = 'other'
}

export interface Document {
    id: number;
    name: string;
    type: DocumentType;
    fileUrl: string;
    publicId: string;
    uploadedBy: 'client' | 'admin';
    createdAt: string;
    orderId: number;
}

export interface UploadDocumentParams {
    file: File;
    orderId: number;
    type: DocumentType;
    name: string;
}

export const documentService = {
    /**
     * [Cliente] Listar mis documentos — GET /api/documents/my
     */
    async fetchMyDocuments(): Promise<Document[]> {
        return fetchApi('/api/documents/my');
    },

    /**
     * [Generales] Subir un documento — POST /api/documents/upload
     * Debe enviarse como multipart/form-data
     */
    async uploadDocument(params: UploadDocumentParams): Promise<Document> {
        const formData = new FormData();
        formData.append('file', params.file);
        formData.append('orderId', params.orderId.toString());
        formData.append('type', params.type);
        formData.append('name', params.name);

        return fetchApi('/api/documents/upload', {
            method: 'POST',
            body: formData,
            // Importante: fetchApi maneja el Token, pero NO debemos setear Content-Type en null localmente
            // El navegador lo seteará automáticamente a multipart/form-data con el boundary si body es FormData.
        });
    },

    /**
     * [Generales] Obtener URL firmada para descarga — GET /api/documents/:id/download
     */
    async getDownloadUrl(id: number | string): Promise<{ url: string; expiresAt: string | null; documentName: string }> {
        return fetchApi(`/api/documents/${id}/download`);
    }
};
