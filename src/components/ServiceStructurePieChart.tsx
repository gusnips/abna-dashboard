/**
 * ServiceStructurePieChart - Displays service structure distribution
 * 
 * Shows a pie chart of activities by service structure type:
 * - Sub-comitê
 * - Oficina
 * - Área
 * - Outros
 * 
 * Requirements: 3.1, 3.5, 3.6
 */

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useFilters } from '../contexts/FilterContext';
import type { ChartData } from '../types';

/**
 * Consistent color palette for pie chart segments
 */
const COLORS = ['#3B82F6', '#10B981', '#FBBF24', '#F97316', '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1'];

/**
 * ServiceStructurePieChart component
 */
export function ServiceStructurePieChart() {
    const { filteredRecords } = useFilters();

    /**
     * Aggregate data by serviceStructure field
     */
    const chartData = useMemo((): ChartData[] => {
        const structureCountMap = new Map<string, number>();

        // Count activities by service structure
        for (const record of filteredRecords) {
            const structure = record.serviceStructure;
            const count = structureCountMap.get(structure) || 0;
            structureCountMap.set(structure, count + 1);
        }

        // Convert to chart data format
        return Array.from(structureCountMap.entries()).map(([name, value]) => ({
            name,
            value,
        }));
    }, [filteredRecords]);

    // Handle empty data state
    if (chartData.length === 0) {
        return (
            <div className="chart-empty-state">
                <p className="chart-empty-text">Nenhum dado disponível</p>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3 className="chart-title">Estrutura de Serviço</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number | undefined) => value ? `${value} atividades` : ''} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
