import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryCard } from './SummaryCard';

describe('SummaryCard', () => {
    it('should render title and value', () => {
        render(<SummaryCard title="Total de Painéis" value={42} />);

        expect(screen.getByText('Total de Painéis')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should format numbers with thousand separators', () => {
        render(<SummaryCard title="Público Atingido" value={1234567} format="number" />);

        expect(screen.getByText('Público Atingido')).toBeInTheDocument();
        // Brazilian format: 1.234.567
        expect(screen.getByText('1.234.567')).toBeInTheDocument();
    });

    it('should format currency with R$ symbol', () => {
        render(<SummaryCard title="Valor Repasse" value={1234.56} format="currency" />);

        expect(screen.getByText('Valor Repasse')).toBeInTheDocument();
        // Brazilian currency format: R$ 1.234,56
        expect(screen.getByText(/R\$\s*1\.234,56/)).toBeInTheDocument();
    });

    it('should handle string values', () => {
        render(<SummaryCard title="Status" value="Ativo" />);

        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Ativo')).toBeInTheDocument();
    });

    it('should render icon when provided', () => {
        const icon = <span data-testid="test-icon">📊</span>;
        render(<SummaryCard title="Total" value={100} icon={icon} />);

        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should handle zero values', () => {
        render(<SummaryCard title="Nenhum Resultado" value={0} format="number" />);

        expect(screen.getByText('Nenhum Resultado')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should apply hover effect classes', () => {
        const { container } = render(<SummaryCard title="Test" value={100} />);

        const card = container.querySelector('.hover\\:shadow-lg');
        expect(card).toBeInTheDocument();
    });
});
