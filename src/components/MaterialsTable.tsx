/**
 * Componente MaterialsTable
 * 
 * Exibe uma tabela de materiais distribuídos ranqueados por quantidade.
 * Mostra todos os 11 tipos de materiais com seus nomes e quantidades totais.
 * 
 * Requisitos: 6.1, 6.2, 6.3
 */

import { useFilters } from '../contexts';
import { aggregateMaterials, formatNumber } from '../utils';
import { Collapsible } from './Collapsible';

/** Altura colapsada compartilhada (px) para que todos os cards de ranking/material se alinhem. */
const PANEL_HEIGHT = 380;

export function MaterialsTable() {
    const { filteredRecords } = useFilters();

    // Agrega materiais dos registros filtrados (já ordenados por quantidade decrescente)
    const materialRows = aggregateMaterials(filteredRecords);

    return (
        <div className="surface flex h-full flex-col p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </span>
                Materiais Distribuídos
            </h2>

            {materialRows.length === 0 || materialRows.every(row => row.quantity === 0) ? (
                <p className="text-ink-500 text-center py-8">
                    Nenhum material distribuído para os filtros selecionados.
                </p>
            ) : (
                <Collapsible collapsedHeight={PANEL_HEIGHT}>
                    <div className="overflow-hidden rounded-xl ring-1 ring-ink-100">
                        <table className="min-w-full divide-y divide-ink-100">
                            <thead className="bg-ink-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500"
                                    >
                                        Material
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-500"
                                    >
                                        Quantidade
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ink-100 bg-white">
                                {materialRows.map((row) => (
                                    <tr key={row.material} className="transition-colors hover:bg-ink-50/70">
                                        <td className="whitespace-nowrap px-6 py-3.5 text-sm font-medium text-ink-800">
                                            {row.material}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-3.5 text-right text-sm font-semibold text-ink-700 tabular-nums">
                                            {formatNumber(row.quantity)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Collapsible>
            )}
        </div>
    );
}
