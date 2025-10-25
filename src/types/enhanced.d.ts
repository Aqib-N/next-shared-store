// types/enhanced.d.ts
/**
 * Next Shared Store - Enhanced state management for Next.js
 *
 * @packageDocumentation
 *
 * @example
 * ```tsx
 * import { useSharedData, TTL } from 'next-shared-store';
 *
 * function MyComponent() {
 *   const [user, setUser] = useSharedData('user', null, {
 *     persist: 'indexedDB',
 *     ttl: TTL.medium
 *   });
 *
 *   return <div>Hello {user?.name}</div>;
 * }
 * ```
 */

/**
 * Core store functionality for sharing state between pages and components
 */
declare module "next-shared-store" {
  /**
   * React hook for shared state management
   *
   * @template T Type of the stored value
   * @param key Unique identifier for the data
   * @param initialValue Initial value when no data exists
   * @param options Storage configuration options
   * @returns Tuple of [currentValue, setValueFunction]
   *
   * @example
   * ```tsx
   * // Basic usage
   * const [count, setCount] = useSharedData('counter', 0);
   *
   * // With persistence
   * const [user, setUser] = useSharedData('user', null, {
   *   persist: 'indexedDB',
   *   ttl: '1day'
   * });
   *
   * // URL transfer for static-to-dynamic pages
   * const [formData, setFormData] = useSharedData('form', {});
   * ```
   */
  export function useSharedData<T>(
    key: string,
    initialValue?: T,
    options?: StoreOptions,
  ): SharedDataReturn<T>;

  /**
   * Programmatically set shared data
   *
   * @template T Type of the value
   * @param key Unique identifier for the data
   * @param value Value to store
   * @param options Storage configuration options
   *
   * @example
   * ```tsx
   * setSharedData('user', { name: 'John' }, {
   *   persist: 'indexedDB',
   *   ttl: TTL.long
   * });
   * ```
   */
  export function setSharedData<T>(
    key: string,
    value: T,
    options?: StoreOptions,
  ): void;

  /**
   * Create a URL with embedded data for page navigation
   *
   * @param path Destination path
   * @param data Data to embed in URL
   * @returns URL with encoded data
   *
   * @example
   * ```tsx
   * const url = createTransferURL('/checkout', {
   *   productId: 123,
   *   quantity: 2
   * });
   *
   * // Navigate to the URL
   * window.location.href = url;
   * ```
   */
  export function createTransferURL(
    path: string,
    data: Record<string, any>,
  ): string;

  /**
   * Clear persisted data from IndexedDB
   *
   * @param category Optional category to clear only specific data
   * @returns Promise that resolves when clear is complete
   *
   * @example
   * ```tsx
   * // Clear all data
   * await clearPersistedData();
   *
   * // Clear only draft data
   * await clearPersistedData('drafts');
   * ```
   */
  export function clearPersistedData(category?: string): Promise<void>;

  /**
   * Get all keys of persisted data
   *
   * @returns Promise resolving to array of keys
   */
  export function getPersistedKeys(): Promise<string[]>;

  /**
   * Export all persisted data as JSON string
   *
   * @returns Promise resolving to JSON string
   */
  export function exportAllData(): Promise<string>;

  /**
   * Import data from JSON string
   *
   * @param jsonData JSON string from exportAllData()
   * @returns Promise that resolves when import is complete
   */
  export function importData(jsonData: string): Promise<void>;

  /**
   * Predefined TTL values for common durations
   *
   * @example
   * ```tsx
   * // Using preset keys
   * ttl: TTL['1hour']
   *
   * // Using convenience aliases
   * ttl: TTL.short    // 30 minutes
   * ttl: TTL.medium   // 1 day
   * ttl: TTL.long     // 1 week
   * ```
   */
  export const TTL: TTLPresets;

  /**
   * Direct access to IndexedDB store for advanced operations
   */
  export const indexedDBStore: EnhancedIndexedDBInterface;
}
