import { useState, useCallback, useEffect } from 'react';
import { brandService } from '@/services/brand.service';
import { Brand } from '@/types/inventory';

export function useBrands() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBrands = useCallback(async (params?: Record<string, string>) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await brandService.getBrands(params);
            console.log('API Response for getBrands:', data); // DEBUG
            
            // Revolve the PaginatedResult { data: [], meta: {} }
            let brandsList: Brand[] = [];
            if (data && Array.isArray(data.data)) {
                brandsList = data.data.map((b: any) => ({ ...b, logo_url: b.logoUrl || b.logo_url })); // PaginatedResult case
            } else if (Array.isArray(data)) {
                brandsList = data.map((b: any) => ({ ...b, logo_url: b.logoUrl || b.logo_url })); // Direct Array case
            }
            
            console.log('Extracted brandsList:', brandsList); // DEBUG
            
            setBrands(brandsList);
        } catch (err: any) {
            setError(err.message || 'Error al cargar las marcas.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchBrandById = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await brandService.getBrandById(id);
            return data;
        } catch (err: any) {
            setError(err.message || 'Error al cargar la marca seleccionada.');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createBrand = useCallback(async (brandData: Partial<Brand>) => {
        setIsLoading(true);
        setError(null);
        try {
            await brandService.createBrand(brandData);
            await fetchBrands(); // Refresh the list automatically
            return { success: true };
        } catch (err: any) {
            setError(err.message || 'Error al crear la marca.');
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    }, [fetchBrands]);

    const updateBrand = useCallback(async (id: string, brandData: Partial<Brand>) => {
        setIsLoading(true);
        setError(null);
        try {
            await brandService.updateBrand(id, brandData);
            await fetchBrands(); // Refresh the list automatically
            return { success: true };
        } catch (err: any) {
            setError(err.message || 'Error al actualizar la marca.');
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    }, [fetchBrands]);

    const deleteBrand = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await brandService.deleteBrand(id);
            await fetchBrands(); // Refresh the list automatically
            return { success: true };
        } catch (err: any) {
            setError(err.message || 'Error al desactivar la marca.');
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    }, [fetchBrands]);

    // Fetch brands exactly once upon mounting
    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    return {
        brands,
        isLoading,
        error,
        fetchBrands,
        fetchBrandById,
        createBrand,
        updateBrand,
        deleteBrand
    };
}
