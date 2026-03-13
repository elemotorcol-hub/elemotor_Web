import { getSession } from '../lib/auth.client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface UploadResponse {
    publicUrl: string;
    publicId: string;
    format: string;
    size: number;
}

export const uploadService = {
    uploadImage: async (file: File, folder?: string): Promise<UploadResponse> => {
        const session = await getSession();
        const formData = new FormData();
        formData.append('file', file);

        const url = folder 
            ? `${API_BASE_URL}/api/upload/image?folder=${encodeURIComponent(folder)}`
            : `${API_BASE_URL}/api/upload/image`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...(session?.accessToken && { 'Authorization': `Bearer ${session.accessToken}` })
                // Do NOT set Content-Type to application/json, browser needs to set multipart/form-data with boundary
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${errorText}`);
        }

        return response.json();
    },

    uploadTrimImages: async (files: File[], trimId: number, type: string, altText?: string, sortOrder?: number) => {
        const session = await getSession();
        const formData = new FormData();
        
        files.forEach(file => {
            formData.append('files', file);
        });
        
        formData.append('trimId', trimId.toString());
        formData.append('type', type);
        
        if (altText) formData.append('altText', altText);
        if (sortOrder !== undefined) formData.append('sortOrder', sortOrder.toString());

        const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
            method: 'POST',
            headers: {
                ...(session?.accessToken && { 'Authorization': `Bearer ${session.accessToken}` })
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Trim images upload failed: ${errorText}`);
        }

        return response.json();
    },

    uploadModel3d: async (file: File, trimId: number) => {
        const session = await getSession();
        const formData = new FormData();
        
        formData.append('file', file);
        formData.append('trimId', trimId.toString());

        const response = await fetch(`${API_BASE_URL}/api/models-3d/upload`, {
            method: 'POST',
            headers: {
                ...(session?.accessToken && { 'Authorization': `Bearer ${session.accessToken}` })
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`3D Model upload failed: ${errorText}`);
        }

        return response.json();
    }
};
