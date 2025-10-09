// src/persist.ts
import { setMemory, getMemory } from "./memoryStore";

const STORAGE_KEY = "__next_shared_store__";

export function persistToSession() {
  if (typeof window === "undefined") return;
  const data = JSON.stringify(getMemory(STORAGE_KEY));
  sessionStorage.setItem(STORAGE_KEY, data);
}

export function rehydrateFromSession() {
  if (typeof window === "undefined") return;
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.keys(parsed).forEach((k) => setMemory(k, parsed[k]));
  }
}
