/**
 * toyEncoding.js
 *
 * Deterministic synthetic "fact" generator for the associative recall task.
 *
 * We need (key, value) pairs like "Apple = 7" that can be embedded as fixed-
 * dimensional vectors so both the Full Attention and Linear Attention toy
 * models can operate on identical input. Determinism matters: the same seed
 * must always produce the same facts and the same probe order, so that the
 * experiment is reproducible and the "ground truth" panel is never guessing.
 *
 * This is a teaching substrate, not a trained embedding space. Each key is
 * mapped to a fixed pseudo-random unit vector via a seeded hash -> the
 * vectors are stable across runs but not learned from data. This is
 * disclosed in the UI and in the README as a toy encoding, never presented
 * as a real language model embedding.
 */

const VOCAB = [
  'Apple', 'Mango', 'Kiwi', 'Plum', 'Grape', 'Lemon', 'Peach', 'Cherry',
  'Melon', 'Guava', 'Papaya', 'Fig', 'Lychee', 'Date', 'Olive', 'Pear',
  'Berry', 'Coconut', 'Apricot', 'Nectarine',
]

export const KEY_DIM = 16
export const VALUE_DIM = 10

/**
 * Sharpness applied to key/query features before scoring, in both models.
 *
 * Random toy keys (unlike a trained model's learned keys) are not spread
 * out in a way that guarantees strong separation at low dimension. Without
 * this calibration, *both* models would show noisy, unrealistically poor
 * recall even at small N — an artifact of the toy encoding, not of either
 * attention mechanism. TEMP_BOOST sharpens both models' similarity
 * response identically (same constant, same formula shape) so the
 * comparison isolates the one variable the experiment is about: whether
 * memory is stored per-token (full attention) or compressed into one
 * fixed-size running state (linear attention). This constant, and the
 * reasoning above, are disclosed here and in the README — nothing about
 * the comparison is tuned to favor one model over the other.
 */
export const SHARPNESS = 12

/** Small deterministic string hash (FNV-1a variant). */
function hashString(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Seeded pseudo-random generator (mulberry32) — deterministic given a seed. */
function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Project a word into a fixed-dimensional unit vector, deterministic per word. */
function wordToVector(word, dim) {
  const seed = hashString(word)
  const rand = mulberry32(seed)
  const vec = new Array(dim)
  let normSq = 0
  for (let i = 0; i < dim; i++) {
    const v = rand() * 2 - 1
    vec[i] = v
    normSq += v * v
  }
  const norm = Math.sqrt(normSq) || 1
  return vec.map((v) => v / norm)
}

/**
 * Generate a deterministic sequence of N (key, value) facts plus a probe
 * order for querying them back. `seed` controls both which words are
 * chosen and the numeric values assigned, so the same seed always
 * reproduces the same experiment.
 */
export function generateFacts(n, seed = 1) {
  const rand = mulberry32(seed * 7919 + 13)
  const words = [...VOCAB]
  // Fisher-Yates shuffle, seeded
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[words[i], words[j]] = [words[j], words[i]]
  }
  const chosen = words.slice(0, Math.min(n, words.length))

  // Nine fixed, well-separated one-hot-style value directions (one per
  // possible integer 1-9), shared across all facts. Encoding each value as
  // "which direction" rather than "what magnitude" survives softmax's
  // weighted averaging: the correct direction dominates whichever
  // component gets the highest attention weight, instead of being
  // squashed into an ambiguous vector norm.
  const valueDirections = Array.from({ length: 9 }, (_, i) =>
    wordToVector(`VALUE_SLOT_${i + 1}`, VALUE_DIM)
  )

  const facts = chosen.map((word, idx) => {
    const value = 1 + Math.floor(rand() * 9) // ground-truth integer, 1-9
    return {
      index: idx,
      key: word,
      value,
      keyVector: wordToVector(word, KEY_DIM),
      // Value vector = the fixed direction for this integer. Recall reads
      // out a vector and decodes it by nearest-direction match, which is
      // robust to the linear mixing both models perform.
      valueVector: valueDirections[value - 1],
    }
  })

  return facts
}

/** Shared value-direction table, exposed so decoders can match against it. */
export function valueDirectionTable() {
  return Array.from({ length: 9 }, (_, i) => wordToVector(`VALUE_SLOT_${i + 1}`, VALUE_DIM))
}

/** Deterministic probe order: query every fact once, in a seeded shuffle. */
export function generateProbeOrder(facts, seed = 1) {
  const rand = mulberry32(seed * 104729 + 3)
  const order = facts.map((f) => f.index)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

/**
 * Decode a model's output vector to the integer (1-9) whose fixed direction
 * it is most cosine-similar to. This is the readout used by both models —
 * neither gets special treatment — so any accuracy gap comes only from how
 * each model stores and retrieves the value, not from decoding rules.
 */
export function decodeValueVector(vec) {
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0))
  if (norm < 1e-6) return null
  const directions = valueDirectionTable()
  let best = null
  let bestScore = -Infinity
  for (let i = 0; i < directions.length; i++) {
    const dir = directions[i]
    let dotP = 0
    for (let d = 0; d < dir.length; d++) dotP += dir[d] * vec[d]
    const cosine = dotP / norm // dir is already unit-norm
    if (cosine > bestScore) {
      bestScore = cosine
      best = i + 1
    }
  }
  return best
}
