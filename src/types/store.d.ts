// types/store.d.ts
import { TTLPreset } from "./ttl";

/**
 * Options for data storage configuration
 */
export interface StoreOptions {
  /**
   * Persistence method for the data
   * - 'indexedDB': Long-term storage in browser's IndexedDB
   * - 'url': Transfer via URL parameters (for static-to-dynamic pages)
   * - 'memory': In-memory only (cleared on page refresh)
   * @default 'memory'
   */
  persist?: "indexedDB" | "url" | "memory";

  /**
   * Time To Live - how long the data should persist
   * Can be a preset key, number (milliseconds), or human-readable string
   * @example '30min', '2 hours', 3600000, TTL.medium
   */
  ttl?: TTLPreset;

  /**
   * Category to organize related data
   * Useful for bulk operations like clearing by category
   */
  category?: string;
}

/**
 * Hook return type for useSharedData
 */
export type SharedDataReturn<T> = [T, (value: T | ((prev: T) => T)) => void];

/**
 * IndexedDB record structure
 */
export interface IndexedDBRecord {
  key: string;
  value: any;
  timestamp: number;
  category: string;
  expires: number | null;
}

/**
 * Enhanced IndexedDB store interface
 */
export interface EnhancedIndexedDBInterface {
  /**
   * Store data in IndexedDB
   */
  set(
    key: string,
    value: any,
    options?: {
      ttl?: number;
      category?: string;
    },
  ): Promise<void>;

  /**
   * Retrieve data from IndexedDB
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Retrieve multiple values at once
   */
  getMany<T>(keys: string[]): Promise<Record<string, T>>;

  /**
   * Remove data from IndexedDB
   */
  remove(key: string): Promise<void>;

  /**
   * Clear data - optionally by category
   */
  clear(category?: string): Promise<void>;

  /**
   * Get all stored keys
   */
  getKeys(): Promise<string[]>;

  /**
   * Export all data as JSON string
   */
  exportData(): Promise<string>;

  /**
   * Import data from JSON string
   */
  importData(jsonData: string): Promise<void>;
}

/**
 * URL Transfer utility interface
 */
export interface URLTransferInterface {
  /**
   * Encode data for URL transfer
   */
  encode(data: any): string;

  /**
   * Decode data from URL
   */
  decode(encoded: string): any;

  /**
   * Create a URL with embedded data
   */
  createTransferURL(path: string, data: Record<string, any>): string;

  /**
   * Extract data from current URL
   */
  extractFromURL(): any;
}

/**
 * Memory store interface
 */
export interface MemoryStoreInterface {
  /**
   * Set value in memory store
   */
  setMemory(key: string, value: any): void;

  /**
   * Get value from memory store
   */
  getMemory<T>(key: string): T | undefined;

  /**
   * Clear memory store - optionally by key
   */
  clearMemory(key?: string): void;
}

// Hook declarations
export declare function useSharedData<T>(
  key: string,
  initialValue?: T,
  options?: StoreOptions,
): SharedDataReturn<T>;

export declare function setSharedData<T>(
  key: string,
  value: T,
  options?: StoreOptions,
): void;

export declare function createTransferURL(
  path: string,
  data: Record<string, any>,
): string;

// Utility functions
export declare function clearPersistedData(category?: string): Promise<void>;
export declare function getPersistedKeys(): Promise<string[]>;
export declare function exportAllData(): Promise<string>;
export declare function importData(jsonData: string): Promise<void>;

// Store instances
export declare const indexedDBStore: EnhancedIndexedDBInterface;
