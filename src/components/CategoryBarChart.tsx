/**
 * CategoryBarChart - Gráfico de barras apresentacional reutilizável
 *
 * Renderiza um gráfico de barras vertical a partir de dados pré-agregados { name, value }.
 * Diferente dos gráficos do dashboard, este componente é puramente apresentacional e
 * recebe seus dados via props, então pode ser usado fora do FilterProvider
 * (ex: nas páginas CSR independentes). O estilo segue o tema de gráficos compartilhado.
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartGradients } from './ChartGradients';
import { BAR_FILL } from './chartTheme';
import type { ChartData } from '../types';

type BarFillKey = keyof typeof BAR_FILL;

interface CategoryBarChartProps {
    title: string;
    data: ChartData[];
    /** Chave de gradiente da barra do tema compartilhado. Padrão é "blue". */
    color?: BarFillKey;
    /** Altura do gráfico em pixels. Padrão é 400. */
    height?: number;
    /** Nome da série mostrado no tooltip/legenda. Padrão é "Atividades". */
    seriesName?: string;
}

export function CategoryBarChart({
    title,
    data,
    color = 'blue',
    height = 400,
    seriesName = 'Atividades',
}: CategoryBarChartProps) {
    if (data.length === 0) {
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
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={data} margin={{ bottom: 90 }}>
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
                    <YAxis
                        label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgb(37 99 235 / 0.08)' }}
                        formatter={(value: number | undefined) => value ? `${value} ${seriesName.toLowerCase()}` : ''}
                    />
                    <Legend iconType="circle" />
                    <Bar dataKey="value" fill={BAR_FILL[color]} name={seriesName} radius={[6, 6, 0, 0]} maxBarSize={72} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
