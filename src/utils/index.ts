/**
 * Funções utilitárias e classes para processamento de dados
 */

export { DataParser, DataParseError, createDataParser } from './DataParser';

export {
    calculateSummaryStatistics,
    rankCitiesByActivityCount,
    rankStatesByActivityCount,
    aggregateMaterials,
    countByField,
    extractHourBucket,
    aggregateByHour,
    rankCSRsByActivityCount,
    rankCSRsByAudienceReached,
    rankCSAsByActivityCount,
    filterRecordsByCSR,
    countCSAsForCSR,
    aggregateCSABreakdown,
    formatNumber,
    formatCurrency,
} from './aggregation';

export { csrToSlug, slugToCSR } from './slug';
