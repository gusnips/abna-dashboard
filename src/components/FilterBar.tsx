/**
 * FilterBar Component
 * 
 * Provides filtering controls for the dashboard:
 * - Geographic scope selector (Brasil Todo / CSA / Region / State / City)
 * - Dependent dropdowns based on selected scope
 * - Date range picker
 * 
 * All labels are in Portuguese (Brazilian)
 */

import { useFilters } from '../contexts';
import type { GeographicScope } from '../types';

export function FilterBar() {
    const {
        filters,
        setGeographicFilter,
        setDateRange,
        clearFilters,
        filterOptions
    } = useFilters();

    /**
     * Handle geographic scope change
     */
    const handleScopeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const scope = e.target.value as GeographicScope;
        setGeographicFilter(scope, null);
    };

    /**
     * Handle CSA selection
     */
    const handleCSAChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value || null;
        setGeographicFilter('csa', value);
    };

    /**
     * Handle Region (CSR) selection
     */
    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value || null;
        setGeographicFilter('region', value);
    };

    /**
     * Handle State selection
     */
    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value || null;
        setGeographicFilter('state', value);
    };

    /**
     * Handle City selection
     */
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value || null;
        setGeographicFilter('city', value);
    };

    /**
     * Handle start date change
     */
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? new Date(e.target.value) : null;
        setDateRange(value, filters.dateRange.end);
    };

    /**
     * Handle end date change
     */
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? new Date(e.target.value) : null;
        setDateRange(filters.dateRange.start, value);
    };

    /**
     * Format date for input value (YYYY-MM-DD)
     */
    const formatDateForInput = (date: Date | null): string => {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    };

    /**
     * Get cities filtered by selected state (if applicable)
     */
    const getAvailableCities = (): string[] => {
        if (filters.geographicScope === 'city' && filters.selectedState) {
            // Filter cities by state - this would require data access
            // For now, return all cities
            return filterOptions.cities;
        }
        return filterOptions.cities;
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
                {/* Geographic Scope Selector */}
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="geographic-scope" className="block text-sm font-medium text-gray-700 mb-2">
                        Escopo Geográfico
                    </label>
                    <select
                        id="geographic-scope"
                        value={filters.geographicScope}
                        onChange={handleScopeChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="brasil">Brasil Todo</option>
                        <option value="csa">CSA</option>
                        <option value="region">Região (CSR)</option>
                        <option value="state">Estado</option>
                        <option value="city">Cidade</option>
                    </select>
                </div>

                {/* CSA Dropdown - shown when scope is 'csa' */}
                {filters.geographicScope === 'csa' && (
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="csa-select" className="block text-sm font-medium text-gray-700 mb-2">
                            Selecione o CSA
                        </label>
                        <select
                            id="csa-select"
                            value={filters.selectedCSA || ''}
                            onChange={handleCSAChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Selecione...</option>
                            {filterOptions.csas.map(csa => (
                                <option key={csa} value={csa}>
                                    {csa}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Region (CSR) Dropdown - shown when scope is 'region' */}
                {filters.geographicScope === 'region' && (
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-2">
                            Selecione a Região (CSR)
                        </label>
                        <select
                            id="region-select"
                            value={filters.selectedRegion || ''}
                            onChange={handleRegionChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Selecione...</option>
                            {filterOptions.csrs.map(csr => (
                                <option key={csr} value={csr}>
                                    {csr}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* State Dropdown - shown when scope is 'state' or 'city' */}
                {(filters.geographicScope === 'state' || filters.geographicScope === 'city') && (
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-2">
                            Selecione o Estado
                        </label>
                        <select
                            id="state-select"
                            value={filters.selectedState || ''}
                            onChange={handleStateChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Selecione...</option>
                            {filterOptions.states.map(state => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* City Dropdown - shown when scope is 'city' and state is selected */}
                {filters.geographicScope === 'city' && filters.selectedState && (
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
                            Selecione a Cidade
                        </label>
                        <select
                            id="city-select"
                            value={filters.selectedCity || ''}
                            onChange={handleCityChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Selecione...</option>
                            {getAvailableCities().map(city => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Date Range Filters */}
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                        Data Inicial
                    </label>
                    <input
                        type="date"
                        id="start-date"
                        value={formatDateForInput(filters.dateRange.start)}
                        onChange={handleStartDateChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
                        Data Final
                    </label>
                    <input
                        type="date"
                        id="end-date"
                        value={formatDateForInput(filters.dateRange.end)}
                        onChange={handleEndDateChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Clear Filters Button */}
                <div className="flex-shrink-0">
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        Limpar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
}
