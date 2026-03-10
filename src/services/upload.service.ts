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
    }
};
