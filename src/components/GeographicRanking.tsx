/**
 * GeographicRanking Component
 * 
 * Displays ranked lists of states and cities by activity count
 * - State ranking list with rank number, state name, and activity count
 * - City ranking list (filtered by state if applicable)
 * - Styled with Tailwind CSS
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.5
 */

import { useMemo } from 'react';
import { useFilters } from '../contexts';
import { rankStatesByActivityCount, rankCitiesByActivityCount } from '../utils';
import type { RankingItem } from '../types';

export function GeographicRanking() {
    const { filteredRecords, filters } = useFilters();

    // Calculate state rankings from filtered records
    const stateRankings = useMemo((): RankingItem[] => {
        return rankStatesByActivityCount(filteredRecords);
    }, [filteredRecords]);

    // Calculate city rankings from filtered records
    // If a state filter is applied, only show cities from that state
    const cityRankings = useMemo((): RankingItem[] => {
        let recordsForCityRanking = filteredRecords;

        // If state filter is active, filter cities by that state
        if (filters.geographicScope === 'state' && filters.selectedState) {
            recordsForCityRanking = filteredRecords.filter(
                record => record.state === filters.selectedState
            );
        }

        return rankCitiesByActivityCount(recordsForCityRanking);
    }, [filteredRecords, filters.geographicScope, filters.selectedState]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* State Rankings */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Ranking de Estados
                </h2>

                {stateRankings.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        Nenhum estado encontrado
                    </p>
                ) : (
                    <div className="space-y-2">
                        {stateRankings.map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full text-sm">
                                        {item.rank}
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {item.name}
                                    </span>
                                </div>
                                <span className="text-gray-600 font-semibold">
                                    {item.count} {item.count === 1 ? 'atividade' : 'atividades'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* City Rankings */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Ranking de Cidades
                    {filters.selectedState && (
                        <span className="text-sm font-normal text-gray-600 ml-2">
                            ({filters.selectedState})
                        </span>
                    )}
                </h2>

                {cityRankings.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        Nenhuma cidade encontrada
                    </p>
                ) : (
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {cityRankings.map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 bg-green-600 text-white font-bold rounded-full text-sm">
                                        {item.rank}
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {item.name}
                                    </span>
                                </div>
                                <span className="text-gray-600 font-semibold">
                                    {item.count} {item.count === 1 ? 'atividade' : 'atividades'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
