// types/react.d.ts
import { StoreOptions, SharedDataReturn } from "./store";

/**
 * React-specific hook types
 */
declare module "next-shared-store" {
  /**
   * Hook for sharing state between components and pages
   * @param key Unique identifier for the data
   * @param initialValue Initial value if no data exists
   * @param options Storage and persistence options
   * @returns [value, setValue] tuple similar to useState
   */
  export function useSharedData<T>(
    key: string,
    initialValue?: T,
    options?: StoreOptions,
  ): SharedDataReturn<T>;
}

// Global type extensions
declare global {
  interface Window {
    NextSharedStore?: {
      version: string;
      debug: boolean;
    };
  }
}
