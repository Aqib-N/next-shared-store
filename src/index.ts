// src/index.ts
export {
  useSharedData,
  setSharedData,
  createTransferURL,
  clearPersistedData,
  getPersistedKeys,
  exportAllData,
  importData,
  indexedDBStore,
  TTL,
} from "./createStore";

export { URLTransfer } from "./urlTransfer";
export { setMemory, getMemory, clearMemory } from "./memoryStore";
export type { StoreOptions, TTLPreset } from "./types";
