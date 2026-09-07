# Source and License Record

**StateLens — DataForge 2026, Pathway Track**

This file records every reused code library, font, and asset in the submission,
as required by the DataForge brief.

---

## JavaScript libraries

| Package | Version | License | Source |
|---|---|---|---|
| react | ^18 | MIT | https://github.com/facebook/react |
| react-dom | ^18 | MIT | https://github.com/facebook/react |
| react-router-dom | ^6 | MIT | https://github.com/remix-run/react-router |
| vite | ^5 | MIT | https://github.com/vitejs/vite |
| tailwindcss | ^3 | MIT | https://github.com/tailwindlabs/tailwindcss |
| framer-motion | ^11 | MIT | https://github.com/framer/motion |
| recharts | ^2 | MIT | https://github.com/recharts/recharts |
| lucide-react | ^0.383 | ISC | https://github.com/lucide-icons/lucide |
| firebase | ^10 | Apache 2.0 | https://github.com/firebase/firebase-js-sdk |
| postcss | ^8 | MIT | https://github.com/postcss/postcss |
| autoprefixer | ^10 | MIT | https://github.com/postcss/autoprefixer |

## Fonts

| Font | License | Source |
|---|---|---|
| Inter | SIL Open Font License 1.1 | https://github.com/rsms/inter |

## Icons and graphics

All icons are from **Lucide React** (ISC license, see above). No other proprietary
or commercial graphics are used. Architecture diagrams on /bdh-cq are rendered from
structured data using React/SVG and contain no third-party image assets.

## Data and model weights

No external model weights are loaded or bundled. All computation uses the toy
models in `src/models/`, written from scratch by the StateLens team. Published
evaluation numbers from Pathway's papers are stored as plain-text constants in
`src/data/citations.js` and `src/data/bdhResearch.js`; they are not model weights
or proprietary data.

## No copyrighted research paper content reproduced

All quotations from primary papers are kept to a minimum and used for identification
purposes only. Equations are reproduced as mathematical statements of fact, which
are not copyrightable.
