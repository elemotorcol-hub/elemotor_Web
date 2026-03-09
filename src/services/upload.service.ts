import { getSession } from '../lib/auth.client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const uploadService = {
    uploadImage: async (file: File) => {
        const session = await getSession();
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
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
