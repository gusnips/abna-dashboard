/**
 * Data aggregation utilities for ABNA Campaign Dashboard
 * 
 * This module provides functions for:
 * - Calculating summary statistics
 * - Ranking geographic locations by activity count
 * - Aggregating material distribution data
 * - Formatting numbers and currency for Brazilian locale
 */

import type {
    CampaignRecord,
    SummaryStatistics,
    RankingItem,
    MaterialRow,
} from '../types';

// ============================================================================
// Summary Statistics
// ============================================================================

/**
 * Calculates aggregated summary statistics from campaign records
 * 
 * @param records - Array of campaign records to aggregate
 * @returns Summary statistics object with all calculated metrics
 */
export function calculateSummaryStatistics(records: CampaignRecord[]): SummaryStatistics {
    if (records.length === 0) {
        return {
            activityCount: 0,
            serversCount: 0,
            participantsCount: 0,
            statesCount: 0,
            totalMaterials: 0,
            totalCost: 0,
        };
    }

    // Count unique states
    const uniqueStates = new Set<string>();

    // Calculate totals
    let totalServers = 0;
    let totalParticipants = 0;
    let totalMaterialsCount = 0;
    let totalCostSum = 0;

    for (const record of records) {
        // Add state to unique set
        if (record.state) {
            uniqueStates.add(record.state);
        }

        // Sum servers (speakers)
        totalServers += record.speakersCount;

        // Sum participants
        totalParticipants += record.participantsCount;

        // Sum all materials
        const materials = record.materials;
        totalMaterialsCount +=
            materials.cartazes +
            materials.panfletos +
            materials.listaGrupos +
            materials.cartao +
            materials.folder +
            materials.ips +
            materials.folhetos +
            materials.textoBasico +
            materials.pastaRP +
            materials.lixoCar +
            materials.calendario +
            materials.outros;

        // Sum cost
        totalCostSum += record.serviceCost;
    }

    return {
        activityCount: records.length,
        serversCount: totalServers,
        participantsCount: totalParticipants,
        statesCount: uniqueStates.size,
        totalMaterials: totalMaterialsCount,
        totalCost: totalCostSum,
    };
}

// ============================================================================
// Geographic Rankings
// ============================================================================

/**
 * Ranks cities by activity count in descending order
 * 
 * @param records - Array of campaign records to analyze
 * @returns Array of ranking items sorted by activity count (descending)
 * 
 * Requirements: 5.1, 5.2
 */
export function rankCitiesByActivityCount(records: CampaignRecord[]): RankingItem[] {
    // Count activities per city
    const cityCountMap = new Map<string, number>();

    for (const record of records) {
        if (record.city) {
            const count = cityCountMap.get(record.city) || 0;
            cityCountMap.set(record.city, count + 1);
        }
    }

    // Convert to array and sort by count (descending)
    const sortedCities = Array.from(cityCountMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    // Assign ranks
    return sortedCities.map((item, index) => ({
        ...item,
        rank: index + 1,
    }));
}

/**
 * Ranks states by activity count in descending order
 * 
 * @param records - Array of campaign records to analyze
 * @returns Array of ranking items sorted by activity count (descending)
 * 
 * Requirements: 5.1, 5.2
 */
export function rankStatesByActivityCount(records: CampaignRecord[]): RankingItem[] {
    // Count activities per state
    const stateCountMap = new Map<string, number>();

    for (const record of records) {
        if (record.state) {
            const count = stateCountMap.get(record.state) || 0;
            stateCountMap.set(record.state, count + 1);
        }
    }

    // Convert to array and sort by count (descending)
    const sortedStates = Array.from(stateCountMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    // Assign ranks
    return sortedStates.map((item, index) => ({
        ...item,
        rank: index + 1,
    }));
}

// ============================================================================
// Material Aggregation
// ============================================================================

/**
 * Material type labels in Portuguese
 */
const MATERIAL_LABELS: Record<keyof CampaignRecord['materials'], string> = {
    cartazes: 'Cartazes',
    panfletos: 'Panfletos',
    listaGrupos: 'Lista de Grupos',
    cartao: 'Cartão',
    folder: 'Folder',
    ips: 'IPs',
    folhetos: 'Folhetos',
    textoBasico: 'Texto Básico',
    pastaRP: 'Pasta RP',
    lixoCar: 'Lixo Car',
    calendario: 'Calendário',
    outros: 'Outros Materiais',
};

/**
 * Aggregates material distribution data across all records
 * 
 * @param records - Array of campaign records to aggregate
 * @returns Array of material rows sorted by quantity (descending)
 * 
 * Requirements: 6.1, 6.3
 */
export function aggregateMaterials(records: CampaignRecord[]): MaterialRow[] {
    // Initialize totals for each material type
    const materialTotals: Record<keyof CampaignRecord['materials'], number> = {
        cartazes: 0,
        panfletos: 0,
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
    };

    // Sum up materials from all records
    for (const record of records) {
        for (const materialKey in materialTotals) {
            const key = materialKey as keyof CampaignRecord['materials'];
            materialTotals[key] += record.materials[key] || 0;
        }
    }

    // Convert to array with Portuguese labels
    const materialRows: MaterialRow[] = Object.entries(materialTotals).map(
        ([key, quantity]) => ({
            material: MATERIAL_LABELS[key as keyof typeof MATERIAL_LABELS],
            quantity,
        })
    );

    // Sort by quantity (descending)
    return materialRows.sort((a, b) => b.quantity - a.quantity);
}

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Formats a number with Brazilian locale conventions
 * Uses period (.) as thousand separator and comma (,) as decimal separator
 * 
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 * 
 * Requirements: 4.9
 * 
 * @example
 * formatNumber(1234567) // "1.234.567"
 * formatNumber(1234.56, 2) // "1.234,56"
 */
export function formatNumber(value: number, decimals: number = 0): string {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

/**
 * Formats a number as Brazilian currency (Real - R$)
 * 
 * @param value - Number to format as currency
 * @returns Formatted currency string with R$ symbol
 * 
 * Requirements: 4.9
 * 
 * @example
 * formatCurrency(1234.56) // "R$ 1.234,56"
 */
export function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}
