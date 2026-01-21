/**
 * SummaryCards container component
 * 
 * Displays all 6 summary statistics in a responsive grid layout:
 * - Quantidade de Atividades
 * - Servidores
 * - Participantes
 * - Estados
 * - Materiais Doados
 * - Custo Total
 */

import { useMemo } from 'react';
import { useFilters } from '../contexts/FilterContext';
import { calculateSummaryStatistics } from '../utils/aggregation';
import { SummaryCard } from './SummaryCard';

/**
 * SummaryCards component that calculates and displays all summary statistics
 */
export function SummaryCards() {
    const { filteredRecords } = useFilters();

    // Calculate summary statistics from filtered records
    const stats = useMemo(() => {
        return calculateSummaryStatistics(filteredRecords);
    }, [filteredRecords]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <SummaryCard
                title="Quantidade de Atividades"
                value={stats.activityCount}
                format="number"
            />

            <SummaryCard
                title="Servidores"
                value={stats.serversCount}
                format="number"
            />

            <SummaryCard
                title="Participantes"
                value={stats.participantsCount}
                format="number"
            />

            <SummaryCard
                title="Estados"
                value={stats.statesCount}
                format="number"
            />

            <SummaryCard
                title="Materiais Doados"
                value={stats.totalMaterials}
                format="number"
            />

            <SummaryCard
                title="Custo Total"
                value={stats.totalCost}
                format="currency"
            />
        </div>
    );
}
