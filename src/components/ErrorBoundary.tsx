import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Atualiza o estado para que a próxima renderização mostre a UI de fallback
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Registra o erro no console para debug
        console.error('Erro na aplicação:', error, errorInfo);

        // Registra no serviço de rastreamento de erros se configurado
        if (window.errorTracker) {
            window.errorTracker.logError(error, errorInfo as unknown as Record<string, unknown>);
        }
    }

    handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center px-4">
                    <div className="surface max-w-md w-full p-8 text-center">
                        <div className="mb-6">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-abna-accent">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-ink-900 mb-3">
                            Algo deu errado
                        </h1>

                        <p className="text-ink-600 mb-6">
                            Desculpe, ocorreu um erro inesperado. Por favor, recarregue a página.
                        </p>

                        {this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm text-ink-500 hover:text-ink-700">
                                    Detalhes do erro
                                </summary>
                                <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-ink-100 p-3 text-xs text-ink-600">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}

                        <button
                            onClick={this.handleReload}
                            className="w-full rounded-xl bg-abna-primary px-6 py-3 font-semibold text-white shadow-glow transition-all duration-200 hover:bg-abna-primary-dark hover:-translate-y-0.5"
                        >
                            Recarregar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
