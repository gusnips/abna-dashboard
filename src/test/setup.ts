import '@testing-library/jest-dom'
import { beforeEach } from 'vitest'

// Mock sessionStorage for tests
const createSessionStorageMock = () => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        get length() {
            return Object.keys(store).length;
        },
        key: (index: number) => {
            const keys = Object.keys(store);
            return keys[index] || null;
        }
    };
};

// Set up sessionStorage mock
if (typeof window !== 'undefined' && !window.sessionStorage) {
    Object.defineProperty(window, 'sessionStorage', {
        value: createSessionStorageMock(),
        writable: true
    });
}

// Also set it on globalThis for Node environment
if (typeof globalThis !== 'undefined' && !(globalThis as { sessionStorage?: Storage }).sessionStorage) {
    Object.defineProperty(globalThis, 'sessionStorage', {
        value: createSessionStorageMock(),
        writable: true
    });
}

// Clear sessionStorage before each test
beforeEach(() => {
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
    }
});
