import { CITATIONS } from '../data/citations'

export default function SourcesPage() {
  const list = Object.values(CITATIONS)
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <p className="fig-caption mb-2">Primary sources</p>
      <h1 className="font-serif text-3xl sm:text-4xl mb-6">Sources</h1>
      <p className="text-ink-soft leading-relaxed mb-10">
        Every technical claim in this app traces back to one of these
        primary sources, not a secondhand summary. Each entry below states
        what role that source plays in StateLens specifically.
      </p>

      <ol className="space-y-6">
        {list.map((c) => (
          <li key={c.id} className="border-b border-paper-line pb-6 last:border-0">
            <p className="font-medium">
              {c.authors} ({c.year}).{' '}
              <a href={c.url} target="_blank" rel="noreferrer" className="underline hover:text-full">
                {c.title}
              </a>
              . <span className="text-ink-faint">{c.venue}</span>
            </p>
            <p className="text-sm text-ink-soft mt-2 leading-relaxed">{c.role}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
