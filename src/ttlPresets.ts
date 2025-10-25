// src/ttlPresets.ts
import { TTLPresets } from "./types";

export const TTL: TTLPresets = {
  // Short-term
  "5min": 5 * 60 * 1000,
  "15min": 15 * 60 * 1000,
  "30min": 30 * 60 * 1000,
  "1hour": 60 * 60 * 1000,
  "2hours": 2 * 60 * 60 * 1000,

  // Medium-term
  "6hours": 6 * 60 * 60 * 1000,
  "12hours": 12 * 60 * 60 * 1000,
  "1day": 24 * 60 * 60 * 1000,
  "2days": 2 * 24 * 60 * 60 * 1000,
  "3days": 3 * 24 * 60 * 60 * 1000,

  // Long-term
  "1week": 7 * 24 * 60 * 60 * 1000,
  "2weeks": 14 * 24 * 60 * 60 * 1000,
  "1month": 30 * 24 * 60 * 60 * 1000,
  "3months": 90 * 24 * 60 * 60 * 1000,
  "6months": 180 * 24 * 60 * 60 * 1000,

  // Special
  session: 24 * 60 * 60 * 1000,
  forever: 0,

  // Aliases for convenience
  get short() {
    return this["30min"];
  },
  get medium() {
    return this["1day"];
  },
  get long() {
    return this["1week"];
  },
  get veryLong() {
    return this["1month"];
  },
} as const;
