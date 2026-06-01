import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';
import type { ReactElement } from 'react';

/** Renderiza um componente dentro de um contexto de router (Header usa NavLink). */
const renderWithRouter = (ui: ReactElement) =>
    render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Header', () => {
    it('deve renderizar imagem do logo NA', () => {
        renderWithRouter(<Header />);
        const naLogo = screen.getByAltText('Narcóticos Anônimos');
        expect(naLogo).toBeInTheDocument();
        expect(naLogo).toHaveAttribute('src', 'https://www.na.org.br/wp-content/uploads/2020/04/logo-narcoticos-anonimos.png');
    });

    it('deve exibir título "Relatório Nacional de RP/IP"', () => {
        renderWithRouter(<Header />);
        expect(screen.getByText('Relatório Nacional de RP/IP')).toBeInTheDocument();
    });

    it('deve renderizar links de navegação', () => {
        renderWithRouter(<Header />);
        expect(screen.getByRole('link', { name: 'Painel Nacional' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Relatórios por CSR' })).toBeInTheDocument();
    });

    it('deve exibir subtítulo com CSR quando fornecido', () => {
        const csrName = 'CSR Grande São Paulo';
        renderWithRouter(<Header selectedCSR={csrName} />);
        expect(screen.getByText(csrName)).toBeInTheDocument();
    });

    it('não deve exibir subtítulo quando CSR é null', () => {
        renderWithRouter(<Header selectedCSR={null} />);
        // O subtítulo é um nome de CSR começando com "CSR "; o link de navegação
        // ("Relatórios por CSR") não deve ser confundido com o subtítulo.
        const subtitle = screen.queryByText(/^CSR /);
        expect(subtitle).not.toBeInTheDocument();
    });

    it('não deve exibir subtítulo quando CSR não é fornecido', () => {
        renderWithRouter(<Header />);
        // Deve mostrar apenas o título, sem subtítulo
        expect(screen.getByText('Relatório Nacional de RP/IP')).toBeInTheDocument();
    });
});
