/**
 * TimeSeriesLineChart - Exibe atividades ao longo do tempo
 * 
 * Mostra um gráfico de linha de atividades agregadas por data (diário)
 * 
 * Requisitos: 3.3, 3.5, 3.6
 */

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFilters } from '../contexts/FilterContext';
import type { TimeSeriesData } from '../types';

/**
 * Componente TimeSeriesLineChart
 */
export function TimeSeriesLineChart() {
    const { filteredRecords } = useFilters();

    /**
     * Agrega atividades por data (diário)
     */
    const chartData = useMemo((): TimeSeriesData[] => {
        const dateCountMap = new Map<string, number>();

        // Conta atividades por data
        for (const record of filteredRecords) {
            // Formata data como YYYY-MM-DD para agrupamento
            const dateStr = record.activityDate.toISOString().split('T')[0];
            const count = dateCountMap.get(dateStr) || 0;
            dateCountMap.set(dateStr, count + 1);
        }

        // Converte para formato de dados do gráfico e ordena por data
        const data = Array.from(dateCountMap.entries())
            .map(([date, count]) => ({
                date,
                count,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return data;
    }, [filteredRecords]);

    /**
     * Formata data para exibição (DD/MM/YYYY)
     */
    const formatDate = (dateStr: string): string => {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    // Gerencia estado de dados vazio
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
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="ts-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0E9F6E" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#0E9F6E" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tickLine={false}
                    />
                    <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} tickLine={false} axisLine={false} />
                    <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value: number | undefined) => value ? [`${value} atividades`, 'Atividades'] : ['', 'Atividades']}
                    />
                    <Legend iconType="circle" />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#0E9F6E"
                        strokeWidth={2.5}
                        fill="url(#ts-area)"
                        name="Atividades"
                        dot={{ r: 3, fill: '#0E9F6E', strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#0E9F6E', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
