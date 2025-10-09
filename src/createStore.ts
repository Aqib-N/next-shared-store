// src/createStore.ts
import { useState, useEffect } from "react";
import { setMemory, getMemory } from "./memoryStore";

export function useSharedData<T>(key: string, initialValue?: T) {
  const [value, setValue] = useState<T>(
    () => getMemory<T>(key) || initialValue,
  );

  useEffect(() => {
    if (value !== undefined) setMemory(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

export function setSharedData<T>(key: string, value: T) {
  setMemory(key, value);
}
