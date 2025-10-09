// src/memoryStore.ts
const globalStore: Record<string, any> = {};

export function setMemory(key: string, value: any) {
  globalStore[key] = value;
}

export function getMemory<T>(key: string): T | undefined {
  return globalStore[key];
}

export function clearMemory(key?: string) {
  if (key) delete globalStore[key];
  else Object.keys(globalStore).forEach((k) => delete globalStore[k]);
}
