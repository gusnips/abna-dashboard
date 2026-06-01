/**
 * RegionalActivityChart - Exibe contagens de atividades por região (CSR) ou por CSA
 *
 * O comportamento é determinado pelo filtro geográfico ativo:
 * - Quando uma região específica (CSR) é selecionada, detalha as CSAs
 *   que pertencem àquela região ("Atividades por CSA").
 * - Caso contrário (ex: "Brasil Todo"), mostra contagens de atividades por região
 *   ("Atividades por Região / CSR").
 */

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFilters } from '../contexts/FilterContext';
import { rankCSRsByActivityCount, rankCSAsByActivityCount } from '../utils';
import { ChartGradients } from './ChartGradients';
import { BAR_FILL } from './chartTheme';
import type { ChartData } from '../types';

/**
 * Componente RegionalActivityChart
 */
export function RegionalActivityChart() {
    const { filteredRecords, filters } = useFilters();

    // Detalha CSAs apenas quando uma região específica (CSR) é selecionada
    const isCSAMode = filters.geographicScope === 'region' && Boolean(filters.selectedRegion);

    const title = isCSAMode ? 'Atividades por CSA' : 'Atividades por Região (CSR)';

    const chartData = useMemo((): ChartData[] => {
        if (isCSAMode && filters.selectedRegion) {
            return rankCSAsByActivityCount(filteredRecords, filters.selectedRegion);
        }
        return rankCSRsByActivityCount(filteredRecords);
    }, [filteredRecords, isCSAMode, filters.selectedRegion]);

    // Gerencia estado de dados vazio
    if (chartData.length === 0) {
        return (
            <div className="chart-container">
                <h3 className="chart-title">{title}</h3>
                <div className="chart-empty-state">
                    <p className="chart-empty-text">Nenhum dado disponível</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3 className="chart-title">{title}</h3>
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
                    <Tooltip cursor={{ fill: 'rgb(20 184 166 / 0.08)' }} formatter={(value: number | undefined) => value ? `${value} atividades` : ''} />
                    <Legend iconType="circle" />
                    <Bar dataKey="value" fill={BAR_FILL.teal} name="Atividades" radius={[6, 6, 0, 0]} maxBarSize={72} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
