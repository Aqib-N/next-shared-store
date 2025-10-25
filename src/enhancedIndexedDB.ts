// src/enhancedIndexedDB.ts
import { EnhancedIndexedDBInterface, IndexedDBRecord } from "./types";

export class EnhancedIndexedDB implements EnhancedIndexedDBInterface {
  private dbName = "NextSharedStore";
  private version = 1;
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  private async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        this.initPromise = null;
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initPromise = null;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains("sharedData")) {
          const store = db.createObjectStore("sharedData", { keyPath: "key" });
          store.createIndex("timestamp", "timestamp");
          store.createIndex("expires", "expires");
          store.createIndex("category", "category");
        }
      };
    });

    return this.initPromise;
  }

  async set(
    key: string,
    value: any,
    options: {
      ttl?: number;
      category?: string;
    } = {},
  ): Promise<void> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["sharedData"], "readwrite");
      const store = transaction.objectStore("sharedData");

      const record: IndexedDBRecord = {
        key,
        value,
        timestamp: Date.now(),
        category: options.category || "default",
        expires: options.ttl ? Date.now() + options.ttl : null,
      };

      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);

      this.cleanExpired().catch(() => {});
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["sharedData"], "readonly");
      const store = transaction.objectStore("sharedData");
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result as IndexedDBRecord | undefined;

        if (!result) {
          resolve(null);
          return;
        }

        if (result.expires && Date.now() > result.expires) {
          this.remove(key);
          resolve(null);
          return;
        }

        resolve(result.value);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getMany<T>(keys: string[]): Promise<Record<string, T>> {
    const results: Record<string, T> = {};

    const promises = keys.map(async (key) => {
      const value = await this.get<T>(key);
      if (value !== null) {
        results[key] = value;
      }
    });

    await Promise.all(promises);
    return results;
  }

  async remove(key: string): Promise<void> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["sharedData"], "readwrite");
      const store = transaction.objectStore("sharedData");
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(category?: string): Promise<void> {
    const db = await this.init();

    if (category) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["sharedData"], "readwrite");
        const store = transaction.objectStore("sharedData");
        const index = store.index("category");
        const request = index.openCursor(IDBKeyRange.only(category));

        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          } else {
            resolve();
          }
        };

        request.onerror = () => reject(request.error);
      });
    } else {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["sharedData"], "readwrite");
        const store = transaction.objectStore("sharedData");
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  async getKeys(): Promise<string[]> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["sharedData"], "readonly");
      const store = transaction.objectStore("sharedData");
      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => reject(request.error);
    });
  }

  private async cleanExpired(): Promise<void> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["sharedData"], "readwrite");
      const store = transaction.objectStore("sharedData");
      const index = store.index("expires");
      const range = IDBKeyRange.upperBound(Date.now());

      const request = index.openCursor(range);

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async exportData(): Promise<string> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["sharedData"], "readonly");
      const store = transaction.objectStore("sharedData");
      const request = store.getAll();

      request.onsuccess = () => {
        const data = (request.result as IndexedDBRecord[])
          .filter((record) => !record.expires || Date.now() <= record.expires)
          .map((record) => ({
            key: record.key,
            value: record.value,
            category: record.category,
            ttl: record.expires ? record.expires - Date.now() : null,
          }));

        resolve(JSON.stringify(data));
      };

      request.onerror = () => reject(request.error);
    });
  }

  async importData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    const importPromises = data.map((item: any) =>
      this.set(item.key, item.value, {
        ttl: item.ttl || undefined,
        category: item.category,
      }),
    );

    await Promise.all(importPromises);
  }
}

export const enhancedIndexedDB = new EnhancedIndexedDB();
