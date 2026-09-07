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
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft" aria-label="Footer navigation">
          <Link to="/experiment" className="hover:text-ink focus-visible:underline">Experiment</Link>
          <Link to="/bdh-cq"    className="hover:text-ink focus-visible:underline">BDH-CQ</Link>
          <Link to="/limitation" className="hover:text-ink focus-visible:underline">Limitation</Link>
          <Link to="/sources"   className="hover:text-ink focus-visible:underline">Sources</Link>
          <a
            href="https://github.com/yogeshroyal63-beep/Dataforge"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink focus-visible:underline"
          >
            Source code<span className="sr-only"> (opens in new tab)</span>
          </a>
        </nav>
      </div>
    </footer>
  )
}
