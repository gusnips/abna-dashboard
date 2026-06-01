/**
 * CSABreakdownTable - Tabela de detalhamento por CSA para um relatório de CSR
 *
 * Tabela apresentacional mostrando a contagem de atividades e público atingido
 * de cada CSA, com uma linha de totais. Os dados são fornecidos via props.
 */

import { formatNumber } from '../utils';
import type { CSABreakdownRow } from '../types';

interface CSABreakdownTableProps {
    rows: CSABreakdownRow[];
}

export function CSABreakdownTable({ rows }: CSABreakdownTableProps) {
    const totals = rows.reduce(
        (acc, row) => ({
            activityCount: acc.activityCount + row.activityCount,
            audienceReached: acc.audienceReached + row.audienceReached,
        }),
        { activityCount: 0, audienceReached: 0 }
    );

    return (
        <div className="chart-container">
            <h3 className="chart-title">Detalhamento por CSA</h3>
            {rows.length === 0 ? (
                <div className="chart-empty-state">
                    <p className="chart-empty-text">Nenhum dado disponível</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-ink-200 text-left text-ink-500">
                                <th className="py-3 pr-4 font-semibold uppercase tracking-wide text-xs">CSA</th>
                                <th className="py-3 px-4 font-semibold uppercase tracking-wide text-xs text-right">Atividades</th>
                                <th className="py-3 pl-4 font-semibold uppercase tracking-wide text-xs text-right">Público Atingido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr
                                    key={row.csa}
                                    className="border-b border-ink-100 transition-colors hover:bg-ink-50/70"
                                >
                                    <td className="py-3 pr-4 font-medium text-ink-800">{row.csa}</td>
                                    <td className="py-3 px-4 text-right text-ink-700 tabular-nums">
                                        {formatNumber(row.activityCount)}
                                    </td>
                                    <td className="py-3 pl-4 text-right text-ink-700 tabular-nums">
                                        {formatNumber(row.audienceReached)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-ink-200 font-bold text-ink-900">
                                <td className="py-3 pr-4">Total</td>
                                <td className="py-3 px-4 text-right tabular-nums">
                                    {formatNumber(totals.activityCount)}
                                </td>
                                <td className="py-3 pl-4 text-right tabular-nums">
                                    {formatNumber(totals.audienceReached)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}
