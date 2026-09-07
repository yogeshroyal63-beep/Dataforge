/**
 * bdhResearch.js
 *
 * Structured content for the BDH / BDH-CQ research module. Every numeric
 * claim here traces to CITATIONS in citations.js. Nothing here is a
 * StateLens-computed result -- these are Pathway's own published figures,
 * kept in their own file and clearly labeled wherever they are rendered so
 * they are never confused with the toy benchmark numbers computed live in
 * src/models/.
 */

export const BDH_STAGES = [
  {
    id: 'neurons',
    title: 'Local neuron-synapse dynamics',
    summary:
      'BDH is built from locally interacting, spiking (integrate-and-fire) neuron units arranged in a scale-free graph. Each unit only sees its neighbors -- there is no global attention matrix to compute.',
    citation: 'wright2025bdh',
  },
  {
    id: 'hebbian',
    title: 'Hebbian synaptic memory',
    summary:
      "Working memory during inference lives entirely in synaptic strength, not in a separate cache. Connections between neurons that fire together strengthen -- 'neurons that fire together, wire together' -- which is how BDH keeps track of what it has just read.",
    citation: 'wright2025bdh',
  },
  {
    id: 'sparsity',
    title: 'Sparse, positive activations',
    summary:
      'Activation vectors in BDH are sparse and non-negative. In reported BDH runs, activity is not fixed to a rigid sparsity budget -- roughly 5% of neurons are typically active, and how many fire varies with how predictable the input is.',
    citation: 'wright2025bdh',
  },
  {
    id: 'monosemantic',
    title: 'Monosemantic synapses',
    summary:
      'Individual synapses in BDH have been shown to respond selectively to a single recognizable concept, rather than firing indiscriminately across many unrelated topics -- a form of interpretability that emerges from training rather than being imposed on it.',
    citation: 'wright2025bdh',
  },
  {
    id: 'attention-as-synapse',
    title: 'Attention reformulated as synaptic memory',
    summary:
      "BDH-GPU, the GPU-friendly formulation, shows that attention-like computation can emerge from neuron-level Hebbian updates rather than being a separate architectural module bolted onto a sequence model. This is the bridge the brief's 'Synaptic Plasticity as Short-Term Memory' topic describes.",
    citation: 'wright2025bdh',
  },
]

export const BDH_CQ_FACTS = {
  paramCount: '150M parameters',
  benchmark: 'ARC-AGI-1 (public evaluation set)',
  metric: '29.5% pass@2',
  cost: '$0.00070 per task (computed, ~0.85s of H200 time per puzzle)',
  claim:
    'This operating point was reported to break through the previously published ARC-AGI-1 cost-accuracy Pareto frontier -- more accuracy per dollar than prior systems at comparable or lower cost.',
  mechanism:
    'Demonstrations of a previously unseen task update a recurrent memory. The query is then solved through iterative computation in a high-dimensional latent workspace. Intermediate reasoning states are never decoded into language -- there is no written chain of thought.',
  noWeightUpdates:
    'No parameters are updated at inference time, and evaluation-task demonstrations never participate in training. Adaptation to a new task happens entirely in recurrent state, not in weights -- the same kind of state StateLens visualizes in Part A, just at a vastly larger and more capable scale.',
  scalingNote:
    'Early pretraining-scaling experiments reportedly span 1B to 600B parameters, with the architecture showing Transformer-like scaling behavior while preserving BDH-CQ-style recurrent latent reasoning.',
  citation: 'engdahl2026bdhcq',
}

export const BDH_CQ_MEMORY_LINK = {
  headline:
    "BDH-CQ's own technical report frames its contextual memory using the same additive, fixed-state view StateLens demonstrates in Part A.",
  body: [
    "BDH-CQ's memory mechanism is described in terms of fast-weight and linear-attention views of contextual association: information from each demonstration accumulates into a persistent state, rather than being stored as a growing list of past tokens.",
    'The special case relevant here is state that accumulates additively per demonstration -- structurally the same operation as the S_t = S_{t-1} + phi(k_t)v_t^T update StateLens runs live in the browser, just operating over a much higher-dimensional latent workspace and trained end-to-end rather than fixed and random.',
    'This is not a claim that BDH-CQ is "the same as" the toy model. It is a claim that both systems face the same fundamental trade-off: a fixed-size state is cheap to update and query, but has finite capacity to hold distinct facts without them interfering with one another.',
  ],
  citation: 'engdahl2026bdhcq',
}

export const BDH_LIMITATIONS = [
  {
    title: 'State interference is not context-length truncation',
    body:
      "A linear-attention-style model does not error out or truncate when its fixed state is full. It silently degrades -- producing a confident, well-formed, but wrong answer, with no signal to the user that anything went wrong. This is the specific failure mode StateLens' Part C names explicitly, and it is a property of any additive fixed-state memory, including the mechanism BDH-CQ's report describes for its own contextual memory.",
  },
  {
    title: 'Toy scale vs. published scale',
    body:
      "StateLens' toy models operate on an 8-fact vocabulary with 16-dimensional random keys -- nowhere near BDH-CQ's 150M-parameter, trained, high-dimensional latent workspace. The interference pattern is structurally the same phenomenon, but the toy numbers (StateLens' own ~34% floor at N=20) and BDH-CQ's published 29.5% pass@2 are not comparable figures and must never be presented as if they were.",
  },
  {
    title: "BDH-CQ's own limitations",
    body:
      "BDH-CQ's report documents its own failure modes on controlled ARC-like interventions, including a reported complete failure (0 of 72) on a color-swap composition task, pointing to an object-property binding limitation. Independent commentary has also noted that some core architectural and training details in the report are not fully disclosed, which limits independent reproducibility.",
  },
]

export const POST_TRANSFORMER_LANDSCAPE = [
  {
    name: 'Standard Transformer',
    family: 'Full attention',
    memory: 'O(N), grows with sequence length',
    tradeoff: 'Exact recall of every past token; quadratic compute in sequence length.',
  },
  {
    name: 'Linear Transformer (Katharopoulos et al., 2020)',
    family: 'Fixed-state linear attention',
    memory: 'O(1), fixed-size recurrent state',
    tradeoff: 'Constant memory and linear-time inference; recall degrades as more facts are packed into a fixed state.',
  },
  {
    name: 'Gated Linear Attention (Yang et al., 2023) / RetNet (Sun et al., 2023)',
    family: 'Fixed-state with decay gating',
    memory: 'O(1), fixed-size, gated',
    tradeoff: 'Adds a forget gate so the state can selectively decay old information instead of only accumulating -- reduces, but does not eliminate, interference under high fact density.',
  },
  {
    name: 'BDH / BDH-CQ (Pathway Research)',
    family: 'Brain-inspired post-Transformer',
    memory: 'Distributed across sparse, Hebbian synaptic state',
    tradeoff: 'Interpretable, sparse, biologically grounded; BDH-CQ additionally supports in-context adaptation via recurrent latent reasoning without weight updates.',
  },
]
