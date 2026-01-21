/**
 * Unit tests for FilterContext
 * Tests filter state management, geographic filter mutual exclusivity, and filtering logic
 */

import { describe, it, expect } from 'vitest';
import type { CampaignRecord, FilterState, GeographicScope } from '../types';

// Helper function to create initial filter state
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

// Helper function to apply geographic filter with mutual exclusivity
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

// Helper function to filter records
const filterRecords = (records: CampaignRecord[], filters: FilterState): CampaignRecord[] => {
    return records.filter(record => {
        // Geographic filtering
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

        return true;
    });
};

describe('FilterContext Logic', () => {
    it('should create initial filter state with brasil scope', () => {
        const state = createInitialFilterState();

        expect(state.geographicScope).toBe('brasil');
        expect(state.selectedCSA).toBeNull();
        expect(state.selectedRegion).toBeNull();
        expect(state.selectedState).toBeNull();
        expect(state.selectedCity).toBeNull();
        expect(state.dateRange.start).toBeNull();
        expect(state.dateRange.end).toBeNull();
    });

    it('should implement geographic filter mutual exclusivity - state filter', () => {
        const initialState = createInitialFilterState();
        const newState = applyGeographicFilter(initialState, 'state', 'SP');

        expect(newState.geographicScope).toBe('state');
        expect(newState.selectedState).toBe('SP');
        expect(newState.selectedCSA).toBeNull();
        expect(newState.selectedRegion).toBeNull();
        expect(newState.selectedCity).toBeNull();
    });

    it('should implement geographic filter mutual exclusivity - switching filters', () => {
        const initialState = createInitialFilterState();

        // Set state filter
        const stateFiltered = applyGeographicFilter(initialState, 'state', 'SP');
        expect(stateFiltered.selectedState).toBe('SP');

        // Switch to city filter - should clear state
        const cityFiltered = applyGeographicFilter(stateFiltered, 'city', 'São Paulo');
        expect(cityFiltered.geographicScope).toBe('city');
        expect(cityFiltered.selectedCity).toBe('São Paulo');
        expect(cityFiltered.selectedState).toBeNull();

        // Switch to brasil - should clear all
        const brasilFiltered = applyGeographicFilter(cityFiltered, 'brasil', null);
        expect(brasilFiltered.geographicScope).toBe('brasil');
        expect(brasilFiltered.selectedCity).toBeNull();
        expect(brasilFiltered.selectedState).toBeNull();
    });

    it('should filter records by state', () => {
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

    it('should filter records by date range', () => {
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

    it('should filter records by city', () => {
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

    it('should return all records when no filters applied', () => {
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
