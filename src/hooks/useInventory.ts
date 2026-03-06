import { useState, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { mockModels, mockBrands } from '@/mocks/inventoryData';

export function useInventory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

    // Agregar un retraso de 300ms antes de filtrar para no congelar la UI al tipear rápido
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

    const filteredModels = useMemo(() => {
        let result = mockModels;

        // Filtro por marca
        if (selectedBrand !== 'all') {
            result = result.filter(m => m.brand_id === selectedBrand);
        }

        // Filtro por tipo de carrocería
        if (selectedType !== 'all') {
            result = result.filter(m => m.type === selectedType);
        }

        // Búsqueda por texto
        if (debouncedSearchTerm) {
            const lowerCaseSearch = debouncedSearchTerm.toLowerCase();
            result = result.filter(model => {
                const brand = mockBrands.find(b => b.id === model.brand_id);
                const brandName = brand ? brand.name.toLowerCase() : '';
                return model.name.toLowerCase().includes(lowerCaseSearch) ||
                    brandName.includes(lowerCaseSearch);
            });
        }

        return result;
    }, [debouncedSearchTerm, selectedBrand, selectedType]);

    return {
        searchTerm,
        setSearchTerm,
        selectedBrand,
        setSelectedBrand,
        selectedType,
        setSelectedType,
        filteredModels,
        brands: mockBrands
    };
}
