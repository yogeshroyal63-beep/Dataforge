import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-paper-line mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-base">StateLens</p>
          <p className="text-sm text-ink-faint mt-1 max-w-md">
            Built for DataForge 2026 — Pathway Track. Educational and
            research artifact, not an official Pathway product.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
          <Link to="/experiment" className="hover:text-ink">Experiment</Link>
          <Link to="/bdh-cq" className="hover:text-ink">BDH-CQ</Link>
          <Link to="/limitations" className="hover:text-ink">Limitations</Link>
          <Link to="/sources" className="hover:text-ink">Sources</Link>
          <a
            href="https://github.com/SowmispAd/DataForge"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            Source code
          </a>
        </div>
      </div>
    </footer>
  )
}
