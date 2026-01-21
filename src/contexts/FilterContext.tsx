/**
 * FilterContext - Manages filter state and provides filtered data
 * 
 * This context manages all filtering logic including:
 * - Geographic filters (Brasil/CSA/Region/State/City) with mutual exclusivity
 * - Date range filtering
 * - Filter options extraction from data
 * - Filtered records computation
 */

import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
    CampaignRecord,
    FilterContextValue,
    FilterState,
    FilterOptions,
    GeographicScope
} from '../types';
import { useData } from './DataContext';

/**
 * Create the FilterContext with undefined default value
 * This forces consumers to use the context within a provider
 */
const FilterContext = createContext<FilterContextValue | undefined>(undefined);

/**
 * Props for FilterProvider component
 */
interface FilterProviderProps {
    children: ReactNode;
}

/**
 * Initial filter state - all filters cleared
 */
const createInitialFilterState = (): FilterState => ({
    geographicScope: 'brasil',
    selectedCSA: null,
    selectedRegion: null,
    selectedState: null,
    selectedCity: null,
    dateRange: {
        start: null,
        end: null
    }
});

/**
 * FilterProvider component that manages filter state and filtered data
 */
export function FilterProvider({ children }: FilterProviderProps) {
    const { records } = useData();
    const [filters, setFilters] = useState<FilterState>(createInitialFilterState());

    /**
     * Extract filter options from available records
     */
    const filterOptions = useMemo((): FilterOptions => {
        const csasSet = new Set<string>();
        const csrsSet = new Set<string>();
        const statesSet = new Set<string>();
        const citiesSet = new Set<string>();
        const activityTypesSet = new Set<string>();

        records.forEach(record => {
            // Extract CSRs
            if (record.selectedCSR) {
                csrsSet.add(record.selectedCSR);
            }

            // Extract CSAs from the CSR-CSA map
            Object.values(record.csrCSAMap).forEach(csa => {
                if (csa) {
                    csasSet.add(csa);
                }
            });

            // Extract states
            if (record.state) {
                statesSet.add(record.state);
            }

            // Extract cities
            if (record.city) {
                citiesSet.add(record.city);
            }

            // Extract activity types
            if (record.activityType) {
                activityTypesSet.add(record.activityType);
            }
        });

        return {
            csas: Array.from(csasSet).sort(),
            csrs: Array.from(csrsSet).sort(),
            states: Array.from(statesSet).sort(),
            cities: Array.from(citiesSet).sort(),
            activityTypes: Array.from(activityTypesSet).sort()
        };
    }, [records]);

    /**
     * Set geographic filter with mutual exclusivity logic
     * When a geographic scope is selected, all other geographic filters are cleared
     */
    const setGeographicFilter = useCallback((scope: GeographicScope, value: string | null): void => {
        setFilters(prev => {
            // Create new filter state with all geographic filters cleared
            const newFilters: FilterState = {
                ...prev,
                geographicScope: scope,
                selectedCSA: null,
                selectedRegion: null,
                selectedState: null,
                selectedCity: null
            };

            // Set the specific filter based on scope
            switch (scope) {
                case 'brasil':
                    // All geographic filters remain null
                    break;
                case 'csa':
                    newFilters.selectedCSA = value;
                    break;
                case 'region':
                    newFilters.selectedRegion = value;
                    break;
                case 'state':
                    newFilters.selectedState = value;
                    break;
                case 'city':
                    newFilters.selectedCity = value;
                    break;
            }

            return newFilters;
        });
    }, []);

    /**
     * Set date range filter
     */
    const setDateRange = useCallback((start: Date | null, end: Date | null): void => {
        setFilters(prev => ({
            ...prev,
            dateRange: { start, end }
        }));
    }, []);

    /**
     * Clear all filters
     */
    const clearFilters = useCallback((): void => {
        setFilters(createInitialFilterState());
    }, []);

    /**
     * Apply filters to records and return filtered results
     */
    const filteredRecords = useMemo((): CampaignRecord[] => {
        return records.filter(record => {
            // Geographic filtering
            switch (filters.geographicScope) {
                case 'brasil':
                    // No geographic filter - include all
                    break;

                case 'csa':
                    if (filters.selectedCSA) {
                        // Check if the record's CSR-CSA map contains the selected CSA
                        const recordCSAs = Object.values(record.csrCSAMap).filter(Boolean);
                        if (!recordCSAs.includes(filters.selectedCSA)) {
                            return false;
                        }
                    }
                    break;

                case 'region':
                    if (filters.selectedRegion) {
                        // Filter by CSR (region)
                        if (record.selectedCSR !== filters.selectedRegion) {
                            return false;
                        }
                    }
                    break;

                case 'state':
                    if (filters.selectedState) {
                        if (record.state !== filters.selectedState) {
                            return false;
                        }
                    }
                    break;

                case 'city':
                    if (filters.selectedCity) {
                        if (record.city !== filters.selectedCity) {
                            return false;
                        }
                    }
                    break;
            }

            // Date range filtering
            if (filters.dateRange.start || filters.dateRange.end) {
                const activityDate = record.activityDate;

                if (filters.dateRange.start && activityDate < filters.dateRange.start) {
                    return false;
                }

                if (filters.dateRange.end && activityDate > filters.dateRange.end) {
                    return false;
                }
            }

            // Record passed all filters
            return true;
        });
    }, [records, filters]);

    // Context value
    const value: FilterContextValue = {
        filters,
        setGeographicFilter,
        setDateRange,
        clearFilters,
        filteredRecords,
        filterOptions
    };

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
}

/**
 * Custom hook to use FilterContext
 * @throws {Error} If used outside of FilterProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useFilters(): FilterContextValue {
    const context = useContext(FilterContext);

    if (context === undefined) {
        throw new Error('useFilters must be used within a FilterProvider');
    }

    return context;
}

/**
 * Export the context for testing purposes
 */
export { FilterContext };
