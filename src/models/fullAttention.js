/**
 * fullAttention.js
 *
 * Deterministic toy implementation of standard scaled dot-product attention
 * (Vaswani et al., 2017), used here purely as a recall mechanism: given all
 * past (key, value) pairs, answer a query by attending over every one of
 * them. This is the O(N) memory / O(N) per-query-compute baseline that
 * linear attention is designed to avoid.
 *
 *   score_i  = (q . k_i) / sqrt(d_k)
 *   weight   = softmax(score)_i
 *   output   = sum_i weight_i * v_i
 *
 * Because the model keeps every past key and value verbatim, recall
 * accuracy does not degrade as more facts are stored -- the only cost is
 * that the KV cache (and the per-query compute) grows linearly with the
 * number of facts. That growth is the trade-off this toy model exists to
 * make visible.
 */

import { KEY_DIM, SHARPNESS } from './toyEncoding'

function dot(a, b) {
  let s = 0
  for (let i = 0; i < a.length; i++) s += a[i] * b[i]
  return s
}

/**
 * Run full attention recall over `facts` (already seen, in order) for a
 * single query key vector. Returns the output vector plus a full trace of
 * scores and weights for inspection in the UI.
 */
export function fullAttentionRecall(facts, queryVector) {
  if (facts.length === 0) {
    return { output: null, trace: [], memoryCells: 0 }
  }

  // Standard 1/sqrt(d_k) scaling, adjusted by SHARPNESS — see toyEncoding.js
  // for why the toy key space needs this calibration, applied identically
  // to both models.
  const scale = Math.sqrt(KEY_DIM) / SHARPNESS
  const rawScores = facts.map((f) => dot(queryVector, f.keyVector) / scale)
  const maxScore = Math.max(...rawScores)
  const expScores = rawScores.map((s) => Math.exp(s - maxScore))
  const sumExp = expScores.reduce((a, b) => a + b, 0)
  const weights = expScores.map((e) => e / sumExp)

  const valueDim = facts[0].valueVector.length
  const output = new Array(valueDim).fill(0)
  for (let i = 0; i < facts.length; i++) {
    for (let d = 0; d < valueDim; d++) {
      output[d] += weights[i] * facts[i].valueVector[d]
    }
  }

  const trace = facts.map((f, i) => ({
    key: f.key,
    trueValue: f.value,
    rawScore: rawScores[i],
    weight: weights[i],
  }))

  return {
    output,
    trace,
    // Every fact's raw key and value vector is retained verbatim: this is
    // the O(N) memory footprint we display as "cache size" in the UI.
    memoryCells: facts.length * (KEY_DIM + valueDim),
  }
}

export const FULL_ATTENTION_META = {
  name: 'Full Attention',
  shortName: 'Full',
  complexity: 'O(N) memory, O(N) compute per query',
  description:
    'Compares the query against every stored key and mixes every stored value, weighted by similarity. Nothing is ever discarded.',
}

/**
 * Adapter used by experimentEngine.js: wraps fullAttentionRecall so callers
 * can pass (facts, queryFact) where queryFact has a .keyVector property.
 */
export async function runFullAttention(facts, queryFact) {
  const qVec = queryFact.keyVector
  if (!qVec) throw new Error('queryFact must have a keyVector property')
  return fullAttentionRecall(facts, qVec)
}
