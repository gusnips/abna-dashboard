/**
 * ActivityByHourChart - Exibe atividades distribuídas ao longo das horas do dia
 *
 * Agrupa o campo bruto "Horário" (activityTime) em buckets de hora inteira
 * (ex: "14h") e mostra a contagem por hora. Um gráfico de barras é usado pois
 * a distribuição por hora do dia é discreta.
 */

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFilters } from '../contexts/FilterContext';
import { aggregateByHour } from '../utils';
import { ChartGradients } from './ChartGradients';
import { BAR_FILL } from './chartTheme';
import type { ChartData } from '../types';

/**
 * Componente ActivityByHourChart
 */
export function ActivityByHourChart() {
    const { filteredRecords } = useFilters();

    /**
     * Agrega atividades em buckets de hora do dia, ordenados cronologicamente
     */
    const chartData = useMemo((): ChartData[] => {
        return aggregateByHour(filteredRecords);
    }, [filteredRecords]);

    // Gerencia estado de dados vazio
    if (chartData.length === 0) {
        return (
            <div className="chart-container">
                <h3 className="chart-title">Atividades por Horário</h3>
                <div className="chart-empty-state">
                    <p className="chart-empty-text">Nenhum dado disponível</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3 className="chart-title">Atividades por Horário</h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                    <ChartGradients />
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} tickLine={false} />
                    <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgb(245 158 11 / 0.08)' }} formatter={(value: number | undefined) => value ? `${value} atividades` : ''} />
                    <Legend iconType="circle" />
                    <Bar dataKey="value" fill={BAR_FILL.amber} name="Atividades" radius={[6, 6, 0, 0]} maxBarSize={64} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
