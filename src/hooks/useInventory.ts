import { useState, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { mockModels } from '@/mocks/inventoryData';

export function useInventory() {
    const [searchTerm, setSearchTerm] = useState('');
    // Agregar un retraso de 300ms antes de filtrar para no congelar la UI al tipear rápido
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

    const filteredModels = useMemo(() => {
        if (!debouncedSearchTerm) return mockModels;

        const lowerCaseSearch = debouncedSearchTerm.toLowerCase();
        return mockModels.filter(model =>
            model.name.toLowerCase().includes(lowerCaseSearch) ||
            model.brand.toLowerCase().includes(lowerCaseSearch)
        );
    }, [debouncedSearchTerm]);

    return {
        searchTerm,
        setSearchTerm,
        filteredModels
    };
}
