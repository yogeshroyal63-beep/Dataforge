# StateLens — Linear Attention, Explained Through BDH-CQ

**DataForge 2026 · Pathway Track**

---

## One-sentence claim

> A linear-attention model can track information across a sequence using a fixed-size running state instead of storing every past token, but as more facts are packed into that fixed state, older facts increasingly interfere with and get overwritten by newer ones — a failure mode standard attention does not have.

---

## Intended learner and prerequisites

**Audience:** Machine-learning practitioners and students who have used a Transformer but have not read the linear-attention literature.

**Prerequisites:** Familiarity with attention as a weighted sum over key–value pairs. No GPU, no local install required — the entire experiment runs in the browser.

---

## Learning objectives

After completing the StateLens interactive experience a learner should be able to:

1. State the difference between full (softmax) attention and linear (kernelized) attention in terms of memory footprint.
2. Explain why the linear-attention recurrence (S_t = S_{t-1} + φ(k_t) v_tᵀ) compresses all past information into a fixed-size matrix.
3. Predict what happens to recall accuracy as the number of stored facts grows.
4. Identify state interference as a distinct failure mode from context-length truncation.
5. Connect BDH-CQ's contextual-memory mechanism to the same additive fixed-state view demonstrated in Part A.
6. Name at least one limitation of BDH-CQ that the BDH-CQ technical report itself documents.

---

## Artifact architecture

```
StateLens
├── Part A — Experiment (/)
│   └── Live toy comparison: full attention vs. linear attention on associative recall.
│       Slider controls N (number of facts). Charts update in real time.
│       All computation is client-side JS in src/models/.
│
├── Part B — BDH-CQ (/bdh-cq)
│   └── Mathematical bridge from linear-attention recurrence to BDH-CQ's
│       contextual memory. Published equations, architecture diagram, and
│       evaluation numbers from Pathway's own papers, clearly labeled.
│
├── Part C — Limitation (/limitation)
│   └── Concrete failure case: seed=5, N=14, query key="Mango".
│       Computed live. Named failure taxonomy: interference vs. truncation.
│       N=20 vocabulary cap disclosed explicitly.
│
└── Sources (/sources)
    └── Every primary source cited in the app, with the role each plays.
```

---

## What is live vs. precomputed vs. illustrative

| Component | Type | Where |
|---|---|---|
| Full attention toy model | **Live** (client-side JS) | `src/models/fullAttention.js` |
| Linear attention toy model | **Live** (client-side JS) | `src/models/linearAttention.js` |
| Fact generation (keys, values, embeddings) | **Live** — deterministic seeded PRNG | `src/models/toyEncoding.js` |
| Benchmark retention curve | **Live** — runs in browser on page load | `src/models/benchmark.js` |
| BDH / BDH-CQ equations and figures | **Precomputed / published** — Pathway's own papers | `src/data/bdhResearch.js` + `src/data/citations.js` |
| BDH-CQ evaluation numbers (29.5% pass@2, $0.0007/task) | **Published** — Engdahl et al. 2026 | `src/data/bdhResearch.js` |
| Architecture diagrams on /bdh-cq | **Illustrative** — rendered from structured data, not a live BDH checkpoint | `src/components/research/` |

No BDH or BDH-CQ checkpoint is run at any point. Any diagram or toy reimplementation is identified as such and never presented as official BDH model output.

---

## Model constraints (no hidden limits)

- **VOCAB** is capped at 20 words in `src/models/toyEncoding.js` (VOCAB.length = 20). N > 20 is not supported; sliders and the benchmark both respect this cap.
- **KEY_DIM = 16, VALUE_DIM = 10.** These dimensions are chosen to make interference visible at small N. They are not comparable to production model dimensions.
- **SHARPNESS = 12.** A calibration constant applied identically to both models so the random toy key space achieves reasonable separation. Disclosed in `toyEncoding.js` with the reasoning.
- **Values are integers 1–9.** Decoded by nearest cosine direction to one of nine fixed direction vectors. Both models use the same decoder — no model gets special treatment.

---

## Reproducing the results

### Retention curve (benchmark)

```bash
# No local run needed — the app recomputes this in the browser on every load.
# To verify locally:
node --input-type=module << 'EOF'
import { runFullBenchmark, summarizeBenchmark } from './src/models/benchmark.js'
const results = runFullBenchmark([1,2,3,4,5])
console.table(results)
console.log(summarizeBenchmark(results))
EOF
```

### Concrete failure case (Limitation page)

```bash
node --input-type=module << 'EOF'
import { generateFacts, decodeValueVector } from './src/models/toyEncoding.js'
import { fullAttentionRecall } from './src/models/fullAttention.js'
import { createEmptyState, updateState, readState } from './src/models/linearAttention.js'

const facts = generateFacts(14, 5)
const mango = facts.find(f => f.key === 'Mango')
const { output: fOut } = fullAttentionRecall(facts, mango.keyVector)
const state = createEmptyState()
facts.forEach(f => updateState(state, f))
const lOut = readState(state, mango.keyVector)
console.log('True:', mango.value, 'Full:', decodeValueVector(fOut), 'Linear:', decodeValueVector(lOut))
EOF
```

### Full app

```bash
npm install
npm run dev        # development server at http://localhost:5173
npm run build      # production build
```

---

## Primary sources

All technical claims are verified against these primary sources:

1. **Katharopoulos, Vyas, Pappas & Fleuret (2020).** "Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention." ICML 2020. arXiv:2006.16236. — Source of the exact recurrence StateLens implements.

2. **Yang, Wang, Shen, Panda & Kim (2023).** "Gated Linear Attention Transformers with Hardware-Efficient Training." arXiv:2312.06635. — Gated-decay extension; cited as the natural architectural fix for interference.

3. **Sun, Dong, Huang, Ma, Xia, Xue, Wang & Wei (2023).** "Retentive Network: A Successor to Transformer for Large Language Models." arXiv:2307.08621. — Fixed-decay linear-attention variant used as a comparison point.

4. **Kosowski, Uznański, Chorowski, Stamirowska & Bartoszkiewicz (2025).** "The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain." arXiv:2509.26507. — BDH base paper; source for the Hebbian synaptic memory framing.

5. **Engdahl, Kosowski, Chorowski, Stamirowska, Uznański, Jiang, Phadke, Kinas & Zhong (2026).** "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning." arXiv:2608.09888. — BDH-CQ technical report; primary source for the contextual-memory / fast-weight / linear-attention framing and the 29.5% ARC-AGI-1 result.

6. **Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser & Polosukhin (2017).** "Attention Is All You Need." NeurIPS 2017. arXiv:1706.03762. — Standard attention baseline.

---

## Credits and licenses

- **React** (MIT) — facebook/react
- **Vite** (MIT) — vitejs/vite
- **Tailwind CSS** (MIT) — tailwindlabs/tailwindcss
- **Framer Motion** (MIT) — framer/motion
- **Recharts** (MIT) — recharts/recharts
- **Lucide React** (ISC) — lucide-icons/lucide
- **Firebase** (Apache 2.0) — firebase/firebase-js-sdk
- **Inter font** (SIL OFL 1.1) — rsms/inter

All third-party code, data, weights, graphics, and fonts are used under their respective open-source licenses. No proprietary assets are included. A full source and license record is in `LICENSES.md`.

---

## AI-assistance disclosure

See `AI_DISCLOSURE.md` for a complete statement.

---

## Team

StateLens — DataForge 2026, Pathway Track.

---

## Deploying (bug 16 — required for submission)

The app needs a public URL that opens without sign-in. Two zero-config options:

### Option A — Vercel (recommended, 2 minutes)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `github.com/yogeshroyal63-beep/Dataforge`
3. Framework preset: **Vite** (auto-detected)
4. Add environment variables (Settings → Environment Variables):
   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   ```
   **If you skip these the app still works** — the public experiment, BDH-CQ, Limitation, and Sources pages all function without Firebase. Only the Researcher Workspace (Dashboard) requires it.
5. Click **Deploy**. Vercel assigns a `*.vercel.app` URL immediately.
6. Add that URL to this README under "Live URL" and to the submission form.

### Option B — Netlify (also zero-config)

1. Go to [app.netlify.com/start](https://app.netlify.com/start)
2. Connect `yogeshroyal63-beep/Dataforge`
3. Build command: `npm run build` | Publish directory: `dist`
4. Same env vars as above (optional for core functionality)
5. Click **Deploy site**

Both `vercel.json` (rewrites + cache headers) and `netlify.toml` (build config + redirects + cache headers) are already committed. No additional config needed.

---

## Live URL

> **TODO:** Replace this line with the deployed URL after completing the steps above, then push the update.
>
> Example: `https://statelens.vercel.app`

The submission form requires a public artifact URL that opens without sign-in.
