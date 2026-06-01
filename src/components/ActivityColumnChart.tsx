/**
 * ActivityColumnChart - Exibe distribuição de atividades realizadas
 *
 * Mostra um gráfico de barras de atividades pelo campo "Qual atividade realizada?"
 * (activityDescription). Limitado às principais entradas para manter a legibilidade
 * já que este é um campo de texto livre.
 */

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFilters } from '../contexts/FilterContext';
import { countByField } from '../utils';
import { ChartGradients } from './ChartGradients';
import { BAR_FILL } from './chartTheme';
import type { ChartData } from '../types';

/** Limite de atividades distintas mostradas para manter o gráfico legível */
const TOP_N = 15;

/**
 * Componente ActivityColumnChart
 */
export function ActivityColumnChart() {
    const { filteredRecords } = useFilters();

    /**
     * Agrega dados pelo campo activityDescription (top N por contagem)
     */
    const chartData = useMemo((): ChartData[] => {
        return countByField(filteredRecords, (record) => record.activityDescription, TOP_N);
    }, [filteredRecords]);

    // Gerencia estado de dados vazio
    if (chartData.length === 0) {
        return (
            <div className="chart-container">
                <h3 className="chart-title">Atividade Realizada</h3>
                <div className="chart-empty-state">
                    <p className="chart-empty-text">Nenhum dado disponível</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3 className="chart-title">Atividade Realizada</h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ bottom: 90 }}>
                    <ChartGradients />
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={120}
                        interval={0}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                    />
                    <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgb(99 102 241 / 0.08)' }} formatter={(value: number | undefined) => value ? `${value} atividades` : ''} />
                    <Legend iconType="circle" />
                    <Bar dataKey="value" fill={BAR_FILL.indigo} name="Atividades" radius={[6, 6, 0, 0]} maxBarSize={56} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
