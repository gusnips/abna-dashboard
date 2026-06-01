import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryCard } from './SummaryCard';

describe('SummaryCard', () => {
    it('deve renderizar título e valor', () => {
        render(<SummaryCard title="Total de Painéis" value={42} />);

        expect(screen.getByText('Total de Painéis')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('deve formatar números com separadores de milhar', () => {
        render(<SummaryCard title="Público Atingido" value={1234567} format="number" />);

        expect(screen.getByText('Público Atingido')).toBeInTheDocument();
        // Formato brasileiro: 1.234.567
        expect(screen.getByText('1.234.567')).toBeInTheDocument();
    });

    it('deve formatar moeda com símbolo R$', () => {
        render(<SummaryCard title="Valor Repasse" value={1234.56} format="currency" />);

        expect(screen.getByText('Valor Repasse')).toBeInTheDocument();
        // Formato de moeda brasileiro: R$ 1.234,56
        expect(screen.getByText(/R\$\s*1\.234,56/)).toBeInTheDocument();
    });

    it('deve lidar com valores string', () => {
        render(<SummaryCard title="Status" value="Ativo" />);

        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Ativo')).toBeInTheDocument();
    });

    it('deve renderizar ícone quando fornecido', () => {
        const icon = <span data-testid="test-icon">📊</span>;
        render(<SummaryCard title="Total" value={100} icon={icon} />);

        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('deve lidar com valores zero', () => {
        render(<SummaryCard title="Nenhum Resultado" value={0} format="number" />);

        expect(screen.getByText('Nenhum Resultado')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('deve aplicar classes de efeito hover', () => {
        const { container } = render(<SummaryCard title="Test" value={100} />);

        // O card usa a utilidade compartilhada `surface-hover` para seu efeito de elevação no hover
        const card = container.querySelector('.surface-hover');
        expect(card).toBeInTheDocument();
    });
});
