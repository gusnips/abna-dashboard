import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from './FilterBar';
import { FilterProvider } from '../contexts/FilterContext';
import { DataProvider } from '../contexts/DataContext';

// Helper to render FilterBar with required providers
function renderFilterBar() {
    return render(
        <DataProvider>
            <FilterProvider>
                <FilterBar />
            </FilterProvider>
        </DataProvider>
    );
}

describe('FilterBar', () => {
    it('should render geographic scope selector', () => {
        renderFilterBar();
        expect(screen.getByLabelText('Escopo Geográfico')).toBeInTheDocument();
    });

    it('should display all geographic scope options', () => {
        renderFilterBar();
        const select = screen.getByLabelText('Escopo Geográfico') as HTMLSelectElement;

        expect(select).toBeInTheDocument();
        expect(screen.getByText('Brasil Todo')).toBeInTheDocument();
        expect(screen.getByText('CSA')).toBeInTheDocument();
        expect(screen.getByText('Região (CSR)')).toBeInTheDocument();
        expect(screen.getByText('Estado')).toBeInTheDocument();
        expect(screen.getByText('Cidade')).toBeInTheDocument();
    });

    it('should render date range inputs', () => {
        renderFilterBar();
        expect(screen.getByLabelText('Data Inicial')).toBeInTheDocument();
        expect(screen.getByLabelText('Data Final')).toBeInTheDocument();
    });

    it('should render clear filters button', () => {
        renderFilterBar();
        expect(screen.getByText('Limpar Filtros')).toBeInTheDocument();
    });

    it('should show CSA dropdown when CSA scope is selected', () => {
        renderFilterBar();
        const scopeSelect = screen.getByLabelText('Escopo Geográfico') as HTMLSelectElement;

        fireEvent.change(scopeSelect, { target: { value: 'csa' } });

        expect(screen.getByLabelText('Selecione o CSA')).toBeInTheDocument();
    });

    it('should show Region dropdown when region scope is selected', () => {
        renderFilterBar();
        const scopeSelect = screen.getByLabelText('Escopo Geográfico') as HTMLSelectElement;

        fireEvent.change(scopeSelect, { target: { value: 'region' } });

        expect(screen.getByLabelText('Selecione a Região (CSR)')).toBeInTheDocument();
    });

    it('should show State dropdown when state scope is selected', () => {
        renderFilterBar();
        const scopeSelect = screen.getByLabelText('Escopo Geográfico') as HTMLSelectElement;

        fireEvent.change(scopeSelect, { target: { value: 'state' } });

        expect(screen.getByLabelText('Selecione o Estado')).toBeInTheDocument();
    });

    it('should show State and City dropdowns when city scope is selected', () => {
        renderFilterBar();
        const scopeSelect = screen.getByLabelText('Escopo Geográfico') as HTMLSelectElement;

        fireEvent.change(scopeSelect, { target: { value: 'city' } });

        expect(screen.getByLabelText('Selecione o Estado')).toBeInTheDocument();
        // City dropdown appears after state is selected
    });

    it('should have Portuguese labels', () => {
        renderFilterBar();

        // Check for Portuguese labels
        expect(screen.getByText('Escopo Geográfico')).toBeInTheDocument();
        expect(screen.getByText('Data Inicial')).toBeInTheDocument();
        expect(screen.getByText('Data Final')).toBeInTheDocument();
        expect(screen.getByText('Limpar Filtros')).toBeInTheDocument();
    });
});
