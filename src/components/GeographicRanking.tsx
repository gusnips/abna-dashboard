/**
 * Componente GeographicRanking
 * 
 * Exibe listas ranqueadas de estados e cidades por contagem de atividades
 * - Lista de ranking de estados com número de posição, nome do estado e contagem de atividades
 * - Lista de ranking de cidades (filtrada por estado se aplicável)
 * - Estilizado com Tailwind CSS
 * 
 * Requisitos: 5.1, 5.2, 5.3, 5.5
 */

import { useMemo } from 'react';
import { useFilters } from '../contexts';
import { rankStatesByActivityCount, rankCitiesByActivityCount } from '../utils';
import type { RankingItem } from '../types';
import { Collapsible } from './Collapsible';

/** Altura colapsada compartilhada (px) para que todos os cards de ranking/material se alinhem. */
const PANEL_HEIGHT = 380;

/**
 * Constrói a classe do badge de ranking. A posição #1 recebe um tratamento
 * de gradiente quente tipo "medalha"; os demais usam a tonalidade da marca da seção.
 */
function rankBadgeClass(rank: number, tone: 'blue' | 'green'): string {
    const base = 'flex items-center justify-center w-8 h-8 font-bold rounded-xl text-sm flex-shrink-0';
    if (rank === 1) {
        return `${base} bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-soft`;
    }
    if (rank === 2 || rank === 3) {
        return tone === 'blue'
            ? `${base} bg-gradient-to-br from-blue-500 to-blue-700 text-white`
            : `${base} bg-gradient-to-br from-emerald-400 to-emerald-600 text-white`;
    }
    return tone === 'blue'
        ? `${base} bg-blue-50 text-abna-primary`
        : `${base} bg-emerald-50 text-abna-secondary`;
}

export function GeographicRanking() {
    const { filteredRecords, filters } = useFilters();

    // Calcula rankings de estados a partir dos registros filtrados
    const stateRankings = useMemo((): RankingItem[] => {
        return rankStatesByActivityCount(filteredRecords);
    }, [filteredRecords]);

    // Calcula rankings de cidades a partir dos registros filtrados
    // Se um filtro de estado estiver aplicado, mostra apenas cidades daquele estado
    const cityRankings = useMemo((): RankingItem[] => {
        let recordsForCityRanking = filteredRecords;

        // Se o filtro de estado estiver ativo, filtra cidades por aquele estado
        if (filters.geographicScope === 'state' && filters.selectedState) {
            recordsForCityRanking = filteredRecords.filter(
                record => record.state === filters.selectedState
            );
        }

        return rankCitiesByActivityCount(recordsForCityRanking);
    }, [filteredRecords, filters.geographicScope, filters.selectedState]);

    return (
        <div className="grid h-full grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rankings de Estados */}
            <div className="surface flex flex-col p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-abna-primary">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </span>
                    Ranking de Estados
                </h2>

                {stateRankings.length === 0 ? (
                    <p className="text-ink-500 text-center py-8">
                        Nenhum estado encontrado
                    </p>
                ) : (
                    <Collapsible collapsedHeight={PANEL_HEIGHT}>
                        <div className="space-y-2">
                            {stateRankings.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between rounded-xl bg-ink-50/70 p-3 ring-1 ring-transparent transition-all hover:bg-white hover:ring-ink-200 hover:shadow-soft"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={rankBadgeClass(item.rank, 'blue')}>
                                            {item.rank}
                                        </span>
                                        <span className="font-semibold text-ink-800">
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-ink-500 tabular-nums">
                                        {item.count} {item.count === 1 ? 'atividade' : 'atividades'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Collapsible>
                )}
            </div>

            {/* Rankings de Cidades */}
            <div className="surface flex flex-col p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-abna-secondary">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </span>
                    Ranking de Cidades
                    {filters.selectedState && (
                        <span className="text-sm font-normal text-ink-500 ml-1">
                            ({filters.selectedState})
                        </span>
                    )}
                </h2>

                {cityRankings.length === 0 ? (
                    <p className="text-ink-500 text-center py-8">
                        Nenhuma cidade encontrada
                    </p>
                ) : (
                    <Collapsible collapsedHeight={PANEL_HEIGHT}>
                        <div className="space-y-2">
                            {cityRankings.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between rounded-xl bg-ink-50/70 p-3 ring-1 ring-transparent transition-all hover:bg-white hover:ring-ink-200 hover:shadow-soft"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={rankBadgeClass(item.rank, 'green')}>
                                            {item.rank}
                                        </span>
                                        <span className="font-semibold text-ink-800">
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-ink-500 tabular-nums">
                                        {item.count} {item.count === 1 ? 'atividade' : 'atividades'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Collapsible>
                )}
            </div>
        </div>
    );
}
