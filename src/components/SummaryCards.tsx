/**
 * Componente container SummaryCards
 * 
 * Exibe todas as estatísticas resumidas em um layout de grade responsivo:
 * - Quantidade de Atividades
 * - Servidores
 * - Participantes
 * - Público Atingido
 * - Estados
 * - Cidades
 * - Materiais Doados
 * - Custo Total
 */

import { useMemo } from 'react';
import { useFilters } from '../contexts/FilterContext';
import { calculateSummaryStatistics } from '../utils/aggregation';
import { SummaryCardsView } from './SummaryCardsView';

/**
 * Componente SummaryCards que calcula e exibe todas as estatísticas resumidas
 */
export function SummaryCards() {
    const { filteredRecords } = useFilters();

    // Calcula estatísticas resumidas a partir dos registros filtrados
    const stats = useMemo(() => {
        return calculateSummaryStatistics(filteredRecords);
    }, [filteredRecords]);

    return <SummaryCardsView stats={stats} />;
}
