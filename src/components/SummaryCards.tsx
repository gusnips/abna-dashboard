/**
 * SummaryCards container component
 * 
 * Displays all 7 summary statistics in a responsive grid layout:
 * - Total de Painéis
 * - Qtdade Residentes 1ª Vez
 * - Qtdade Total de Residentes
 * - Valor Repasse
 * - Qtdade Oradores
 * - Público Atingido
 * - Participantes
 * 
 * Requirements: 4.1-4.7
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <SummaryCard
                title="Total de Painéis"
                value={stats.totalPanels}
                format="number"
            />

            <SummaryCard
                title="Qtdade Residentes 1ª Vez"
                value={stats.firstTimeResidents}
                format="number"
            />

            <SummaryCard
                title="Qtdade Total de Residentes"
                value={stats.totalResidents}
                format="number"
            />

            <SummaryCard
                title="Valor Repasse"
                value={stats.transferAmount}
                format="currency"
            />

            <SummaryCard
                title="Qtdade Oradores"
                value={stats.speakersCount}
                format="number"
            />

            <SummaryCard
                title="Público Atingido"
                value={stats.audienceReached}
                format="number"
            />

            <SummaryCard
                title="Participantes"
                value={stats.participantsCount}
                format="number"
            />
        </div>
    );
}
