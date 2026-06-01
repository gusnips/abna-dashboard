/**
 * ChartGradients - definições de gradiente compartilhadas do Recharts
 *
 * Coloque isso dentro de qualquer gráfico Recharts para registrar todos os gradientes compartilhados.
 * Também registra gradientes verticais por segmento para a paleta categórica
 * (ids: seg-grad-0 ... seg-grad-N) usados por gráficos de pizza.
 */

import { CHART_COLORS, GRADIENTS } from './chartTheme';

export function ChartGradients() {
    return (
        <defs>
            {GRADIENTS.map(({ id, from, to }) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={from} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={to} stopOpacity={0.9} />
                </linearGradient>
            ))}
            {CHART_COLORS.map((color, i) => (
                <linearGradient key={`seg-${i}`} id={`seg-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.78} />
                </linearGradient>
            ))}
        </defs>
    );
}
