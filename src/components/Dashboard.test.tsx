/**
 * Dashboard Component Tests
 * 
 * Tests for the Dashboard layout component including:
 * - Loading state display
 * - Error state display with retry button
 * - Successful data display with all components
 * 
 * Requirements: 7.6, 8.1, 9.1
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from './Dashboard';
import { DataProvider } from '../contexts/DataContext';
import { FilterProvider } from '../contexts/FilterContext';
import type { CampaignRecord } from '../types';

// Create mock functions at module level
const mockFetchData = vi.fn();
const mockParse = vi.fn((data) => data);

// Mock the services module
vi.mock('../services', () => ({
    createGoogleSheetsService: vi.fn(() => ({
        fetchData: mockFetchData
    }))
}));

// Mock the DataParser as a class constructor
vi.mock('../utils/DataParser', () => {
    return {
        DataParser: vi.fn(function (this: { parse: typeof mockParse }) {
            this.parse = mockParse;
        })
    };
});

// Helper to render Dashboard with providers
function renderDashboard() {
    return render(
        <DataProvider>
            <FilterProvider>
                <Dashboard />
            </FilterProvider>
        </DataProvider>
    );
}

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFetchData.mockReset();
        mockParse.mockReset();
        mockParse.mockImplementation((data) => data);
    });

    it('should display loading state initially', () => {
        // Mock a slow fetch to keep loading state
        mockFetchData.mockReturnValue(new Promise(() => { })); // Never resolves

        renderDashboard();

        // Check for loading indicator
        expect(screen.getByText(/Carregando dados/i)).toBeInTheDocument();
    });

    it('should display error state with retry button when fetch fails', async () => {
        // Mock fetch failure
        mockFetchData.mockRejectedValue(new Error('Network error'));

        renderDashboard();

        // Wait for error state
        await waitFor(() => {
            expect(screen.getByText(/Erro ao Carregar Dados/i)).toBeInTheDocument();
        });

        // Check for error message
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();

        // Check for retry button
        expect(screen.getByText(/Tentar Novamente/i)).toBeInTheDocument();
    });

    it('should call refetch when retry button is clicked', async () => {
        mockFetchData.mockRejectedValue(new Error('Network error'));

        renderDashboard();

        // Wait for error state
        await waitFor(() => {
            expect(screen.getByText(/Tentar Novamente/i)).toBeInTheDocument();
        });

        // Click retry button
        const retryButton = screen.getByText(/Tentar Novamente/i);
        await userEvent.click(retryButton);

        // Verify fetchData was called again
        await waitFor(() => {
            expect(mockFetchData).toHaveBeenCalledTimes(2); // Initial + retry
        });
    });

    it('should render all dashboard components when data loads successfully', async () => {
        // Mock successful data fetch
        const mockData: CampaignRecord[] = [
            {
                id: '1',
                timestamp: new Date('2024-01-15'),
                email: 'test@example.com',
                name: 'Test User',
                phone: '123456789',
                position: 'Coordenador',
                selectedCSR: 'CSR Brasil',
                csrCSAMap: {},
                state: 'SP',
                city: 'São Paulo',
                neighborhood: 'Centro',
                activityDate: new Date('2024-01-15'),
                activityTime: '14:00',
                serviceStructure: 'Sub-comitê',
                activityFormat: 'Presencial',
                institution: 'Hospital Central',
                activityType: 'Apresentação',
                activityDescription: 'Apresentação sobre NA',
                speakersCount: 2,
                participantsCount: 30,
                audienceReached: 50,
                serviceCost: 100,
                materials: {
                    cartazes: 10,
                    panfletos: 50,
                    listaGrupos: 5,
                    cartao: 20,
                    folder: 15,
                    ips: 10,
                    folhetos: 25,
                    textoBasico: 5,
                    pastaRP: 3,
                    lixoCar: 2,
                    calendario: 10,
                    outros: 5
                },
                observations: 'Atividade bem-sucedida'
            }
        ];

        mockFetchData.mockResolvedValue(mockData);
        mockParse.mockReturnValue(mockData);

        renderDashboard();

        // Wait for data to load
        await waitFor(() => {
            expect(screen.queryByText(/Carregando dados/i)).not.toBeInTheDocument();
        });

        // Check that header is rendered
        expect(screen.getByText(/Relatório Nacional de RP\/IP/i)).toBeInTheDocument();

        // Check that summary cards section is present (at least one card)
        expect(screen.getByText(/Quantidade de Atividades/i)).toBeInTheDocument();

        // Check that charts are rendered (by their titles)
        expect(screen.getByText(/Estrutura de Serviço/i)).toBeInTheDocument();
        expect(screen.getByText(/Tipo de Atividade/i)).toBeInTheDocument();
        expect(screen.getByText(/Atividades ao Longo do Tempo/i)).toBeInTheDocument();

        // Check that geographic ranking is rendered
        expect(screen.getByText(/Ranking de Estados/i)).toBeInTheDocument();

        // Check that materials table is rendered
        expect(screen.getByText(/Materiais Distribuídos/i)).toBeInTheDocument();
    });

    it('should have responsive layout classes', async () => {
        mockFetchData.mockResolvedValue([]);

        const { container } = renderDashboard();

        // Wait for loading to complete
        await waitFor(() => {
            expect(screen.queryByText(/Carregando dados/i)).not.toBeInTheDocument();
        });

        // Check for responsive container classes
        const mainElement = container.querySelector('main');
        expect(mainElement).toHaveClass('container', 'mx-auto', 'px-4');
    });
});
