// src/createStore.ts
import { useState, useEffect } from "react";
import { setMemory, getMemory } from "./memoryStore";
import { URLTransfer } from "./urlTransfer";
import { enhancedIndexedDB } from "./enhancedIndexedDB";
import { TTL } from "./ttlPresets";
import { SharedDataReturn, StoreOptions, TTLPreset } from "./types";

function parseTTL(ttl: TTLPreset | undefined): number | undefined {
  if (ttl === undefined) return undefined;

  if (typeof ttl === "string" && TTL[ttl as keyof typeof TTL] !== undefined) {
    return TTL[ttl as keyof typeof TTL];
  }

  if (typeof ttl === "number") {
    return ttl;
  }

  if (typeof ttl === "string") {
    const match = ttl.match(/^(\d+)\s*(minute|hour|day|week|month|year)s?$/i);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();

      const multipliers: Record<string, number> = {
        minute: 60 * 1000,
        hour: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000,
      };

      return value * multipliers[unit];
    }

    const simpleNumber = parseInt(ttl);
    if (!isNaN(simpleNumber)) {
      return simpleNumber * 60 * 1000;
    }
  }

  return undefined;
}

export function useSharedData<T>(
  key: string,
  initialValue?: T,
  options: StoreOptions = {},
): SharedDataReturn<T> {
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const urlData = URLTransfer.extractFromURL();
      if (urlData && urlData[key] !== undefined) {
        return urlData[key];
      }
    }

    const memoryValue = getMemory<T>(key);
    if (memoryValue !== undefined) return memoryValue;

    return initialValue;
  });

  useEffect(() => {
    const loadFromIndexedDB = async () => {
      if (options.persist === "indexedDB") {
        try {
          const persisted = await enhancedIndexedDB.get<T>(key);
          if (persisted !== null) {
            setValue(persisted);
            setMemory(key, persisted);
          }
        } catch (error) {
          console.warn("Failed to load from IndexedDB:", error);
        }
      }
    };

    loadFromIndexedDB();
  }, [key, options.persist]);

  useEffect(() => {
    if (value !== undefined) {
      setMemory(key, value);

      if (options.persist === "indexedDB") {
        const ttlMs = parseTTL(options.ttl);

        enhancedIndexedDB
          .set(key, value, {
            ttl: ttlMs,
            category: options.category,
          })
          .catch((error) => {
            console.warn("Failed to persist to IndexedDB:", error);
          });
      }
    }
  }, [key, value, options.persist, options.ttl, options.category]);

  return [value, setValue] as const;
}

export function setSharedData<T>(
  key: string,
  value: T,
  options: StoreOptions = {},
): void {
  setMemory(key, value);

  if (options.persist === "indexedDB") {
    const ttlMs = parseTTL(options.ttl);

    enhancedIndexedDB
      .set(key, value, {
        ttl: ttlMs,
        category: options.category,
      })
      .catch((error) => {
        console.warn("Failed to persist to IndexedDB:", error);
      });
  }
}

export function createTransferURL(
  path: string,
  data: Record<string, any>,
): string {
  return URLTransfer.createTransferURL(path, data);
}

export async function clearPersistedData(category?: string): Promise<void> {
  return enhancedIndexedDB.clear(category);
}

export async function getPersistedKeys(): Promise<string[]> {
  return enhancedIndexedDB.getKeys();
}

export async function exportAllData(): Promise<string> {
  return enhancedIndexedDB.exportData();
}

export async function importData(jsonData: string): Promise<void> {
  return enhancedIndexedDB.importData(jsonData);
}

export { enhancedIndexedDB as indexedDBStore, TTL };
