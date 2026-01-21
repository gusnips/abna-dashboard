/**
 * DataContext - Provides campaign data to the entire application
 * 
 * This context manages data fetching from Google Sheets, caching,
 * loading states, and error handling. It provides:
 * - Campaign records array
 * - Loading state
 * - Error state
 * - Refetch method
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { CampaignRecord, DataContextValue } from '../types';
import { createGoogleSheetsService } from '../services';
import { DataParser } from '../utils/DataParser';

// Cache key for sessionStorage
const CACHE_KEY = 'abna_campaign_data_cache';
const CACHE_TIMESTAMP_KEY = 'abna_campaign_data_cache_timestamp';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Create the DataContext with undefined default value
 * This forces consumers to use the context within a provider
 */
const DataContext = createContext<DataContextValue | undefined>(undefined);

/**
 * Props for DataProvider component
 */
interface DataProviderProps {
    children: ReactNode;
}

/**
 * DataProvider component that manages campaign data state
 */
export function DataProvider({ children }: DataProviderProps) {
    const [records, setRecords] = useState<CampaignRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Checks if cached data is still valid
     */
    const isCacheValid = useCallback((): boolean => {
        try {
            const timestamp = sessionStorage.getItem(CACHE_TIMESTAMP_KEY);
            if (!timestamp) {
                return false;
            }

            const cacheAge = Date.now() - parseInt(timestamp, 10);
            return cacheAge < CACHE_DURATION;
        } catch {
            // If sessionStorage is not available or throws an error
            return false;
        }
    }, []);

    /**
     * Retrieves cached data from sessionStorage
     */
    const getCachedData = useCallback((): CampaignRecord[] | null => {
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (!cached || !isCacheValid()) {
                return null;
            }

            const parsed = JSON.parse(cached) as CampaignRecord[];

            // Convert date strings back to Date objects
            return parsed.map((record) => ({
                ...record,
                timestamp: new Date(record.timestamp),
                activityDate: new Date(record.activityDate)
            }));
        } catch (err) {
            console.warn('Failed to retrieve cached data:', err);
            return null;
        }
    }, [isCacheValid]);

    /**
     * Saves data to sessionStorage cache
     */
    const setCachedData = useCallback((data: CampaignRecord[]): void => {
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
            sessionStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (err) {
            console.warn('Failed to cache data:', err);
            // Continue without caching - not a critical error
        }
    }, []);

    /**
     * Fetches data from Google Sheets API
     */
    const fetchData = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            // Create service and parser
            const service = createGoogleSheetsService();
            const parser = new DataParser();

            // Fetch raw data from Google Sheets
            const rawData = await service.fetchData();

            // Parse raw data into CampaignRecord objects
            const parsedRecords = parser.parse(rawData);

            // Update state
            setRecords(parsedRecords);
            setError(null);

            // Cache the data
            setCachedData(parsedRecords);
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error(String(err));
            setError(errorObj);

            // Try to use cached data if available
            const cachedData = getCachedData();
            if (cachedData && cachedData.length > 0) {
                setRecords(cachedData);
                // Update error to indicate we're using cached data
                setError(new Error('Usando dados em cache. ' + errorObj.message));
            } else {
                setRecords([]);
            }
        } finally {
            setLoading(false);
        }
    }, [getCachedData, setCachedData]);

    /**
     * Refetch data (exposed to consumers)
     */
    const refetch = useCallback(async (): Promise<void> => {
        await fetchData();
    }, [fetchData]);

    /**
     * Load data on mount
     * First try to use cached data for instant display,
     * then fetch fresh data in the background
     */
    useEffect(() => {
        const loadData = async () => {
            // Try to load from cache first for instant display
            const cachedData = getCachedData();
            if (cachedData && cachedData.length > 0) {
                setRecords(cachedData);
                setLoading(false);
                // Still fetch fresh data in background
                fetchData();
            } else {
                // No cache, fetch data
                await fetchData();
            }
        };

        loadData();
    }, [fetchData, getCachedData]);

    // Context value
    const value: DataContextValue = {
        records,
        loading,
        error,
        refetch
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

/**
 * Custom hook to use DataContext
 * @throws {Error} If used outside of DataProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useData(): DataContextValue {
    const context = useContext(DataContext);

    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }

    return context;
}

/**
 * Export the context for testing purposes
 */
export { DataContext };
