/**
 * Unit tests for aggregation utilities
 */

import { describe, it, expect } from 'vitest';
import {
    calculateSummaryStatistics,
    rankCitiesByActivityCount,
    rankStatesByActivityCount,
    aggregateMaterials,
    formatNumber,
    formatCurrency,
} from './aggregation';
import type { CampaignRecord } from '../types';

// Helper to create a minimal campaign record for testing
function createMockRecord(overrides: Partial<CampaignRecord> = {}): CampaignRecord {
    return {
        id: '1',
        timestamp: new Date('2024-01-15'),
        email: 'test@example.com',
        name: 'Test User',
        phone: '11999999999',
        position: 'Coordenador',
        selectedCSR: 'CSR Brasil',
        csrCSAMap: {},
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Centro',
        activityDate: new Date('2024-01-15'),
        activityTime: '14:00',
        serviceStructure: 'Sub-comitê',
        activityFormat: 'Presencial',
        institution: 'Hospital Central',
        activityType: 'Apresentação',
        activityDescription: 'Apresentação sobre NA',
        speakersCount: 2,
        participantsCount: 30,
        audienceReached: 50,
        serviceCost: 100,
        materials: {
            cartazes: 10,
            panfletos: 50,
            listaGrupos: 5,
            cartao: 20,
            folder: 15,
            ips: 10,
            folhetos: 25,
            textoBasico: 3,
            pastaRP: 2,
            lixoCar: 1,
            calendario: 5,
            outros: 8,
        },
        observations: 'Teste',
        ...overrides,
    };
}

describe('calculateSummaryStatistics', () => {
    it('should return zero statistics for empty array', () => {
        const stats = calculateSummaryStatistics([]);

        expect(stats.activityCount).toBe(0);
        expect(stats.serversCount).toBe(0);
        expect(stats.participantsCount).toBe(0);
        expect(stats.statesCount).toBe(0);
        expect(stats.totalMaterials).toBe(0);
        expect(stats.totalCost).toBe(0);
    });

    it('should calculate correct totals for single record', () => {
        const record = createMockRecord({
            state: 'SP',
            speakersCount: 3,
            participantsCount: 25,
            serviceCost: 150,
            materials: {
                cartazes: 10,
                panfletos: 20,
                listaGrupos: 5,
                cartao: 0,
                folder: 0,
                ips: 0,
                folhetos: 0,
                textoBasico: 0,
                pastaRP: 0,
                lixoCar: 0,
                calendario: 0,
                outros: 0,
            },
        });

        const stats = calculateSummaryStatistics([record]);

        expect(stats.activityCount).toBe(1);
        expect(stats.serversCount).toBe(3);
        expect(stats.participantsCount).toBe(25);
        expect(stats.statesCount).toBe(1);
        expect(stats.totalMaterials).toBe(35); // 10 + 20 + 5
        expect(stats.totalCost).toBe(150);
    });

    it('should aggregate statistics across multiple records', () => {
        const records = [
            createMockRecord({
                state: 'SP',
                speakersCount: 2,
                participantsCount: 20,
                serviceCost: 100,
                materials: {
                    cartazes: 10,
                    panfletos: 20,
                    listaGrupos: 0,
                    cartao: 0,
                    folder: 0,
                    ips: 0,
                    folhetos: 0,
                    textoBasico: 0,
                    pastaRP: 0,
                    lixoCar: 0,
                    calendario: 0,
                    outros: 0,
                },
            }),
            createMockRecord({
                state: 'RJ',
                speakersCount: 3,
                participantsCount: 15,
                serviceCost: 150,
                materials: {
                    cartazes: 5,
                    panfletos: 10,
                    listaGrupos: 5,
                    cartao: 0,
                    folder: 0,
                    ips: 0,
                    folhetos: 0,
                    textoBasico: 0,
                    pastaRP: 0,
                    lixoCar: 0,
                    calendario: 0,
                    outros: 0,
                },
            }),
            createMockRecord({
                state: 'SP',
                speakersCount: 1,
                participantsCount: 10,
                serviceCost: 50,
                materials: {
                    cartazes: 0,
                    panfletos: 15,
                    listaGrupos: 0,
                    cartao: 0,
                    folder: 0,
                    ips: 0,
                    folhetos: 0,
                    textoBasico: 0,
                    pastaRP: 0,
                    lixoCar: 0,
                    calendario: 0,
                    outros: 0,
                },
            }),
        ];

        const stats = calculateSummaryStatistics(records);

        expect(stats.activityCount).toBe(3);
        expect(stats.serversCount).toBe(6); // 2 + 3 + 1
        expect(stats.participantsCount).toBe(45); // 20 + 15 + 10
        expect(stats.statesCount).toBe(2); // SP and RJ
        expect(stats.totalMaterials).toBe(65); // 10+20 + 5+10+5 + 15
        expect(stats.totalCost).toBe(300); // 100 + 150 + 50
    });

    it('should count unique states correctly', () => {
        const records = [
            createMockRecord({ state: 'SP' }),
            createMockRecord({ state: 'SP' }),
            createMockRecord({ state: 'RJ' }),
            createMockRecord({ state: 'MG' }),
            createMockRecord({ state: 'SP' }),
        ];

        const stats = calculateSummaryStatistics(records);

        expect(stats.statesCount).toBe(3); // SP, RJ, MG
    });
});

describe('rankCitiesByActivityCount', () => {
    it('should return empty array for empty input', () => {
        const ranking = rankCitiesByActivityCount([]);
        expect(ranking).toEqual([]);
    });

    it('should rank cities by activity count in descending order', () => {
        const records = [
            createMockRecord({ city: 'São Paulo' }),
            createMockRecord({ city: 'São Paulo' }),
            createMockRecord({ city: 'São Paulo' }),
            createMockRecord({ city: 'Rio de Janeiro' }),
            createMockRecord({ city: 'Rio de Janeiro' }),
            createMockRecord({ city: 'Belo Horizonte' }),
        ];

        const ranking = rankCitiesByActivityCount(records);

        expect(ranking).toHaveLength(3);
        expect(ranking[0]).toEqual({ name: 'São Paulo', count: 3, rank: 1 });
        expect(ranking[1]).toEqual({ name: 'Rio de Janeiro', count: 2, rank: 2 });
        expect(ranking[2]).toEqual({ name: 'Belo Horizonte', count: 1, rank: 3 });
    });

    it('should ignore records with null city', () => {
        const records = [
            createMockRecord({ city: 'São Paulo' }),
            createMockRecord({ city: null }),
            createMockRecord({ city: 'São Paulo' }),
        ];

        const ranking = rankCitiesByActivityCount(records);

        expect(ranking).toHaveLength(1);
        expect(ranking[0]).toEqual({ name: 'São Paulo', count: 2, rank: 1 });
    });
});

describe('rankStatesByActivityCount', () => {
    it('should return empty array for empty input', () => {
        const ranking = rankStatesByActivityCount([]);
        expect(ranking).toEqual([]);
    });

    it('should rank states by activity count in descending order', () => {
        const records = [
            createMockRecord({ state: 'SP' }),
            createMockRecord({ state: 'SP' }),
            createMockRecord({ state: 'SP' }),
            createMockRecord({ state: 'RJ' }),
            createMockRecord({ state: 'RJ' }),
            createMockRecord({ state: 'MG' }),
        ];

        const ranking = rankStatesByActivityCount(records);

        expect(ranking).toHaveLength(3);
        expect(ranking[0]).toEqual({ name: 'SP', count: 3, rank: 1 });
        expect(ranking[1]).toEqual({ name: 'RJ', count: 2, rank: 2 });
        expect(ranking[2]).toEqual({ name: 'MG', count: 1, rank: 3 });
    });
});

describe('aggregateMaterials', () => {
    it('should return all material types with zero quantities for empty array', () => {
        const materials = aggregateMaterials([]);

        expect(materials).toHaveLength(12);
        expect(materials.every(m => m.quantity === 0)).toBe(true);
    });

    it('should aggregate materials across multiple records', () => {
        const records = [
            createMockRecord({
                materials: {
                    cartazes: 10,
                    panfletos: 20,
                    listaGrupos: 5,
                    cartao: 0,
                    folder: 0,
                    ips: 0,
                    folhetos: 0,
                    textoBasico: 0,
                    pastaRP: 0,
                    lixoCar: 0,
                    calendario: 0,
                    outros: 0,
                },
            }),
            createMockRecord({
                materials: {
                    cartazes: 5,
                    panfletos: 30,
                    listaGrupos: 10,
                    cartao: 0,
                    folder: 0,
                    ips: 0,
                    folhetos: 0,
                    textoBasico: 0,
                    pastaRP: 0,
                    lixoCar: 0,
                    calendario: 0,
                    outros: 0,
                },
            }),
        ];

        const materials = aggregateMaterials(records);

        const panfletos = materials.find(m => m.material === 'Panfletos');
        const cartazes = materials.find(m => m.material === 'Cartazes');
        const listaGrupos = materials.find(m => m.material === 'Lista de Grupos');

        expect(panfletos?.quantity).toBe(50);
        expect(cartazes?.quantity).toBe(15);
        expect(listaGrupos?.quantity).toBe(15);
    });

    it('should sort materials by quantity in descending order', () => {
        const records = [
            createMockRecord({
                materials: {
                    cartazes: 5,
                    panfletos: 50,
                    listaGrupos: 20,
                    cartao: 0,
                    folder: 0,
                    ips: 0,
                    folhetos: 0,
                    textoBasico: 0,
                    pastaRP: 0,
                    lixoCar: 0,
                    calendario: 0,
                    outros: 0,
                },
            }),
        ];

        const materials = aggregateMaterials(records);

        // Check that quantities are in descending order
        for (let i = 1; i < materials.length; i++) {
            expect(materials[i].quantity).toBeLessThanOrEqual(materials[i - 1].quantity);
        }
    });

    it('should include all 12 material types with Portuguese labels', () => {
        const materials = aggregateMaterials([]);

        const expectedMaterials = [
            'Cartazes',
            'Panfletos',
            'Lista de Grupos',
            'Cartão',
            'Folder',
            'IPs',
            'Folhetos',
            'Texto Básico',
            'Pasta RP',
            'Lixo Car',
            'Calendário',
            'Outros Materiais',
        ];

        const materialNames = materials.map(m => m.material);
        expectedMaterials.forEach(expected => {
            expect(materialNames).toContain(expected);
        });
    });
});

describe('formatNumber', () => {
    it('should format integers with thousand separators', () => {
        expect(formatNumber(1234567)).toBe('1.234.567');
        expect(formatNumber(1000)).toBe('1.000');
        expect(formatNumber(100)).toBe('100');
    });

    it('should format decimals with specified precision', () => {
        expect(formatNumber(1234.56, 2)).toBe('1.234,56');
        expect(formatNumber(1234.5, 2)).toBe('1.234,50');
    });

    it('should handle zero', () => {
        expect(formatNumber(0)).toBe('0');
        expect(formatNumber(0, 2)).toBe('0,00');
    });
});

describe('formatCurrency', () => {
    it('should format currency with R$ symbol', () => {
        const formatted = formatCurrency(1234.56);
        expect(formatted).toContain('R$');
        expect(formatted).toContain('1.234,56');
    });

    it('should handle zero', () => {
        const formatted = formatCurrency(0);
        expect(formatted).toContain('R$');
        expect(formatted).toContain('0,00');
    });

    it('should handle large amounts', () => {
        const formatted = formatCurrency(1234567.89);
        expect(formatted).toContain('R$');
        expect(formatted).toContain('1.234.567,89');
    });
});
