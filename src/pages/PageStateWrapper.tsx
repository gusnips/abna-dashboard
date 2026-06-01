/**
 * PageStateWrapper - Shell compartilhado de carregamento/erro para páginas independentes
 *
 * Espelha a UI de carregamento e erro usada pelo Dashboard principal para que as páginas
 * CSR permaneçam visualmente consistentes. Renderiza children apenas quando os dados estão prontos.
 */

import type { ReactNode } from 'react';
import { useData } from '../contexts';
import { Header } from '../components';

interface PageStateWrapperProps {
    children: ReactNode;
}

export function PageStateWrapper({ children }: PageStateWrapperProps) {
    const { loading, error, refetch } = useData();

    if (loading) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="relative h-16 w-16 mb-5">
                            <div className="absolute inset-0 rounded-full border-4 border-ink-200" />
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-abna-primary border-r-abna-secondary animate-spin" />
                        </div>
                        <p className="text-lg font-medium text-ink-600">Carregando dados...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="surface p-8 max-w-md text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-abna-accent">
                                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-ink-900 mb-2">
                                Erro ao Carregar Dados
                            </h2>
                            <p className="text-ink-600 mb-5">
                                {error.message || 'Ocorreu um erro inesperado ao carregar os dados.'}
                            </p>
                            <button
                                onClick={refetch}
                                className="inline-flex items-center gap-2 rounded-xl bg-abna-primary px-6 py-2.5 font-semibold text-white shadow-glow transition-all duration-200 hover:bg-abna-primary-dark hover:-translate-y-0.5"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
