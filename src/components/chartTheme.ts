/**
 * Constantes de tema de gráfico compartilhadas
 *
 * Local central para a paleta de gráficos e definições de gradiente do dashboard.
 * Manter isso aqui significa que cada componente Recharts renderiza com a mesma
 * aparência coesa (preenchimentos de gradiente, barras arredondadas, cores consistentes).
 *
 * O componente <ChartGradients /> correspondente (que registra as definições SVG de gradiente)
 * está em ./ChartGradients.
 */

/** Paleta categórica coesa usada para gráficos de pizza/segmentados. */
export const CHART_COLORS = [
    '#2563EB', // azul
    '#0E9F6E', // verde
    '#F59E0B', // âmbar
    '#F97316', // laranja
    '#8B5CF6', // roxo
    '#EC4899', // rosa
    '#14B8A6', // teal
    '#6366F1', // índigo
];

/**
 * Cada id de gradiente mapeia para um preenchimento vertical (topo -> base) usado por barras/áreas.
 * Referencie com fill={`url(#${id})`}.
 */
export const GRADIENTS: { id: string; from: string; to: string }[] = [
    { id: 'grad-blue', from: '#3B82F6', to: '#1D4ED8' },
    { id: 'grad-green', from: '#34D399', to: '#0E9F6E' },
    { id: 'grad-amber', from: '#FBBF24', to: '#F59E0B' },
    { id: 'grad-teal', from: '#2DD4BF', to: '#0D9488' },
    { id: 'grad-indigo', from: '#818CF8', to: '#4F46E5' },
    { id: 'grad-purple', from: '#A78BFA', to: '#7C3AED' },
];

/** Mapa de conveniência de urls de preenchimento de gradiente indexado por nome amigável. */
export const BAR_FILL = {
    blue: 'url(#grad-blue)',
    green: 'url(#grad-green)',
    amber: 'url(#grad-amber)',
    teal: 'url(#grad-teal)',
    indigo: 'url(#grad-indigo)',
    purple: 'url(#grad-purple)',
} as const;
