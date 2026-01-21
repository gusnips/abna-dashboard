/**
 * Core TypeScript types and interfaces for ABNA Campaign Dashboard
 */

// ============================================================================
// Campaign Data Types
// ============================================================================

/**
 * Materials distributed during a campaign activity
 */
export interface MaterialsDistributed {
    cartazes: number;
    panfletos: number;
    listaGrupos: number;
    cartao: number;
    folder: number;
    ips: number;
    folhetos: number;
    textoBasico: number;
    pastaRP: number;
    lixoCar: number;
    calendario: number;
    outros: number;
}

/**
 * Service structure types
 */
export type ServiceStructure = 'Sub-comitê' | 'Oficina' | 'Área' | 'Outros';

/**
 * Activity format types
 */
export type ActivityFormat = 'Presencial' | 'Híbrido' | 'Virtual' | 'Online';

/**
 * CSR to CSA mapping for regional selections
 */
export interface CSRCSAMap {
    'CSR 10 Brasil'?: string;
    'CSR Brasil'?: string;
    'CSR Brasil Central'?: string;
    'CSR Brasil Sul'?: string;
    'CSR Grande São Paulo'?: string;
    'CSR HOW Brasil'?: string;
    'CSR Minas'?: string;
    'CSR Nordeste'?: string;
    'CSR Rio de Janeiro'?: string;
    'CSR Rio Grande do Sul'?: string;
    'CSR Terra do Sol'?: string;
    'CSR UAI'?: string;
}

/**
 * Complete campaign record representing a single form submission
 */
export interface CampaignRecord {
    id: string;
    timestamp: Date;
    email: string;
    name: string;
    phone: string;
    position: string;
    selectedCSR: string;
    csrCSAMap: CSRCSAMap;
    state: string;
    city: string | null;
    neighborhood: string | null;
    activityDate: Date;
    activityTime: string;
    serviceStructure: ServiceStructure;
    activityFormat: ActivityFormat;
    institution: string;
    activityType: string;
    activityDescription: string;
    speakersCount: number;
    participantsCount: number;
    audienceReached: number;
    serviceCost: number;
    materials: MaterialsDistributed;
    observations: string;
}

// ============================================================================
// Filter Types
// ============================================================================

/**
 * Geographic scope for filtering
 */
export type GeographicScope = 'brasil' | 'csa' | 'region' | 'state' | 'city';

/**
 * Filter state managing all active filters
 */
export interface FilterState {
    geographicScope: GeographicScope;
    selectedCSA: string | null;
    selectedRegion: string | null;
    selectedState: string | null;
    selectedCity: string | null;
    dateRange: {
        start: Date | null;
        end: Date | null;
    };
}

/**
 * Available filter options extracted from data
 */
export interface FilterOptions {
    csas: string[];
    csrs: string[];
    states: string[];
    cities: string[];
    activityTypes: string[];
}

// ============================================================================
// Summary Statistics Types
// ============================================================================

/**
 * Aggregated statistics for summary cards
 */
export interface SummaryStatistics {
    totalPanels: number;
    firstTimeResidents: number;
    totalResidents: number;
    transferAmount: number;
    speakersCount: number;
    audienceReached: number;
    participantsCount: number;
}

// ============================================================================
// Chart Data Types
// ============================================================================

/**
 * Generic chart data point for pie and bar charts
 */
export interface ChartData {
    name: string;
    value: number;
    [key: string]: string | number; // Index signature for Recharts compatibility
}

/**
 * Time series data point for line charts
 */
export interface TimeSeriesData {
    date: string;
    count: number;
}

/**
 * Ranking item for geographic rankings
 */
export interface RankingItem {
    name: string;
    count: number;
    rank: number;
}

/**
 * Material row for materials table
 */
export interface MaterialRow {
    material: string;
    quantity: number;
}

// ============================================================================
// Raw Data Types
// ============================================================================

/**
 * Raw row from Google Sheets API
 */
export interface RawSheetRow {
    [key: string]: string | number | null;
}

// ============================================================================
// Context Types
// ============================================================================

/**
 * Data context value providing campaign records
 */
export interface DataContextValue {
    records: CampaignRecord[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Filter context value providing filtered data and filter controls
 */
export interface FilterContextValue {
    filters: FilterState;
    setGeographicFilter: (scope: GeographicScope, value: string | null) => void;
    setDateRange: (start: Date | null, end: Date | null) => void;
    clearFilters: () => void;
    filteredRecords: CampaignRecord[];
    filterOptions: FilterOptions;
}

// ============================================================================
// Service Configuration Types
// ============================================================================

/**
 * Google Sheets API configuration
 */
export interface GoogleSheetsConfig {
    apiKey: string;
    spreadsheetId: string;
    range: string;
}

// ============================================================================
// Global Type Extensions
// ============================================================================

/**
 * Error tracker interface for optional error logging service
 */
export interface ErrorTracker {
    logError: (error: Error, errorInfo: Record<string, unknown>) => void;
}

/**
 * Extend Window interface to include optional error tracker
 */
declare global {
    interface Window {
        errorTracker?: ErrorTracker;
    }
}

// This export is needed to make this file a module
export { };
