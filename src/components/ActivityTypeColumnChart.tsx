/**
 * ActivityTypeColumnChart - Displays activity type distribution
 * 
 * Shows a bar chart of activities by activity type
 * 
 * Requirements: 3.2, 3.5, 3.6
 */

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFilters } from '../contexts/FilterContext';
import type { ChartData } from '../types';

/**
 * ActivityTypeColumnChart component
 */
export function ActivityTypeColumnChart() {
    const { filteredRecords } = useFilters();

    /**
     * Aggregate data by activityType field
     */
    const chartData = useMemo((): ChartData[] => {
        const activityTypeCountMap = new Map<string, number>();

        // Count activities by type
        for (const record of filteredRecords) {
            const activityType = record.activityType;
            const count = activityTypeCountMap.get(activityType) || 0;
            activityTypeCountMap.set(activityType, count + 1);
        }

        // Convert to chart data format and sort by count (descending)
        return Array.from(activityTypeCountMap.entries())
            .map(([name, value]) => ({
                name,
                value,
            }))
            .sort((a, b) => b.value - a.value);
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
            <h3 className="chart-title">Tipo de Atividade</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                    />
                    <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: number | undefined) => value ? `${value} atividades` : ''} />
                    <Legend />
                    <Bar dataKey="value" fill="#3B82F6" name="Atividades" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
