/**
 * DataParser - Transforms raw Google Sheets data into typed CampaignRecord objects
 * 
 * This parser handles:
 * - Converting raw sheet rows to typed domain objects
 * - Parsing dates, numbers, and enums with validation
 * - Handling sparse data (conditional state/city columns)
 * - Extracting CSR/CSA mappings from 12 CSR-specific columns
 * - Graceful error handling for malformed data
 */

import type {
    RawSheetRow,
    CampaignRecord,
    FilterOptions,
    ServiceStructure,
    ActivityFormat,
    CSRCSAMap,
    MaterialsDistributed
} from '../types';

/**
 * Custom error class for data parsing errors
 */
export class DataParseError extends Error {
    public readonly rowId?: string;
    public readonly field?: string;

    constructor(message: string, rowId?: string, field?: string) {
        super(message);
        this.name = 'DataParseError';
        this.rowId = rowId;
        this.field = field;
    }
}

/**
 * Brazilian states (all 27 states)
 */
const BRAZILIAN_STATES = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

/**
 * CSR names for mapping
 */
const CSR_NAMES = [
    'CSR 10 Brasil',
    'CSR Brasil',
    'CSR Brasil Central',
    'CSR Brasil Sul',
    'CSR Grande São Paulo',
    'CSR HOW Brasil',
    'CSR Minas',
    'CSR Nordeste',
    'CSR Rio de Janeiro',
    'CSR Rio Grande do Sul',
    'CSR Terra do Sol',
    'CSR UAI'
] as const;

/**
 * DataParser class for transforming raw sheet data
 */
export class DataParser {
    private warnings: string[] = [];

    /**
     * Parses raw sheet rows into typed CampaignRecord objects
     * Skips invalid records and logs warnings
     */
    parse(rows: RawSheetRow[]): CampaignRecord[] {
        this.warnings = [];
        const records: CampaignRecord[] = [];

        if (rows.length === 0) {
            console.warn('DataParser: No rows to parse');
            return records;
        }

        // Validate schema
        try {
            this.validateSchema(rows);
        } catch (error) {
            console.error('DataParser: Schema validation failed', error);
            throw error;
        }

        // Parse each row
        for (const row of rows) {
            try {
                const record = this.parseRow(row);
                records.push(record);
            } catch (error) {
                const rowId = row['ID_Resposta'] as string || 'unknown';
                const message = error instanceof Error ? error.message : String(error);
                this.warnings.push(`Registro ${rowId}: ${message}`);
                console.warn(`DataParser: Skipping invalid row ${rowId}`, error);
            }
        }

        // Log summary if there were warnings
        if (this.warnings.length > 0) {
            console.warn(
                `DataParser: ${this.warnings.length} registro(s) foram ignorados devido a dados inválidos.`
            );
        }

        return records;
    }

    /**
     * Parses a single row into a CampaignRecord
     * @throws {DataParseError} If required fields are missing or invalid
     */
    parseRow(row: RawSheetRow): CampaignRecord {
        // Validate required fields
        const id = this.getRequiredString(row, 'ID_Resposta');

        // Parse all fields with appropriate error handling
        const timestamp = this.parseDate(row['Carimbo de data/hora']);
        if (!timestamp) {
            throw new DataParseError('Timestamp inválido', id, 'Carimbo de data/hora');
        }

        const selectedCSR = this.getRequiredString(row, 'Selecione o CSR');
        const stateRaw = this.getRequiredString(row, 'Selecione o Estado');

        // Extract state abbreviation from format "State Name (XX)" or just "XX"
        const state = this.extractStateCode(stateRaw);

        // Validate state
        if (!state || !BRAZILIAN_STATES.includes(state as typeof BRAZILIAN_STATES[number])) {
            throw new DataParseError(`Estado inválido: ${stateRaw}`, id, 'Selecione o Estado');
        }

        // Parse CSR/CSA mapping
        const csrCSAMap = this.parseCSRCSAMap(row);

        // Parse conditional city/neighborhood based on state
        const city = this.parseConditionalCity(row, state);
        const neighborhood = this.parseConditionalNeighborhood(row, state);

        // Parse activity date
        const activityDate = this.parseDate(row['Data']);
        if (!activityDate) {
            throw new DataParseError('Data da atividade inválida', id, 'Data');
        }

        // Parse service structure
        const serviceStructure = this.parseServiceStructure(row['Qual Estrutura Prestou Atividade']);
        if (!serviceStructure) {
            throw new DataParseError('Estrutura de serviço inválida', id, 'Qual Estrutura Prestou Atividade');
        }

        // Parse activity format
        const activityFormat = this.parseActivityFormat(row['Formato do Atendimento']);
        if (!activityFormat) {
            throw new DataParseError('Formato de atividade inválido', id, 'Formato do Atendimento');
        }

        // Parse materials
        const materials = this.parseMaterials(row);

        // Build the complete record
        const record: CampaignRecord = {
            id,
            timestamp,
            email: this.getString(row, 'Email') || '',
            name: this.getString(row, 'Nome') || '',
            phone: this.getString(row, 'Telefone') || '',
            position: this.getString(row, 'Encargo na Irmandade') || '',
            selectedCSR,
            csrCSAMap,
            state,
            city,
            neighborhood,
            activityDate,
            activityTime: this.getString(row, 'Horário') || '',
            serviceStructure,
            activityFormat,
            institution: this.getString(row, 'Nome da Instituição / Grupo') || '',
            activityType: this.getString(row, 'Tipo de Atividade') || '',
            activityDescription: this.getString(row, 'Qual atividade realizada?') || '',
            speakersCount: this.parseNumber(row['Quantidade de Oradores/Servidores']) || 0,
            participantsCount: this.parseNumber(row['Quantidade de Participantes']) || 0,
            audienceReached: this.parseNumber(row['Quantidade de Público Atingido']) || 0,
            serviceCost: this.parseNumber(row['Custo do Serviço']) || 0,
            materials,
            observations: this.getString(row, 'Alguma observação?') || ''
        };

        return record;
    }

    /**
     * Extracts unique filter options from parsed records
     */
    extractFilterOptions(records: CampaignRecord[]): FilterOptions {
        const csasSet = new Set<string>();
        const csrsSet = new Set<string>();
        const statesSet = new Set<string>();
        const citiesSet = new Set<string>();
        const activityTypesSet = new Set<string>();

        for (const record of records) {
            // Add CSR
            if (record.selectedCSR) {
                csrsSet.add(record.selectedCSR);
            }

            // Add CSAs from the map
            Object.values(record.csrCSAMap).forEach(csa => {
                if (csa) {
                    csasSet.add(csa);
                }
            });

            // Add state
            if (record.state) {
                statesSet.add(record.state);
            }

            // Add city
            if (record.city) {
                citiesSet.add(record.city);
            }

            // Add activity type
            if (record.activityType) {
                activityTypesSet.add(record.activityType);
            }
        }

        return {
            csas: Array.from(csasSet).sort(),
            csrs: Array.from(csrsSet).sort(),
            states: Array.from(statesSet).sort(),
            cities: Array.from(citiesSet).sort(),
            activityTypes: Array.from(activityTypesSet).sort()
        };
    }

    /**
     * Gets warnings from the last parse operation
     */
    getWarnings(): string[] {
        return [...this.warnings];
    }

    // ========================================================================
    // Private Helper Methods
    // ========================================================================

    /**
     * Validates that required columns exist in the dataset
     */
    private validateSchema(rows: RawSheetRow[]): void {
        const requiredColumns = [
            'ID_Resposta',
            'Carimbo de data/hora',
            'Selecione o CSR',
            'Selecione o Estado',
            'Data',
            'Qual Estrutura Prestou Atividade',
            'Tipo de Atividade'
        ];

        if (rows.length === 0) {
            throw new DataParseError('Planilha vazia ou sem dados');
        }

        const firstRow = rows[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));

        if (missingColumns.length > 0) {
            throw new DataParseError(
                `Colunas obrigatórias ausentes: ${missingColumns.join(', ')}`
            );
        }
    }

    /**
     * Extracts state code from formats like "Paraná (PR)" or just "PR"
     */
    private extractStateCode(value: string): string | null {
        if (!value) return null;

        const trimmed = value.trim();

        // Check if it's already just the code (2 uppercase letters)
        if (/^[A-Z]{2}$/.test(trimmed)) {
            return trimmed;
        }

        // Extract from format "State Name (XX)"
        const match = trimmed.match(/\(([A-Z]{2})\)$/);
        if (match) {
            return match[1];
        }

        return null;
    }

    /**
     * Gets a required string field, throws if missing
     */
    private getRequiredString(row: RawSheetRow, field: string): string {
        const value = row[field];
        if (value === null || value === undefined || value === '') {
            throw new DataParseError(`Campo obrigatório ausente: ${field}`);
        }
        return String(value).trim();
    }

    /**
     * Gets an optional string field
     */
    private getString(row: RawSheetRow, field: string): string | null {
        const value = row[field];
        if (value === null || value === undefined || value === '') {
            return null;
        }
        return String(value).trim();
    }

    /**
     * Parses a date from various formats
     */
    parseDate(value: unknown): Date | null {
        if (!value || value === '') {
            return null;
        }

        // Try parsing as Date object
        if (value instanceof Date) {
            return isNaN(value.getTime()) ? null : value;
        }

        // Try parsing as string
        const str = String(value).trim();
        const date = new Date(str);

        if (isNaN(date.getTime())) {
            return null;
        }

        return date;
    }

    /**
     * Parses a number from various formats
     */
    parseNumber(value: unknown): number | null {
        if (value === null || value === undefined || value === '') {
            return null;
        }

        // If already a number
        if (typeof value === 'number') {
            return isNaN(value) ? null : value;
        }

        // Try parsing as string
        const str = String(value).trim();

        // Remove common formatting (thousand separators, currency symbols)
        const cleaned = str.replace(/[R$\s.]/g, '').replace(',', '.');
        const num = Number(cleaned);

        if (isNaN(num)) {
            return null;
        }

        return num;
    }

    /**
     * Parses service structure enum with flexible matching
     */
    private parseServiceStructure(value: unknown): ServiceStructure | null {
        if (!value) return null;

        const str = String(value).trim().toLowerCase();

        // Map variations to standard values
        if (str === 'subcomite' || str === 'sub-comite' || str === 'sub-comitê' || str === 'subcomitê') {
            return 'Sub-comitê';
        }
        if (str === 'oficina') {
            return 'Oficina';
        }
        if (str === 'area' || str === 'área') {
            return 'Área';
        }
        if (str === 'outros' || str === 'outro') {
            return 'Outros';
        }

        return null;
    }

    /**
     * Parses activity format enum with flexible matching
     */
    private parseActivityFormat(value: unknown): ActivityFormat | null {
        if (!value) return null;

        const str = String(value).trim().toLowerCase();

        // Map variations to standard values
        if (str === 'presencial') {
            return 'Presencial';
        }
        if (str === 'hibrido' || str === 'híbrido' || str === 'hybr ido') {
            return 'Híbrido';
        }
        if (str === 'virtual') {
            return 'Virtual';
        }
        if (str === 'online') {
            return 'Online';
        }

        return null;
    }

    /**
     * Parses CSR/CSA mapping from 12 CSR-specific columns
     */
    private parseCSRCSAMap(row: RawSheetRow): CSRCSAMap {
        const map: CSRCSAMap = {};

        for (const csrName of CSR_NAMES) {
            const columnName = `${csrName} - Selecione o CSA`;
            const value = this.getString(row, columnName);

            if (value) {
                map[csrName] = value;
            }
        }

        return map;
    }

    /**
     * Parses conditional city column based on selected state
     */
    private parseConditionalCity(row: RawSheetRow, state: string): string | null {
        // Try exact match first
        const exactColumn = `Selecione a cidade - ${state}`;
        let value = this.getString(row, exactColumn);

        if (value) {
            return value;
        }

        // Try variations with brackets
        const bracketColumn = `Selecione a cidade - [${state}]`;
        value = this.getString(row, bracketColumn);

        if (value) {
            return value;
        }

        // Try without dash
        const noDashColumn = `Selecione a cidade ${state}`;
        value = this.getString(row, noDashColumn);

        return value;
    }

    /**
     * Parses conditional neighborhood column based on selected state
     */
    private parseConditionalNeighborhood(row: RawSheetRow, state: string): string | null {
        // Try exact match first
        const exactColumn = `Qual o bairro? (${state})`;
        let value = this.getString(row, exactColumn);

        if (value) {
            return value;
        }

        // Try variations with brackets
        const bracketColumn = `Qual o bairro? [${state}]`;
        value = this.getString(row, bracketColumn);

        if (value) {
            return value;
        }

        // Try without parentheses
        const noParenColumn = `Qual o bairro? ${state}`;
        value = this.getString(row, noParenColumn);

        return value;
    }

    /**
     * Parses materials distributed from multiple columns
     */
    private parseMaterials(row: RawSheetRow): MaterialsDistributed {
        return {
            cartazes: this.parseNumber(row['Cartazes - apenas número']) || 0,
            panfletos: this.parseNumber(row['Panfletos - apenas número']) || 0,
            listaGrupos: this.parseNumber(row['Lista de Grupos - apenas número']) || 0,
            cartao: this.parseNumber(row['Cartão - apenas número']) || 0,
            folder: this.parseNumber(row['Folder - apenas número']) || 0,
            ips: this.parseNumber(row['IPs - Folhetos - apenas número']) || 0,
            folhetos: this.parseNumber(row['Folhetos - apenas número']) || 0,
            textoBasico: this.parseNumber(row['Texto Básico - apenas número']) || 0,
            pastaRP: this.parseNumber(row['Pasta RP - apenas número']) || 0,
            lixoCar: this.parseNumber(row['Lixo Car - apenas número']) || 0,
            calendario: this.parseNumber(row['Calendário - apenas número']) || 0,
            outros: this.parseNumber(row['Outros Materiais']) || 0
        };
    }
}

/**
 * Factory function to create a DataParser instance
 */
export function createDataParser(): DataParser {
    return new DataParser();
}
