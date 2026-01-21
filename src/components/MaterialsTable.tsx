/**
 * MaterialsTable Component
 * 
 * Displays a table of distributed materials ranked by quantity.
 * Shows all 11 material types with their names and total quantities.
 * 
 * Requirements: 6.1, 6.2, 6.3
 */

import { useFilters } from '../contexts';
import { aggregateMaterials, formatNumber } from '../utils';

export function MaterialsTable() {
    const { filteredRecords } = useFilters();

    // Aggregate materials from filtered records (already sorted by quantity descending)
    const materialRows = aggregateMaterials(filteredRecords);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Materiais Distribuídos
            </h2>

            {materialRows.length === 0 || materialRows.every(row => row.quantity === 0) ? (
                <p className="text-gray-500 text-center py-8">
                    Nenhum material distribuído para os filtros selecionados.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Material
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Quantidade
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {materialRows.map((row) => (
                                <tr key={row.material} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {row.material}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                        {formatNumber(row.quantity)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
