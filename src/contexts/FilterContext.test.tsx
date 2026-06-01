/**
 * Testes unitários para FilterContext
 * Testa gerenciamento de estado de filtros, exclusividade mútua de filtros geográficos e lógica de filtragem
 */

import { describe, it, expect } from 'vitest';
import type { CampaignRecord, FilterState, GeographicScope } from '../types';

// Função auxiliar para criar estado inicial de filtros
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

// Função auxiliar para aplicar filtro geográfico com exclusividade mútua
const applyGeographicFilter = (
    currentState: FilterState,
    scope: GeographicScope,
    value: string | null
): FilterState => {
    const newFilters: FilterState = {
        ...currentState,
        geographicScope: scope,
        selectedCSA: null,
        selectedRegion: null,
        selectedState: null,
        selectedCity: null
    };

    switch (scope) {
        case 'brasil':
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
};


// Função auxiliar para filtrar registros
const filterRecords = (records: CampaignRecord[], filters: FilterState): CampaignRecord[] => {
    return records.filter(record => {
        // Filtragem geográfica
        switch (filters.geographicScope) {
            case 'brasil':
                break;

            case 'csa':
                if (filters.selectedCSA) {
                    const recordCSAs = Object.values(record.csrCSAMap).filter(Boolean);
                    if (!recordCSAs.includes(filters.selectedCSA)) {
                        return false;
                    }
                }
                break;

            case 'region':
                if (filters.selectedRegion) {
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

        // Filtragem por intervalo de datas
        if (filters.dateRange.start || filters.dateRange.end) {
            const activityDate = record.activityDate;

            if (filters.dateRange.start && activityDate < filters.dateRange.start) {
                return false;
            }

            if (filters.dateRange.end && activityDate > filters.dateRange.end) {
                return false;
            }
        }

        return true;
    });
};


describe('Lógica do FilterContext', () => {
    it('deve criar estado inicial de filtros com escopo brasil', () => {
        const state = createInitialFilterState();

        expect(state.geographicScope).toBe('brasil');
        expect(state.selectedCSA).toBeNull();
        expect(state.selectedRegion).toBeNull();
        expect(state.selectedState).toBeNull();
        expect(state.selectedCity).toBeNull();
        expect(state.dateRange.start).toBeNull();
        expect(state.dateRange.end).toBeNull();
    });

    it('deve implementar exclusividade mútua de filtro geográfico - filtro de estado', () => {
        const initialState = createInitialFilterState();
        const newState = applyGeographicFilter(initialState, 'state', 'SP');

        expect(newState.geographicScope).toBe('state');
        expect(newState.selectedState).toBe('SP');
        expect(newState.selectedCSA).toBeNull();
        expect(newState.selectedRegion).toBeNull();
        expect(newState.selectedCity).toBeNull();
    });

    it('deve implementar exclusividade mútua de filtro geográfico - alternando filtros', () => {
        const initialState = createInitialFilterState();

        // Define filtro de estado
        const stateFiltered = applyGeographicFilter(initialState, 'state', 'SP');
        expect(stateFiltered.selectedState).toBe('SP');

        // Alterna para filtro de cidade - deve limpar estado
        const cityFiltered = applyGeographicFilter(stateFiltered, 'city', 'São Paulo');
        expect(cityFiltered.geographicScope).toBe('city');
        expect(cityFiltered.selectedCity).toBe('São Paulo');
        expect(cityFiltered.selectedState).toBeNull();

        // Alterna para brasil - deve limpar todos
        const brasilFiltered = applyGeographicFilter(cityFiltered, 'brasil', null);
        expect(brasilFiltered.geographicScope).toBe('brasil');
        expect(brasilFiltered.selectedCity).toBeNull();
        expect(brasilFiltered.selectedState).toBeNull();
    });

    it('deve filtrar registros por estado', () => {
        const records: CampaignRecord[] = [
            {
                id: '1',
                state: 'SP',
                city: 'São Paulo',
                selectedCSR: 'CSR Brasil',
                csrCSAMap: {},
                activityDate: new Date('2024-01-15'),
            } as CampaignRecord,
            {
                id: '2',
                state: 'RJ',
                city: 'Rio de Janeiro',
                selectedCSR: 'CSR Brasil',
                csrCSAMap: {},
                activityDate: new Date('2024-01-20'),
            } as CampaignRecord
        ];

        const filters = applyGeographicFilter(createInitialFilterState(), 'state', 'SP');
        const filtered = filterRecords(records, filters);

        expect(filtered).toHaveLength(1);
        expect(filtered[0].id).toBe('1');
        expect(filtered[0].state).toBe('SP');
    });


    it('deve filtrar registros por intervalo de datas', () => {
        const records: CampaignRecord[] = [
            {
                id: '1',
                state: 'SP',
                activityDate: new Date('2024-01-15'),
            } as CampaignRecord,
            {
                id: '2',
                state: 'RJ',
                activityDate: new Date('2024-02-20'),
            } as CampaignRecord,
            {
                id: '3',
                state: 'MG',
                activityDate: new Date('2024-03-10'),
            } as CampaignRecord
        ];

        const filters: FilterState = {
            ...createInitialFilterState(),
            dateRange: {
                start: new Date('2024-01-01'),
                end: new Date('2024-02-28')
            }
        };

        const filtered = filterRecords(records, filters);

        expect(filtered).toHaveLength(2);
        expect(filtered[0].id).toBe('1');
        expect(filtered[1].id).toBe('2');
    });

    it('deve filtrar registros por cidade', () => {
        const records: CampaignRecord[] = [
            {
                id: '1',
                state: 'SP',
                city: 'São Paulo',
                activityDate: new Date('2024-01-15'),
            } as CampaignRecord,
            {
                id: '2',
                state: 'SP',
                city: 'Campinas',
                activityDate: new Date('2024-01-20'),
            } as CampaignRecord
        ];

        const filters = applyGeographicFilter(createInitialFilterState(), 'city', 'São Paulo');
        const filtered = filterRecords(records, filters);

        expect(filtered).toHaveLength(1);
        expect(filtered[0].id).toBe('1');
        expect(filtered[0].city).toBe('São Paulo');
    });

    it('deve retornar todos os registros quando nenhum filtro é aplicado', () => {
        const records: CampaignRecord[] = [
            {
                id: '1',
                state: 'SP',
                activityDate: new Date('2024-01-15'),
            } as CampaignRecord,
            {
                id: '2',
                state: 'RJ',
                activityDate: new Date('2024-01-20'),
            } as CampaignRecord
        ];

        const filters = createInitialFilterState();
        const filtered = filterRecords(records, filters);

        expect(filtered).toHaveLength(2);
    });
});
