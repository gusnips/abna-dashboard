/**
 * SummaryCardsView - Grade de cards de resumo apresentacional
 *
 * Renderiza os cards de estatísticas resumidas a partir de um objeto stats pré-computado.
 * Puramente apresentacional (sem dependência de contexto) para que possa ser reutilizado
 * tanto no dashboard filtrado quanto nas páginas CSR independentes.
 */

import { SummaryCard } from './SummaryCard';
import type { SummaryStatistics } from '../types';

interface SummaryCardsViewProps {
    stats: SummaryStatistics;
}

/** Ícones de traço leves (sem dependências extras) dimensionados para os chips dos cards. */
const iconClass = 'h-5 w-5';

const icons = {
    activities: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V9m4 8V5m4 12v-6M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    ),
    servers: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    participants: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-3-6.7" />
        </svg>
    ),
    audience: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    states: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    cities: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-4m-4 0H5m4 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-4 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1" />
        </svg>
    ),
    materials: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
    ),
    cost: (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

export function SummaryCardsView({ stats }: SummaryCardsViewProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            <SummaryCard
                title="Quantidade de Atividades"
                value={stats.activityCount}
                format="number"
                accent="blue"
                icon={icons.activities}
            />

            <SummaryCard
                title="Servidores"
                value={stats.serversCount}
                format="number"
                accent="indigo"
                icon={icons.servers}
            />

            <SummaryCard
                title="Participantes"
                value={stats.participantsCount}
                format="number"
                accent="purple"
                icon={icons.participants}
            />

            <SummaryCard
                title="Público Atingido"
                value={stats.audienceReached}
                format="number"
                accent="teal"
                icon={icons.audience}
            />

            <SummaryCard
                title="Estados"
                value={stats.statesCount}
                format="number"
                accent="green"
                icon={icons.states}
            />

            <SummaryCard
                title="Cidades"
                value={stats.citiesCount}
                format="number"
                accent="teal"
                icon={icons.cities}
            />

            <SummaryCard
                title="Materiais Doados"
                value={stats.totalMaterials}
                format="number"
                accent="amber"
                icon={icons.materials}
            />

            <SummaryCard
                title="Custo Total"
                value={stats.totalCost}
                format="currency"
                accent="pink"
                icon={icons.cost}
            />
        </div>
    );
}
