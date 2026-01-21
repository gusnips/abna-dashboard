/**
 * Unit tests for DataContext
 * Tests data fetching, caching, error handling, and offline mode
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DataProvider, useData } from './DataContext';
import type { CampaignRecord } from '../types';
import * as services from '../services';
import type { GoogleSheetsService } from '../services/GoogleSheetsService';
import * as utils from '../utils/DataParser';

// Mock the GoogleSheetsService
vi.mock('../services');

// Mock the DataParser
vi.mock('../utils/DataParser');

// Test component that uses the DataContext
function TestComponent() {
    const { records, loading, error, refetch } = useData();

    return (
        <div>
            <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
            <div data-testid="error">{error ? error.message : 'No Error'}</div>
            <div data-testid="records-count">{records.length}</div>
            <button onClick={refetch}>Refetch</button>
        </div>
    );
}

describe('DataContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw error when useData is used outside DataProvider', () => {
        // Suppress console.error for this test
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            render(<TestComponent />);
        }).toThrow('useData must be used within a DataProvider');

        consoleError.mockRestore();
    });

    it('should provide initial loading state', () => {
        const mockFetchData = vi.fn(() => new Promise(() => { })); // Never resolves

        vi.mocked(services.createGoogleSheetsService).mockReturnValue({
            fetchData: mockFetchData,
            validateConfig: vi.fn(),
            getConfig: vi.fn()
        } as unknown as GoogleSheetsService);

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
        expect(screen.getByTestId('records-count')).toHaveTextContent('0');
    });

    it('should fetch and display data successfully', async () => {
        const mockRecords: CampaignRecord[] = [
            {
                id: '1',
                timestamp: new Date('2024-01-15'),
                email: 'test@example.com',
                name: 'Test User',
                phone: '123456789',
                position: 'Coordinator',
                selectedCSR: 'CSR Brasil',
                csrCSAMap: {},
                state: 'SP',
                city: 'São Paulo',
                neighborhood: 'Centro',
                activityDate: new Date('2024-01-20'),
                activityTime: '14:00',
                serviceStructure: 'Sub-comitê',
                activityFormat: 'Presencial',
                institution: 'Test Institution',
                activityType: 'Workshop',
                activityDescription: 'Test activity',
                speakersCount: 2,
                participantsCount: 10,
                audienceReached: 50,
                serviceCost: 100,
                materials: {
                    cartazes: 5,
                    panfletos: 10,
                    listaGrupos: 2,
                    cartao: 3,
                    folder: 4,
                    ips: 6,
                    folhetos: 7,
                    textoBasico: 1,
                    pastaRP: 2,
                    lixoCar: 0,
                    calendario: 1,
                    outros: 3
                },
                observations: 'Test observation'
            }
        ];

        const mockFetchData = vi.fn().mockResolvedValue([{ id: '1' }]);
        const mockParse = vi.fn().mockReturnValue(mockRecords);

        vi.mocked(services.createGoogleSheetsService).mockReturnValue({
            fetchData: mockFetchData,
            validateConfig: vi.fn(),
            getConfig: vi.fn()
        } as unknown as GoogleSheetsService);

        // Mock DataParser as a constructor
        vi.mocked(utils.DataParser).mockImplementation(function (this: { parse: typeof mockParse; extractFilterOptions: ReturnType<typeof vi.fn> }) {
            this.parse = mockParse;
            this.extractFilterOptions = vi.fn();
            return this;
        } as unknown as typeof utils.DataParser);

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
        });

        expect(screen.getByTestId('records-count')).toHaveTextContent('1');
        expect(screen.getByTestId('error')).toHaveTextContent('No Error');
        expect(mockFetchData).toHaveBeenCalledTimes(1);
        expect(mockParse).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors and display error message', async () => {
        const mockFetchData = vi.fn().mockRejectedValue(new Error('Network error'));

        vi.mocked(services.createGoogleSheetsService).mockReturnValue({
            fetchData: mockFetchData,
            validateConfig: vi.fn(),
            getConfig: vi.fn()
        } as unknown as GoogleSheetsService);

        // Mock DataParser as a constructor
        vi.mocked(utils.DataParser).mockImplementation(function (this: { parse: ReturnType<typeof vi.fn>; extractFilterOptions: ReturnType<typeof vi.fn> }) {
            this.parse = vi.fn();
            this.extractFilterOptions = vi.fn();
            return this;
        } as unknown as typeof utils.DataParser);

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        // Wait for error state
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
        });

        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
        expect(screen.getByTestId('records-count')).toHaveTextContent('0');
    });
});
