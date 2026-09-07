/**
 * Deterministic Toy Fact Pool & Fact Generator
 *
 * Provides reproducible associative recall sequences for the StateLens experiment.
 */

export const DEFAULT_FACT_POOL = [
  { key: 'APPLE',     value: 7 },
  { key: 'MANGO',     value: 3 },
  { key: 'KIWI',      value: 9 },
  { key: 'ORANGE',    value: 4 },
  { key: 'BANANA',    value: 8 },
  { key: 'GRAPE',     value: 2 },
  { key: 'PEACH',     value: 6 },
  { key: 'BERRY',     value: 5 },
  { key: 'MELON',     value: 1 },
  { key: 'LEMON',     value: 7 },
  { key: 'PLUM',      value: 3 },
  { key: 'CHERRY',    value: 9 },
  { key: 'FIG',       value: 4 },
  { key: 'LIME',      value: 8 },
  { key: 'PEAR',      value: 2 },
  { key: 'GUAVA',     value: 5 },
  { key: 'PAPAYA',    value: 6 },
  { key: 'DATES',     value: 1 },
  { key: 'APRICOT',   value: 3 },
  { key: 'JACKFRUIT', value: 7 },
];

export const DEFAULT_FACT_COUNT = 6;

/**
 * Generate a deterministic slice of facts for N items.
 *
 * @param {number} count
 * @returns {Array<{key: string, value: number, index: number}>}
 */
export function generateFacts(count) {
  return DEFAULT_FACT_POOL.slice(0, Math.min(count, DEFAULT_FACT_POOL.length)).map((f, i) => ({
    ...f,
    index: i,
  }));
}
