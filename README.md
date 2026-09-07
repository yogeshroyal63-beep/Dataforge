# StateLens

> See how memory changes attention. Linear Attention, Explained Through BDH-CQ.

Built for **DataForge 2026 — Pathway Track**.

## Status: work in progress

This zip is a **checkpoint**, not the final submission package. What's here:

- Core math verified correct: real scaled dot-product attention (`src/models/fullAttention.js`) and a real fixed-state linear-attention recurrence matching Katharopoulos et al. (2020) exactly (`src/models/linearAttention.js`), computed live — no precomputed lookup tables standing in for the model.
- Interactive recall lab (`/experiment`) — the required interactive substrate. Slider controls sequence length, both models recompute instantly, live retention chart across N=2..20.
- BDH-CQ research module (`/bdh-cq`) — sourced from Pathway's actual papers (see `src/data/citations.js` and `src/data/bdhResearch.js`).
- Limitations page (`/limitations`) — Part C of the brief's required mission.
- Sources page (`/sources`) — every primary citation used in the app.
- Firebase auth + minimal researcher dashboard, kept fully optional — **the core experience above requires no sign-in.**
- Production build verified (`npm run build` succeeds).

## Still needed before this is submission-ready

- [ ] Polish pass on Experiment page visuals (attention-weight visualization, state heatmap)
- [ ] Expand landing page hero section
- [ ] One-page concept summary (500-950 word PDF) — required submission artifact, not yet drafted
- [ ] AI-assistance disclosure section in README
- [ ] Full README per the brief's checklist (claim, audience, prerequisites, learning objectives, what's live/precomputed, reproduction steps, credits/licenses)
- [ ] At least 3 primary papers (2022-2026) cited beside specific technical claims in a narrative write-up/blog PDF (citations already exist in code; blog PDF not yet written)
- [ ] Accessibility pass (keyboard nav, ARIA labels, reduced-motion) beyond Tailwind defaults
- [ ] Deploy to a public URL

## Running locally

```
npm install
cp .env.example .env.local   # optional — only needed for sign-in to work
npm run dev
```

Open `http://localhost:5173`. Firebase credentials are optional; without them the app runs fully, just without account sign-in.

## Verifying the core claim yourself

```
npm run build
```

Or inspect `src/models/benchmark.js` — `runFullBenchmark()` returns the exact accuracy-vs-N data shown in the retention chart, computed fresh every time.
