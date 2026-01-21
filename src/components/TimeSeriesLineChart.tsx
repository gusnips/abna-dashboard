/**
 * TimeSeriesLineChart - Displays activities over time
 * 
 * Shows a line chart of activities aggregated by date (daily)
 * 
 * Requirements: 3.3, 3.5, 3.6
 */

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFilters } from '../contexts/FilterContext';
import type { TimeSeriesData } from '../types';

/**
 * TimeSeriesLineChart component
 */
export function TimeSeriesLineChart() {
    const { filteredRecords } = useFilters();

    /**
     * Aggregate activities by date (daily)
     */
    const chartData = useMemo((): TimeSeriesData[] => {
        const dateCountMap = new Map<string, number>();

        // Count activities by date
        for (const record of filteredRecords) {
            // Format date as YYYY-MM-DD for grouping
            const dateStr = record.activityDate.toISOString().split('T')[0];
            const count = dateCountMap.get(dateStr) || 0;
            dateCountMap.set(dateStr, count + 1);
        }

        // Convert to chart data format and sort by date
        const data = Array.from(dateCountMap.entries())
            .map(([date, count]) => ({
                date,
                count,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return data;
    }, [filteredRecords]);

    /**
     * Format date for display (DD/MM/YYYY)
     */
    const formatDate = (dateStr: string): string => {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

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
            <h3 className="chart-title">Atividades ao Longo do Tempo</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value: number | undefined) => value ? [`${value} atividades`, 'Atividades'] : ['', 'Atividades']}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Atividades"
                        dot={{ r: 4, fill: '#10B981' }}
                        activeDot={{ r: 6, fill: '#10B981' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
