/**
 * Dashboard Layout Component
 * 
 * Main dashboard layout that composes all components:
 * - Header
 * - FilterBar
 * - SummaryCards
 * - Charts (Pie, Column, Line)
 * - GeographicRanking
 * - MaterialsTable
 * 
 * Handles loading and error states with retry functionality.
 * Implements responsive grid layout with Tailwind CSS.
 * 
 * Requirements: 7.4, 7.6, 8.1
 */

import { useData, useFilters } from '../contexts';
import {
    Header,
    FilterBar,
    SummaryCards,
    ServiceStructurePieChart,
    ActivityTypeColumnChart,
    TimeSeriesLineChart,
    GeographicRanking,
    MaterialsTable
} from './';

/**
 * Dashboard component - main layout
 */
export function Dashboard() {
    const { loading, error, refetch } = useData();
    const { filters } = useFilters();

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                        <p className="text-lg text-gray-600">Carregando dados...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state with retry button
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-red-500 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <h2 className="text-xl font-semibold text-red-800 mb-2">
                                Erro ao Carregar Dados
                            </h2>
                            <p className="text-red-700 mb-4">
                                {error.message || 'Ocorreu um erro inesperado ao carregar os dados.'}
                            </p>
                            <button
                                onClick={refetch}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main dashboard layout
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <Header selectedCSR={filters.selectedRegion} />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6 space-y-6">
                {/* Filter Bar */}
                <section>
                    <FilterBar />
                </section>

                {/* Summary Cards */}
                <section>
                    <SummaryCards />
                </section>

                {/* Charts Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <ServiceStructurePieChart />
                    </div>
                    <div className="lg:col-span-1">
                        <ActivityTypeColumnChart />
                    </div>
                    <div className="lg:col-span-2 xl:col-span-1">
                        <TimeSeriesLineChart />
                    </div>
                </section>

                {/* Geographic Ranking and Materials Table */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <GeographicRanking />
                    </div>
                    <div>
                        <MaterialsTable />
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="container mx-auto px-4 py-6">
                    <p className="text-center text-sm text-gray-600">
                        © {new Date().getFullYear()} ABNA - Associação Brasileira de Narcóticos Anônimos
                    </p>
                </div>
            </footer>
        </div>
    );
}
