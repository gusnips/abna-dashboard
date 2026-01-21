import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
    it('should render NA logo image', () => {
        render(<Header />);
        const naLogo = screen.getByAltText('Narcóticos Anônimos');
        expect(naLogo).toBeInTheDocument();
        expect(naLogo).toHaveAttribute('src', 'https://www.na.org.br/wp-content/uploads/2020/04/logo-narcoticos-anonimos.png');
    });

    it('should display title "Relatório Nacional de RP/IP"', () => {
        render(<Header />);
        expect(screen.getByText('Relatório Nacional de RP/IP')).toBeInTheDocument();
    });

    it('should display subtitle with CSR when provided', () => {
        const csrName = 'CSR Grande São Paulo';
        render(<Header selectedCSR={csrName} />);
        expect(screen.getByText(csrName)).toBeInTheDocument();
    });

    it('should not display subtitle when CSR is null', () => {
        render(<Header selectedCSR={null} />);
        const subtitle = screen.queryByText(/CSR/);
        expect(subtitle).not.toBeInTheDocument();
    });

    it('should not display subtitle when CSR is not provided', () => {
        render(<Header />);
        // Should only show the title, no subtitle
        expect(screen.getByText('Relatório Nacional de RP/IP')).toBeInTheDocument();
    });
});
