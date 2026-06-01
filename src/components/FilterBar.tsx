/**
 * Componente FilterBar
 * 
 * Fornece controles de filtragem para o painel:
 * - Seletor de escopo geográfico (Brasil Todo / CSA / Região / Estado / Cidade)
 * - Dropdowns dependentes baseados no escopo selecionado
 * - Seletor de intervalo de datas
 * 
 * Todos os rótulos estão em português brasileiro
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
     * Trata mudança de escopo geográfico
     */
    const handleScopeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const scope = e.target.value as GeographicScope;
        setGeographicFilter(scope, null);
    };

    /**
     * Trata seleção de CSA
     */
    const handleCSAChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value || null;
        setGeographicFilter('csa', value);
    };

    /**
     * Trata seleção de Região (CSR)
     */
    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value || null;
        setGeographicFilter('region', value);
    };

    /**
     * Trata seleção de Estado
     */
    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value || null;
        setGeographicFilter('state', value);
    };

    /**
     * Trata seleção de Cidade
     */
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value || null;
        setGeographicFilter('city', value);
    };

    /**
     * Trata mudança de data inicial
     */
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? new Date(e.target.value) : null;
        setDateRange(value, filters.dateRange.end);
    };

    /**
     * Trata mudança de data final
     */
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? new Date(e.target.value) : null;
        setDateRange(filters.dateRange.start, value);
    };

    /**
     * Formata data para valor do input (YYYY-MM-DD)
     */
    const formatDateForInput = (date: Date | null): string => {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    };

    /**
     * Obtém cidades filtradas pelo estado selecionado (se aplicável)
     */
    const getAvailableCities = (): string[] => {
        if (filters.geographicScope === 'city' && filters.selectedState) {
            // Filtra cidades por estado - isso requer acesso aos dados
            // Por enquanto, retorna todas as cidades
            return filterOptions.cities;
        }
        return filterOptions.cities;
    };

    return (
        <div className="surface p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
                <svg className="h-4 w-4 text-abna-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.879a1 1 0 00-.293-.707L3.293 7.007A1 1 0 013 6.3V4z" />
                </svg>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-600">Filtros</h2>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 items-end">
                {/* Seletor de Escopo Geográfico */}
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="geographic-scope" className="field-label">
                        Escopo Geográfico
                    </label>
                    <select
                        id="geographic-scope"
                        value={filters.geographicScope}
                        onChange={handleScopeChange}
                        className="field-control"
                    >
                        <option value="brasil">Brasil Todo</option>
                        <option value="csa">CSA</option>
                        <option value="region">Região (CSR)</option>
                        <option value="state">Estado</option>
                        <option value="city">Cidade</option>
                    </select>
                </div>

                {/* Dropdown de CSA - exibido quando escopo é 'csa' */}
                {filters.geographicScope === 'csa' && (
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="csa-select" className="field-label">
                            Selecione o CSA
                        </label>
                        <select
                            id="csa-select"
                            value={filters.selectedCSA || ''}
                            onChange={handleCSAChange}
                            className="field-control"
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

                {/* Dropdown de Região (CSR) - exibido quando escopo é 'region' */}
                {filters.geographicScope === 'region' && (
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="region-select" className="field-label">
                            Selecione a Região (CSR)
                        </label>
                        <select
                            id="region-select"
                            value={filters.selectedRegion || ''}
                            onChange={handleRegionChange}
                            className="field-control"
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

                {/* Dropdown de Estado - exibido quando escopo é 'state' ou 'city' */}
                {(filters.geographicScope === 'state' || filters.geographicScope === 'city') && (
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="state-select" className="field-label">
                            Selecione o Estado
                        </label>
                        <select
                            id="state-select"
                            value={filters.selectedState || ''}
                            onChange={handleStateChange}
                            className="field-control"
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

                {/* Dropdown de Cidade - exibido quando escopo é 'city' e estado está selecionado */}
                {filters.geographicScope === 'city' && filters.selectedState && (
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="city-select" className="field-label">
                            Selecione a Cidade
                        </label>
                        <select
                            id="city-select"
                            value={filters.selectedCity || ''}
                            onChange={handleCityChange}
                            className="field-control"
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

                {/* Filtros de Intervalo de Datas */}
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="start-date" className="field-label">
                        Data Inicial
                    </label>
                    <input
                        type="date"
                        id="start-date"
                        value={formatDateForInput(filters.dateRange.start)}
                        onChange={handleStartDateChange}
                        className="field-control"
                    />
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="end-date" className="field-label">
                        Data Final
                    </label>
                    <input
                        type="date"
                        id="end-date"
                        value={formatDateForInput(filters.dateRange.end)}
                        onChange={handleEndDateChange}
                        className="field-control"
                    />
                </div>

                {/* Botão Limpar Filtros */}
                <div className="flex-shrink-0">
                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-600 shadow-sm transition-colors hover:bg-ink-100 hover:text-ink-800 focus:outline-none focus:ring-2 focus:ring-ink-300"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Limpar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
}
