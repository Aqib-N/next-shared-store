// types/ttl.d.ts
/**
 * TTL preset values for common time durations
 */
export interface TTLPresets {
  // Short-term
  "5min": number;
  "15min": number;
  "30min": number;
  "1hour": number;
  "2hours": number;

  // Medium-term
  "6hours": number;
  "12hours": number;
  "1day": number;
  "2days": number;
  "3days": number;

  // Long-term
  "1week": number;
  "2weeks": number;
  "1month": number;
  "3months": number;
  "6months": number;

  // Special
  session: number;
  forever: number;

  // Convenience aliases
  short: number;
  medium: number;
  long: number;
  veryLong: number;
}

/**
 * Supported TTL preset keys
 */
export type TTLPresetKey = keyof TTLPresets;

/**
 * All supported TTL value types
 */
export type TTLPreset = TTLPresetKey | number | string;

/**
 * Human-readable time units for TTL
 */
export type TimeUnit = "minute" | "hour" | "day" | "week" | "month" | "year";

/**
 * TTL configuration object
 */
export interface TTLConfig {
  value: number;
  unit: TimeUnit;
  milliseconds: number;
}

// TTL constants declaration
export declare const TTL: TTLPresets;
