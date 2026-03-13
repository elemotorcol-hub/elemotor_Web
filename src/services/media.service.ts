import { fetchApi } from '../lib/api';

/**
 * media.service.ts
 * Wrappers for deleting media assets (images and 3D models) via the admin API.
 */
export const mediaService = {
    /**
     * Soft or hard deletes an image record by ID.
     * DELETE /api/images/:id
     */
    deleteImage: async (id: number | string) => {
        return fetchApi(`/api/images/${id}`, { method: 'DELETE' });
    },

    /**
     * Deletes a 3D model record and its Cloudinary asset.
     * DELETE /api/models-3d/:id
     */
    deleteModel3d: async (id: number | string) => {
        return fetchApi(`/api/models-3d/${id}`, { method: 'DELETE' });
    },

    /**
     * Fetch all colors for a specific trim.
     * GET /api/colors/by-trim/:id
     */
    getColorsByTrim: async (trimId: number | string) => {
        return fetchApi(`/api/colors/by-trim/${trimId}`, { method: 'GET' });
    },

    /**
     * Fetch all images for a specific trim.
     * GET /api/images/by-trim/:trimId
     */
    getImagesByTrim: async (trimId: number | string) => {
        return fetchApi(`/api/images/by-trim/${trimId}`, { method: 'GET' });
    },

    /**
     * Fetch the 3D model associated with a specific trim.
     * GET /api/models-3d/by-trim/:trimId
     */
    getModel3dByTrim: async (trimId: number | string) => {
        return fetchApi(`/api/models-3d/by-trim/${trimId}`, { method: 'GET' });
    },

    /**
     * Updates a color record.
     * PUT /api/colors/:id
     */
    updateColor: async (id: number | string, data: any) => {
        return fetchApi(`/api/colors/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Updates a spec record.
     * PATCH /api/specs/:id
     */
    updateSpec: async (id: number | string, data: any) => {
        return fetchApi(`/api/specs/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};
