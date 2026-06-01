import { formatNumber, formatCurrency } from '../utils';

type Accent = 'blue' | 'green' | 'amber' | 'teal' | 'indigo' | 'purple' | 'pink';

interface SummaryCardProps {
    title: string;
    value: number | string;
    format?: 'number' | 'currency';
    icon?: React.ReactNode;
    accent?: Accent;
}

/** Combinações de gradiente + tonalidade para o chip do ícone e linha de destaque superior. */
const ACCENTS: Record<Accent, { chip: string; bar: string; text: string }> = {
    blue: { chip: 'from-blue-500 to-blue-700', bar: 'from-blue-500 to-blue-700', text: 'text-blue-600' },
    green: { chip: 'from-emerald-400 to-emerald-600', bar: 'from-emerald-400 to-emerald-600', text: 'text-emerald-600' },
    amber: { chip: 'from-amber-400 to-amber-600', bar: 'from-amber-400 to-amber-600', text: 'text-amber-600' },
    teal: { chip: 'from-teal-400 to-teal-600', bar: 'from-teal-400 to-teal-600', text: 'text-teal-600' },
    indigo: { chip: 'from-indigo-400 to-indigo-600', bar: 'from-indigo-400 to-indigo-600', text: 'text-indigo-600' },
    purple: { chip: 'from-violet-400 to-violet-600', bar: 'from-violet-400 to-violet-600', text: 'text-violet-600' },
    pink: { chip: 'from-pink-400 to-pink-600', bar: 'from-pink-400 to-pink-600', text: 'text-pink-600' },
};

/**
 * Componente SummaryCard exibe uma única estatística resumida
 *
 * @param title - O rótulo/título da estatística
 * @param value - O valor numérico ou string a ser exibido
 * @param format - Tipo de formato opcional: 'number' (com separadores de milhar) ou 'currency' (R$)
 * @param icon - Elemento de ícone opcional a ser exibido
 * @param accent - Tema de cor de destaque opcional para o chip do ícone / linha de destaque
 *
 * Requisitos: 4.8, 4.9
 */
export function SummaryCard({ title, value, format, icon, accent = 'blue' }: SummaryCardProps) {
    const tone = ACCENTS[accent];

    // Formata o valor com base na prop format
    const formattedValue = (() => {
        if (typeof value === 'string') {
            return value;
        }

        switch (format) {
            case 'currency':
                return formatCurrency(value);
            case 'number':
                return formatNumber(value);
            default:
                return value.toString();
        }
    })();

    return (
        <div className="group surface surface-hover relative overflow-hidden p-5">
            {/* Linha de destaque superior */}
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone.bar}`} />

            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                        {title}
                    </h3>
                    <p className="mt-2 text-2xl md:text-3xl font-bold text-ink-900 tabular-nums tracking-tight">
                        {formattedValue}
                    </p>
                </div>
                {icon && (
                    <div
                        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tone.chip} text-white shadow-soft transition-transform duration-300 group-hover:scale-105`}
                    >
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
