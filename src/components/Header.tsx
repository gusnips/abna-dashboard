interface HeaderProps {
    selectedCSR?: string | null;
}

export function Header({ selectedCSR }: HeaderProps) {
    return (
        <header className="bg-gradient-to-r from-abna-primary to-abna-secondary shadow-md">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        {/* NA Logo */}
                        <img
                            src="https://www.na.org.br/wp-content/uploads/2020/04/logo-narcoticos-anonimos.png"
                            alt="Narcóticos Anônimos"
                            className="h-16 w-auto bg-white px-4 py-2 rounded-lg shadow-lg"
                            onError={(e) => {
                                // Fallback if image fails to load
                                console.error('Failed to load NA logo');
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>

                    {/* Title Section */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Relatório Nacional de RP/IP
                        </h1>
                        {selectedCSR && (
                            <p className="text-sm md:text-base text-white/90 mt-1">
                                {selectedCSR}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
