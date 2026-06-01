/**
 * CSRPillNav - Linha de pills de navegação rápida para seleção de CSR (região)
 *
 * Uma linha compacta e com quebra de pills (uma por CSR) usada como seletor rápido
 * para abrir o relatório detalhado de uma região. Cada pill carrega sua contagem
 * de atividades como badge para que a linha permaneça informativa, não apenas decorativa.
 */

import { Link } from 'react-router-dom';
import { csrToSlug } from '../utils';

export interface CSRPillItem {
    name: string;
    count: number;
}

interface CSRPillNavProps {
    items: CSRPillItem[];
}

export function CSRPillNav({ items }: CSRPillNavProps) {
    if (items.length === 0) return null;

    return (
        <nav aria-label="Selecionar CSR" className="flex flex-wrap gap-2">
            {items.map((item) => (
                <Link
                    key={item.name}
                    to={`/csr/${csrToSlug(item.name)}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-abna-primary hover:text-abna-primary focus:outline-none focus:ring-2 focus:ring-abna-primary"
                >
                    <span>{item.name}</span>
                    <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-ink-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-ink-600 transition-colors group-hover:bg-abna-primary group-hover:text-white">
                        {item.count}
                    </span>
                </Link>
            ))}
        </nav>
    );
}
