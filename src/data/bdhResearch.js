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

import { CITATIONS } from './citations.js'

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

/**
 * BDH_ARCHITECTURE_STAGES
 *
 * The 5 stages rendered by BDHArchitectureDiagram.jsx. Each stage traces to
 * a specific mechanism named in the Dragon Hatchling paper (wright2025bdh),
 * cited inline so the "which equation/diagram" question always has a
 * concrete answer during a live defense, not just a general reference to
 * "the BDH paper."
 */
export const BDH_ARCHITECTURE_STAGES = [
  {
    id: 'graph-substrate',
    shortTitle: 'Neuron-Synapse Graph',
    label: 'Stage 1 — Local Graph Substrate',
    summary:
      'BDH is defined as n locally-interacting neuron particles on a scale-free graph, not as a stack of matrix layers.',
    details:
      "The Dragon Hatchling paper's 'equations of reasoning' (Section 2) define BDH as a local edge-reweighting process: each neuron only reads its graph neighbors, so there is no global attention matrix to compute at this stage. This is the structural precondition every later stage builds on.",
  },
  {
    id: 'hebbian-write',
    shortTitle: 'Hebbian Write',
    label: 'Stage 2 — Hebbian Synaptic Update',
    summary:
      'Connections between co-active neurons strengthen as the model reads -- working memory is a write to synaptic weight, not to a separate cache.',
    details:
      "The paper frames this as modus-ponens-style inference fused with Hebbian learning: a belief in fact i contributes to a belief in fact j in proportion to the connection strength between them, and that strength is itself updated by co-activation while reading. This is the same 'update in place, no growing list' shape that StateLens' S_t = S_{t-1} + phi(k_t)v_t^T recurrence demonstrates in Part A, at a much smaller scale.",
  },
  {
    id: 'sparse-activation',
    shortTitle: 'Sparse Synaptic State',
    label: 'Stage 3 — Sparse, Non-Negative Activations',
    summary:
      'Only a small, input-dependent fraction of neurons are active at any moment, and activity is always non-negative.',
    details:
      'In reported BDH runs, roughly 5% of neurons are active at a given step -- this is not a fixed sparsity budget enforced by a top-k rule, but an emergent property that varies with how predictable the current input is. Because the synaptic state carries the memory (Stage 2), this sparsity keeps that memory sparse and interpretable rather than dense and opaque.',
  },
  {
    id: 'monosemantic',
    shortTitle: 'Monosemantic Synapses',
    label: 'Stage 4 — Monosemantic Synapses',
    summary:
      'Individual synapses are reported to respond to one recognizable concept, rather than mixing many unrelated ideas into the same connection.',
    details:
      'This is the interpretability payoff of Stages 1-3: because memory lives in sparse, locally-updated synaptic weights rather than a dense matrix mixed by softmax, individual connections can be inspected and are reported to encode identifiable semantic concepts, not just abstract token statistics.',
  },
  {
    id: 'gpu-linear-attention',
    shortTitle: 'BDH-GPU Formulation',
    label: 'Stage 5 — GPU-Friendly Reformulation (BDH-GPU)',
    summary:
      'BDH also admits a GPU-friendly formulation, built from ReLU-low-rank transformations with linear attention -- distinct from an SSM in the Mamba sense.',
    details:
      "This is the stage that connects back to StateLens' Part A most directly: BDH-GPU's linear-attention view is a concrete instance of the same fixed-state-instead-of-growing-cache trade-off the toy recall experiment demonstrates. The brief is explicit that BDH should not be classified as a Mamba-style SSM; BDH-GPU is a separate, purpose-built reformulation for hardware efficiency.",
  },
]

/**
 * TOY_VS_RESEARCH_SLIDER_STEPS
 *
 * The 4 steps rendered by ResearchBridge.jsx. Numbers for "StateLens Toy"
 * and "Linear Attn" are the actual constants/measurements this app computes
 * (see toyEncoding.js, benchmark.js) -- not invented figures. "BDH Synaptic"
 * and "BDH-CQ Latent" figures are Pathway's own published numbers, cited via
 * bdh / bdhcq entries in CITATIONS and never presented as StateLens output.
 */
export const TOY_VS_RESEARCH_SLIDER_STEPS = [
  {
    title: 'StateLens Toy Recall Task',
    purpose: 'Educational substrate',
    stateSize: 'S ∈ ℝ^(16×10), fixed regardless of N',
    featureSpace: 'phi(x) = ELU(12·x) + 1, 16-dim random keys',
    valueSpace: '9 fixed one-hot-style directions (integers 1-9)',
    reasoning: 'Single linear readout: y = phi(q)ᵀS / phi(q)ᵀz',
  },
  {
    title: 'Linear Attention (Katharopoulos et al., 2020)',
    purpose: 'Foundational mechanism',
    stateSize: 'S_t ∈ ℝ^(d_k×d_v), fixed-size recurrent state',
    featureSpace: 'Learned positive feature map phi(x), trained end-to-end',
    valueSpace: 'Dense value vectors from a trained embedding table',
    reasoning: 'Same additive recurrence StateLens implements, at production scale',
  },
  {
    title: 'BDH Synaptic Memory',
    purpose: 'Brain-inspired reformulation',
    stateSize: 'Sparse, scale-free synaptic graph (n neuron particles)',
    featureSpace: 'Sparse, non-negative activations (~5% active per step)',
    valueSpace: 'Monosemantic synapses -- one concept per connection (reported)',
    reasoning: 'Hebbian edge-reweighting: local, no global attention matrix',
  },
  {
    title: 'BDH-CQ Recurrent Latent Reasoning',
    purpose: 'In-context adaptation at inference',
    stateSize: 'High-dimensional latent workspace, updated per demonstration',
    featureSpace: 'Trained 150M-parameter configuration (published)',
    valueSpace: 'ARC-AGI-1 grids, decoded only at the final latent step',
    reasoning: 'Iterative latent computation, no verbalized chain-of-thought',
  },
]

/**
 * RESEARCH_FINDINGS_DATA / TOY_EXPERIMENT_DATA
 *
 * Rendered side-by-side by ResearchFindings.jsx specifically to prevent
 * toy-vs-published-number confusion. TOY_EXPERIMENT_DATA's accuracy figures
 * are computed by this repo's own benchmark.js (runFullBenchmark, seeds
 * 1-5, N=2..20) -- see README "Verifying the core claim yourself" for how
 * to reproduce them. RESEARCH_FINDINGS_DATA figures are Pathway's own
 * published numbers and are never generated by this app.
 */
export const RESEARCH_FINDINGS_DATA = {
  modelName: 'BDH-CQ (Pathway Research)',
  parameterCount: '150M parameters',
  reportedScore: '29.5% pass@2 (ARC-AGI-1)',
  reportedCost: '$0.0007 / task',
  attribution:
    'Engdahl, Kosowski, Chorowski, Stamirowska, Uznański, Jiang, Phadke, Kinas & Zhong (2026), "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning," arXiv:2608.09888. Published by Pathway Research -- never reproduced or re-measured by StateLens.',
}

export const TOY_EXPERIMENT_DATA = {
  modelName: 'StateLens Toy Recall Benchmark',
  attribution:
    'Computed live, client-side, by this repo\u0027s own src/models/benchmark.js -- runFullBenchmark() across N=2..20 facts, 5 seeds per condition. Reproducible by running npm run build or inspecting the source directly. Not a published research result and not comparable in scale to BDH-CQ\u0027s figures.',
}

/**
 * PRIMARY_SOURCES
 *
 * Rendered by ResearchSources.jsx as the "Primary Research Literature"
 * panel on the /bdh-cq page. Built directly from CITATIONS in citations.js
 * so this list can never drift out of sync with the sourcing already
 * verified there -- one edit to citations.js updates both places.
 */
export const PRIMARY_SOURCES = [
  {
    id: CITATIONS.wright2025bdh.id,
    organization: 'Pathway Research',
    date: String(CITATIONS.wright2025bdh.year),
    title: CITATIONS.wright2025bdh.title,
    description: CITATIONS.wright2025bdh.role,
    url: CITATIONS.wright2025bdh.url,
  },
  {
    id: CITATIONS.engdahl2026bdhcq.id,
    organization: 'Pathway Research',
    date: String(CITATIONS.engdahl2026bdhcq.year),
    title: CITATIONS.engdahl2026bdhcq.title,
    description: CITATIONS.engdahl2026bdhcq.role,
    url: CITATIONS.engdahl2026bdhcq.url,
  },
  {
    id: CITATIONS.katharopoulos2020.id,
    organization: `${CITATIONS.katharopoulos2020.venue}`,
    date: String(CITATIONS.katharopoulos2020.year),
    title: CITATIONS.katharopoulos2020.title,
    description: CITATIONS.katharopoulos2020.role,
    url: CITATIONS.katharopoulos2020.url,
  },
  {
    id: CITATIONS.yang2023gla.id,
    organization: 'arXiv',
    date: String(CITATIONS.yang2023gla.year),
    title: CITATIONS.yang2023gla.title,
    description: CITATIONS.yang2023gla.role,
    url: CITATIONS.yang2023gla.url,
  },
  {
    id: CITATIONS.sun2023retnet.id,
    organization: 'arXiv',
    date: String(CITATIONS.sun2023retnet.year),
    title: CITATIONS.sun2023retnet.title,
    description: CITATIONS.sun2023retnet.role,
    url: CITATIONS.sun2023retnet.url,
  },
  {
    id: CITATIONS.vaswani2017.id,
    organization: CITATIONS.vaswani2017.venue,
    date: String(CITATIONS.vaswani2017.year),
    title: CITATIONS.vaswani2017.title,
    description: CITATIONS.vaswani2017.role,
    url: CITATIONS.vaswani2017.url,
  },
]
