import { Link, NavLink } from 'react-router-dom';

interface HeaderProps {
    selectedCSR?: string | null;
}

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    [
        'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
        isActive
            ? 'bg-white text-abna-primary shadow-soft'
            : 'text-white/85 hover:bg-white/15 hover:text-white',
    ].join(' ');

export function Header({ selectedCSR }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 overflow-hidden bg-brand-gradient shadow-soft-lg">
            {/* Blobs de brilho em camadas para profundidade — mantidos na família azul (estilo 2026) */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div
                    className="absolute -top-24 -left-16 h-64 w-64 rounded-full blur-3xl opacity-50"
                    style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }}
                />
                <div
                    className="absolute -top-16 right-1/4 h-56 w-72 rounded-full blur-3xl opacity-40"
                    style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
                />
                <div
                    className="absolute -bottom-24 right-0 h-60 w-80 rounded-full blur-3xl opacity-30"
                    style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)' }}
                />
            </div>
            {/* Destaque sutil na borda superior */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/25" aria-hidden="true" />
            <div className="relative container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo + Título */}
                    <Link
                        to="/"
                        aria-label="Ir para o início"
                        className="flex items-center gap-4 rounded-2xl transition-opacity duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                        <img
                            src="https://www.na.org.br/wp-content/uploads/2020/04/logo-narcoticos-anonimos.png"
                            alt="Narcóticos Anônimos"
                            className="h-12 w-auto bg-white px-3 py-1.5 rounded-xl shadow-soft ring-1 ring-white/40"
                            onError={(e) => {
                                console.error('Falha ao carregar logo do NA');
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <div className="text-center md:text-left">
                            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                                ABNA · Narcóticos Anônimos
                            </p>
                            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
                                Relatório Nacional de RP/IP
                            </h1>
                            {selectedCSR && (
                                <p className="text-sm text-white/85 mt-0.5">
                                    {selectedCSR}
                                </p>
                            )}
                        </div>
                    </Link>

                    {/* Navegação */}
                    <nav className="flex items-center gap-1.5 rounded-full bg-white/10 p-1 ring-1 ring-white/15 backdrop-blur-sm">
                        <NavLink to="/" end className={navLinkClass}>
                            Painel Nacional
                        </NavLink>
                        <NavLink to="/csr" className={navLinkClass}>
                            Relatórios por CSR
                        </NavLink>
                    </nav>
                </div>
            </div>

            {/* Faixa de assinatura da marca — o único acento verde intencional (azul → verde) */}
            <div className="absolute inset-x-0 bottom-0 h-[3px] bg-accent-gradient" aria-hidden="true" />
        </header>
    );
}
