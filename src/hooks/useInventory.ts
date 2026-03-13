import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { modelService } from '@/services/model.service';
import { brandService } from '@/services/brand.service';
import { trimService } from '@/services/trim.service';
import { VehicleModel, Brand } from '@/types/inventory';

export function useInventory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', 'active', 'inactive'

    // Estado para paginación (Modelos EV)
    const [page, setPage] = useState(1);
    const limit = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<VehicleModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Agregar un retraso de 300ms antes de filtrar
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

    // Cargar marcas
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await brandService.getBrands({ limit: '100' });
                if (response?.data) {
                    setBrands(response.data);
                }
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };
        fetchBrands();
    }, []);

    // Cargar modelos cada vez que cambian dependencias
    const fetchModels = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: Record<string, string | number | boolean> = {
                page,
                limit
            };

            if (selectedStatus === 'active') {
                params.active = true;
            } else if (selectedStatus === 'inactive') {
                params.active = false;
            }

            if (selectedBrand !== 'all') {
                params.brandId = selectedBrand;
            }

            if (selectedType !== 'all') {
                params.type = selectedType;
            }

            if (debouncedSearchTerm) {
                params.name = debouncedSearchTerm; // Searching by name as proxy 
            }
            
            const response = await modelService.getModels(params);
            if (response) {
                setModels(response.data || []);
                setTotalPages(response.meta?.totalPages || 1);
                setTotalItems(response.meta?.total || 0);
            }
        } catch (error) {
            console.error("Error fetching models:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, selectedStatus, selectedBrand, selectedType, debouncedSearchTerm]);

    useEffect(() => {
        fetchModels();
    }, [fetchModels]);

    // Update page to 1 whenever any filter changes
    useEffect(() => {
        setPage(1);
    }, [selectedStatus, selectedBrand, selectedType, debouncedSearchTerm]);

    // Métodos para cambiar estado de modelo (Activar / Desactivar)
    const toggleModelStatus = async (id: number, active: boolean) => {
        try {
            await modelService.updateModel(id, { active });
            await fetchModels();
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const deleteModel = async (id: number) => {
        try {
            // First, fetch relations to grab all trims from this model
            const modelDataRes = await modelService.getModelById(id);
            console.log("Delete Model Init - Fetched Model Data:", modelDataRes);
            const trims = modelDataRes?.trims || [];
            console.log("Extracted Trims object array to delete:", trims);

            // Execute cascading deactivation for each trim
            if (trims.length > 0) {
                // Change to a controlled `for` loop to ensure sequential execution
                for (const trim of trims) {
                    // Only deactivate active trims
                    if (trim.active) {
                        try {
                            await trimService.deleteTrim(trim.id);
                        } catch (trimErr: any) {
                            throw new Error(`Error desactivando la versión ${trim.name || trim.id}: ${trimErr.message || 'Error Desconocido'}`);
                        }
                    }
                }
            }

            // Finally, delete the parent model
            await modelService.deleteModel(id);
            await fetchModels();
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    return {
        searchTerm,
        setSearchTerm,
        selectedBrand,
        setSelectedBrand,
        selectedType,
        setSelectedType,
        selectedStatus,
        setSelectedStatus,
        filteredModels: models, // map locally to models array avoiding component rename refactor
        models,
        brands,
        isLoading,
        page,
        setPage,
        totalPages,
        totalItems,
        refreshModels: fetchModels,
        deleteModel,
        updateModel: toggleModelStatus
    };
}
