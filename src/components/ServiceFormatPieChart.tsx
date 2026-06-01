/**
 * ServiceFormatPieChart - Exibe distribuição de formato de atendimento
 *
 * Mostra um gráfico de pizza de atividades por formato de atendimento (activityFormat):
 * - Presencial
 * - Híbrido
 * - Virtual
 * - Online
 */

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useFilters } from '../contexts/FilterContext';
import { countByField } from '../utils';
import { ChartGradients } from './ChartGradients';
import { CHART_COLORS } from './chartTheme';
import type { ChartData } from '../types';

/**
 * Componente ServiceFormatPieChart
 */
export function ServiceFormatPieChart() {
    const { filteredRecords } = useFilters();

    /**
     * Agrega dados pelo campo activityFormat
     */
    const chartData = useMemo((): ChartData[] => {
        return countByField(filteredRecords, (record) => record.activityFormat);
    }, [filteredRecords]);

    // Gerencia estado de dados vazio
    if (chartData.length === 0) {
        return (
            <div className="chart-container">
                <h3 className="chart-title">Formato de Atendimento</h3>
                <div className="chart-empty-state">
                    <p className="chart-empty-text">Nenhum dado disponível</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3 className="chart-title">Formato de Atendimento</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <ChartGradients />
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                        innerRadius={48}
                        outerRadius={84}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="#ffffff"
                        strokeWidth={2}
                    >
                        {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#seg-grad-${index % CHART_COLORS.length})`} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number | undefined) => value ? `${value} atividades` : ''} />
                    <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
