/** Shared by the Server Component page and the client range switcher (must not live in a 'use client' file). */
export const TREND_RANGES = [
  { value: 30, label: '30D' },
  { value: 90, label: '90D' },
  { value: 180, label: '6M' },
] as const;
