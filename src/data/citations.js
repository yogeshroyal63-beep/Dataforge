/**
 * citations.js
 *
 * Every primary source cited in the app, in one place, so claims can be
 * traced back to a specific paper rather than a secondhand summary. Used
 * by the Sources page and inline citation links throughout.
 */

export const CITATIONS = {
  katharopoulos2020: {
    id: 'katharopoulos2020',
    authors: 'Katharopoulos, A., Vyas, A., Pappas, N., & Fleuret, F.',
    year: 2020,
    title:
      'Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention',
    venue: 'ICML 2020',
    url: 'https://arxiv.org/abs/2006.16236',
    role:
      'Source of the exact recurrence StateLens implements: S_t = S_{t-1} + phi(k_t)v_t^T, z_t = z_{t-1} + phi(k_t), y_t = phi(q_t)^T S_t / phi(q_t)^T z_t. This is the foundational reformulation of attention as a fixed-size recurrent state.',
  },
  yang2023gla: {
    id: 'yang2023gla',
    authors: 'Yang, S., Wang, B., Shen, Y., Panda, R., & Kim, Y.',
    year: 2023,
    title: 'Gated Linear Attention Transformers with Hardware-Efficient Training',
    venue: 'arXiv:2312.06635',
    url: 'https://arxiv.org/abs/2312.06635',
    role:
      'Extends the fixed-state recurrence with a data-dependent forget gate (S_t = G_t ⊙ S_{t-1} + k_t^T v_t), letting the state selectively decay instead of only accumulating. Cited on the Comparing Linear Attention Variants page as the natural fix for the interference StateLens demonstrates.',
  },
  sun2023retnet: {
    id: 'sun2023retnet',
    authors: 'Sun, Y., Dong, L., Huang, S., Ma, S., Xia, Y., Xue, J., Wang, J., & Wei, F.',
    year: 2023,
    title: 'Retentive Network: A Successor to Transformer for Large Language Models',
    venue: 'arXiv:2307.08621',
    url: 'https://arxiv.org/abs/2307.08621',
    role:
      'A second concrete fixed-decay variant of the same recurrent-state family, used as a comparison point for how different architectures trade off recall fidelity against fixed memory.',
  },
  wright2025bdh: {
    id: 'wright2025bdh',
    authors:
      'Pathway Research (Chorowski, J., Stamirowska, Z., Uznański, P., et al.)',
    year: 2025,
    title:
      'The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain',
    venue: 'arXiv:2509.26507',
    url: 'https://arxiv.org/abs/2509.26507',
    role:
      "The base BDH paper. Source for BDH's Hebbian working-memory mechanism, sparse-positive activations, monosemantic synapses, and scale-free neuron connectivity. Primary source for the BDH module's synaptic-memory framing.",
  },
  engdahl2026bdhcq: {
    id: 'engdahl2026bdhcq',
    authors:
      'Engdahl, B., Kosowski, A., Chorowski, J., Stamirowska, Z., Uznański, P., Jiang, J., Phadke, R., Kinas, R., & Zhong, R.',
    year: 2026,
    title: 'BDH-CQ: In-Context Learning with Recurrent Latent Reasoning',
    venue: 'arXiv:2608.09888',
    url: 'https://arxiv.org/abs/2608.09888',
    role:
      "The BDH-CQ technical report. Primary source for the contextual-memory / fast-weight / linear-attention framing StateLens' BDH-CQ module draws its direct parallel from, and for the published 150M-parameter, 29.5% pass@2, $0.0007/task ARC-AGI-1 result.",
  },
  vaswani2017: {
    id: 'vaswani2017',
    authors: 'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I.',
    year: 2017,
    title: 'Attention Is All You Need',
    venue: 'NeurIPS 2017',
    url: 'https://arxiv.org/abs/1706.03762',
    role:
      'Source of the standard scaled dot-product attention formula StateLens implements as the "Full Attention" baseline model.',
  },
}

export const PRIMARY_PAPERS_2022_2026 = [
  CITATIONS.yang2023gla,
  CITATIONS.sun2023retnet,
  CITATIONS.wright2025bdh,
  CITATIONS.engdahl2026bdhcq,
]
