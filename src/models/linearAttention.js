/**
 * linearAttention.js
 *
 * Deterministic toy implementation of linear attention as a fixed-size
 * recurrent state, following the reformulation in:
 *
 *   Katharopoulos, A., Vyas, A., Pappas, N., & Fleuret, F. (2020).
 *   "Transformers are RNNs: Fast Autoregressive Transformers with Linear
 *   Attention." ICML 2020. arXiv:2006.16236.
 *
 * The recurrence (their Eq. 5, using phi as a positive feature map):
 *
 *   S_0 = 0,  z_0 = 0
 *   S_t = S_{t-1} + phi(k_t) (v_t)^T        <-- outer product, additive
 *   z_t = z_{t-1} + phi(k_t)
 *   y_t = (phi(q_t)^T S_t) / (phi(q_t)^T z_t)
 *
 * S_t is a fixed-size (KEY_DIM x VALUE_DIM) matrix -- it never grows with
 * sequence length, unlike full attention's per-token cache. Every new fact
 * is folded additively into the *same* memory slots. This is exactly the
 * mechanism the brief's "Linear Attention" and "Associative Memory and Fast
 * Weights" topics describe, and it is the same additive fixed-state view
 * that BDH-CQ's own technical report uses for its contextual memory (see
 * the BDH-CQ module elsewhere in this app).
 *
 * The feature map phi we use is elu(x) + 1, a standard non-negative
 * feature map choice for linear attention (kept simple and fixed here,
 * unlike gated variants such as GLA -- see the Comparing Linear Attention
 * Variants page for that distinction).
 */

import { KEY_DIM, VALUE_DIM, SHARPNESS } from './toyEncoding'

function elu(x, alpha = 1.0) {
  return x >= 0 ? x : alpha * (Math.exp(x) - 1)
}

/**
 * Positive feature map phi(x) = ELU(SHARPNESS * x) + 1, applied elementwise.
 * The SHARPNESS scaling is the same constant, applied the same way, as in
 * fullAttention.js — see toyEncoding.js for why. Without it, the toy key
 * space is too weakly separated for either model to discriminate facts
 * reliably; with it, both models get a fair, equally-sharpened similarity
 * signal, and the accuracy gap that remains is attributable to the fixed-
 * size state itself, not to feature-map tuning.
 */
function phi(vec) {
  return vec.map((x) => elu(x * SHARPNESS) + 1)
}

function outerAdd(S, a, b) {
  // S += a (KEY_DIM) outer b (VALUE_DIM)^T, in place
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      S[i][j] += a[i] * b[j]
    }
  }
}

function vecAdd(z, a) {
  for (let i = 0; i < a.length; i++) z[i] += a[i]
}

function zeros2D(rows, cols) {
  return Array.from({ length: rows }, () => new Array(cols).fill(0))
}

/**
 * Fold one (key, value) fact into a running linear-attention state.
 * `state` is mutated in place and also returned for convenience.
 */
export function updateState(state, fact) {
  const kFeat = phi(fact.keyVector)
  outerAdd(state.S, kFeat, fact.valueVector)
  vecAdd(state.z, kFeat)
  state.factsSeen += 1
  return state
}

export function createEmptyState() {
  return {
    S: zeros2D(KEY_DIM, VALUE_DIM),
    z: new Array(KEY_DIM).fill(0),
    factsSeen: 0,
  }
}

/**
 * Read out a query against the current fixed-size state:
 *   y = (phi(q)^T S) / (phi(q)^T z)
 * This is a single O(1)-in-sequence-length read: it never touches the raw
 * history, only the running (KEY_DIM x VALUE_DIM) matrix and (KEY_DIM)
 * normalizer -- the entire point of the recurrent formulation.
 */
export function readState(state, queryVector) {
  const qFeat = phi(queryVector)
  const numerator = new Array(VALUE_DIM).fill(0)
  for (let j = 0; j < VALUE_DIM; j++) {
    let acc = 0
    for (let i = 0; i < KEY_DIM; i++) acc += qFeat[i] * state.S[i][j]
    numerator[j] = acc
  }
  let denom = 0
  for (let i = 0; i < KEY_DIM; i++) denom += qFeat[i] * state.z[i]
  if (denom < 1e-8) return new Array(VALUE_DIM).fill(0)
  return numerator.map((v) => v / denom)
}

/**
 * Build the running state by folding in `facts` one at a time (in order),
 * then read out `queryVector`. Also returns a per-step trace of state
 * "energy" (Frobenius norm of S) so the UI can visualize accumulation and
 * interference growing as more facts are packed in.
 */
export function linearAttentionRecall(facts, queryVector) {
  const state = createEmptyState()
  const trace = []
  for (const fact of facts) {
    updateState(state, fact)
    let energy = 0
    for (let i = 0; i < KEY_DIM; i++)
      for (let j = 0; j < VALUE_DIM; j++) energy += state.S[i][j] ** 2
    trace.push({ key: fact.key, trueValue: fact.value, stateEnergy: Math.sqrt(energy) })
  }
  const output = facts.length > 0 ? readState(state, queryVector) : null

  return {
    output,
    trace,
    state,
    // Fixed-size regardless of how many facts were folded in -- this is
    // the O(1) memory footprint we contrast with full attention's O(N).
    memoryCells: KEY_DIM * VALUE_DIM + KEY_DIM,
  }
}

export const LINEAR_ATTENTION_META = {
  name: 'Linear Attention',
  shortName: 'Linear',
  complexity: 'O(1) memory, O(1) compute per query',
  description:
    'Compresses every fact seen so far into one fixed-size running state, updated additively. Nothing is stored individually -- only the accumulated sum.',
}

/**
 * Adapter used by experimentEngine.js: wraps linearAttentionRecall so callers
 * can pass (facts, queryFact) where queryFact has a .keyVector property.
 */
export async function runLinearAttention(facts, queryFact) {
  const qVec = queryFact.keyVector
  if (!qVec) throw new Error('queryFact must have a keyVector property')
  return linearAttentionRecall(facts, qVec)
}
