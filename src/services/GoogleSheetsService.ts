/**
 * GoogleSheetsService - Handles data fetching from Google Sheets API v4
 * 
 * This service provides read-only access to a public Google Sheets spreadsheet
 * containing ABNA campaign data. It includes configuration validation, error
 * handling, and descriptive error messages.
 */

import type { GoogleSheetsConfig, RawSheetRow } from '../types';

/**
 * Custom error class for Google Sheets API errors
 */
export class GoogleSheetsError extends Error {
    public readonly statusCode?: number;
    public readonly originalError?: unknown;

    constructor(
        message: string,
        statusCode?: number,
        originalError?: unknown
    ) {
        super(message);
        this.name = 'GoogleSheetsError';
        this.statusCode = statusCode;
        this.originalError = originalError;
    }
}

/**
 * Service class for fetching data from Google Sheets API
 */
export class GoogleSheetsService {
    private config: GoogleSheetsConfig;
    private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

    constructor(config: GoogleSheetsConfig) {
        this.config = config;
        this.validateConfig();
    }

    /**
     * Validates the Google Sheets configuration
     * @throws {GoogleSheetsError} If configuration is invalid
     */
    validateConfig(): void {
        const { apiKey, spreadsheetId, range } = this.config;

        if (!apiKey || apiKey.trim() === '') {
            throw new GoogleSheetsError(
                'API key is required. Please set VITE_GOOGLE_SHEETS_API_KEY in your .env file.'
            );
        }

        if (!spreadsheetId || spreadsheetId.trim() === '') {
            throw new GoogleSheetsError(
                'Spreadsheet ID is required. Please set VITE_GOOGLE_SHEETS_SPREADSHEET_ID in your .env file.'
            );
        }

        if (!range || range.trim() === '') {
            throw new GoogleSheetsError(
                'Range is required. Please set VITE_GOOGLE_SHEETS_RANGE in your .env file.'
            );
        }

        // Validate API key format (basic check)
        if (apiKey.length < 20) {
            throw new GoogleSheetsError(
                'API key appears to be invalid. Please check your VITE_GOOGLE_SHEETS_API_KEY.'
            );
        }
    }

    /**
     * Fetches data from Google Sheets API
     * @returns Promise resolving to array of raw sheet rows
     * @throws {GoogleSheetsError} If fetch fails or API returns an error
     */
    async fetchData(): Promise<RawSheetRow[]> {
        const { spreadsheetId, range, apiKey } = this.config;
        const url = `${this.baseUrl}/${spreadsheetId}/values/${range}?key=${apiKey}`;

        try {
            const response = await fetch(url);

            // Handle HTTP errors
            if (!response.ok) {
                const errorData = await this.parseErrorResponse(response);
                throw new GoogleSheetsError(
                    this.getErrorMessage(response.status, errorData),
                    response.status,
                    errorData
                );
            }

            const data = await response.json();

            // Validate response structure
            if (!data.values || !Array.isArray(data.values)) {
                throw new GoogleSheetsError(
                    'Resposta da API inválida: dados não encontrados.'
                );
            }

            // Convert to RawSheetRow format
            return this.transformToRows(data.values);
        } catch (error) {
            // Re-throw GoogleSheetsError as-is
            if (error instanceof GoogleSheetsError) {
                throw error;
            }

            // Handle network errors
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new GoogleSheetsError(
                    'Erro de rede: não foi possível conectar à API do Google Sheets. Verifique sua conexão com a internet.',
                    undefined,
                    error
                );
            }

            // Handle other unexpected errors
            throw new GoogleSheetsError(
                'Erro inesperado ao buscar dados: ' + (error instanceof Error ? error.message : String(error)),
                undefined,
                error
            );
        }
    }

    /**
     * Parses error response from Google Sheets API
     */
    private async parseErrorResponse(response: Response): Promise<unknown> {
        try {
            return await response.json();
        } catch {
            return { message: response.statusText };
        }
    }

    /**
     * Gets user-friendly error message based on status code
     */
    private getErrorMessage(statusCode: number, errorData: unknown): string {
        switch (statusCode) {
            case 400:
                return 'Requisição inválida: verifique a configuração do intervalo da planilha (VITE_GOOGLE_SHEETS_RANGE).';
            case 403:
                return 'Acesso negado: verifique se a chave da API está correta e tem permissões adequadas. A planilha deve estar configurada como "Qualquer pessoa com o link pode visualizar".';
            case 404:
                return 'Planilha não encontrada: verifique se o ID da planilha (VITE_GOOGLE_SHEETS_SPREADSHEET_ID) está correto.';
            case 429:
                return 'Limite de requisições excedido: aguarde alguns minutos antes de tentar novamente.';
            case 500:
            case 502:
            case 503:
                return 'Erro no servidor do Google: tente novamente em alguns instantes.';
            default: {
                const message = this.extractErrorMessage(errorData);
                return `Erro ao buscar dados (${statusCode}): ${message}`;
            }
        }
    }

    /**
     * Extracts error message from API error response
     */
    private extractErrorMessage(errorData: unknown): string {
        if (typeof errorData === 'object' && errorData !== null) {
            const data = errorData as Record<string, unknown>;
            if (data.error && typeof data.error === 'object') {
                const error = data.error as Record<string, unknown>;
                if (typeof error.message === 'string') {
                    return error.message;
                }
            }
            if (typeof data.message === 'string') {
                return data.message;
            }
        }
        return 'Erro desconhecido';
    }

    /**
     * Transforms Google Sheets values array to RawSheetRow objects
     * First row is treated as headers, subsequent rows as data
     */
    private transformToRows(values: unknown[][]): RawSheetRow[] {
        if (values.length === 0) {
            return [];
        }

        // First row contains headers
        const headers = values[0] as string[];
        const rows: RawSheetRow[] = [];

        // Process data rows (skip header row)
        for (let i = 1; i < values.length; i++) {
            const row = values[i];
            const rowObject: RawSheetRow = {};

            // Map each cell to its corresponding header
            for (let j = 0; j < headers.length; j++) {
                const header = headers[j];
                const value = row[j];

                // Convert empty strings to null
                if (value === '' || value === undefined) {
                    rowObject[header] = null;
                } else if (typeof value === 'string' || typeof value === 'number') {
                    rowObject[header] = value;
                } else {
                    // Convert other types to string
                    rowObject[header] = String(value);
                }
            }

            rows.push(rowObject);
        }

        return rows;
    }

    /**
     * Gets the current configuration (useful for debugging)
     */
    getConfig(): Readonly<GoogleSheetsConfig> {
        return {
            ...this.config,
            // Mask API key for security
            apiKey: this.config.apiKey.substring(0, 8) + '...'
        };
    }
}

/**
 * Factory function to create GoogleSheetsService from environment variables
 */
export function createGoogleSheetsService(): GoogleSheetsService {
    const config: GoogleSheetsConfig = {
        apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '',
        spreadsheetId: import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID || '',
        range: import.meta.env.VITE_GOOGLE_SHEETS_RANGE || 'Sheet1!A:Z'
    };

    return new GoogleSheetsService(config);
}
