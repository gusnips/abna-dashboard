/**
 * ActivityTypeColumnChart - Exibe distribuição de tipos de atividade
 * 
 * Mostra um gráfico de barras de atividades por tipo de atividade
 * 
 * Requisitos: 3.2, 3.5, 3.6
 */

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { useFilters } from '../contexts/FilterContext';
import { ChartGradients } from './ChartGradients';
import { BAR_FILL } from './chartTheme';
import type { ChartData } from '../types';

/**
 * Componente ActivityTypeColumnChart
 */
export function ActivityTypeColumnChart() {
    const { filteredRecords } = useFilters();

    /**
     * Agrega dados pelo campo activityType
     */
    const chartData = useMemo((): ChartData[] => {
        const activityTypeCountMap = new Map<string, number>();

        // Conta atividades por tipo
        for (const record of filteredRecords) {
            const activityType = record.activityType;
            const count = activityTypeCountMap.get(activityType) || 0;
            activityTypeCountMap.set(activityType, count + 1);
        }

        // Converte para formato de dados do gráfico e ordena por contagem (decrescente)
        return Array.from(activityTypeCountMap.entries())
            .map(([name, value]) => ({
                name,
                value,
            }))
            .sort((a, b) => b.value - a.value);
    }, [filteredRecords]);

    // Gerencia estado de dados vazio
    if (chartData.length === 0) {
        return (
            <div className="chart-container">
                <h3 className="chart-title">Tipo de Atividade</h3>
                <div className="chart-empty-state">
                    <p className="chart-empty-text">Nenhum dado disponível</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3 className="chart-title">Tipo de Atividade</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <ChartGradients />
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                        tickLine={false}
                    />
                    <Tooltip cursor={{ fill: 'rgb(37 99 235 / 0.08)' }} formatter={(value: number | undefined) => value ? `${value} atividades` : ''} />
                    <Legend iconType="circle" />
                    <Bar dataKey="value" fill={BAR_FILL.blue} name="Atividades" radius={[6, 6, 0, 0]} maxBarSize={72}>
                        <LabelList dataKey="value" position="insideTop" fill="#0f172a" fontSize={12} fontWeight={700} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
