import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
    it('should render ABNA logo image', () => {
        render(<Header />);
        const abnaLogo = screen.getByAltText('ABNA Logo');
        expect(abnaLogo).toBeInTheDocument();
        expect(abnaLogo).toHaveAttribute('src', '/abna-logo.svg');
    });

    it('should render IP logo image', () => {
        render(<Header />);
        const ipLogo = screen.getByAltText('IP Logo');
        expect(ipLogo).toBeInTheDocument();
        expect(ipLogo).toHaveAttribute('src', '/ip-logo.svg');
    });

    it('should display title "RELATÓRIO DIGITAL H&I"', () => {
        render(<Header />);
        expect(screen.getByText('RELATÓRIO DIGITAL H&I')).toBeInTheDocument();
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
        expect(screen.getByText('RELATÓRIO DIGITAL H&I')).toBeInTheDocument();
    });
});
