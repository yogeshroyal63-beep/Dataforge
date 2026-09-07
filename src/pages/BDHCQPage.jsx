import Panel from '../components/common/Panel'
import Badge from '../components/common/Badge'
import { BDH_STAGES, BDH_CQ_FACTS, BDH_CQ_MEMORY_LINK, POST_TRANSFORMER_LANDSCAPE } from '../data/bdhResearch'
import { CITATIONS } from '../data/citations'

export default function BDHCQPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <p className="fig-caption mb-2">Part B — The required BDH module</p>
      <h1 className="font-serif text-3xl sm:text-4xl mb-6">
        Where this shows up in Pathway's own research
      </h1>

      <p className="text-ink-soft leading-relaxed max-w-prose mb-10">
        Dragon Hatchling (BDH) is Pathway's brain-inspired post-Transformer
        architecture. BDH-CQ is a newer system in the same family that
        learns from demonstrations shown to it at inference time, without
        updating its weights and without writing out a step-by-step
        reasoning trace in words.
      </p>

      <h2 className="font-serif text-xl mb-4">How BDH stores memory</h2>
      <div className="space-y-3 mb-12">
        {BDH_STAGES.map((stage) => (
          <Panel key={stage.id} title={stage.title}>
            <p className="text-sm text-ink-soft leading-relaxed">{stage.summary}</p>
            <SourceLine citationId={stage.citation} />
          </Panel>
        ))}
      </div>

      <h2 className="font-serif text-xl mb-4">The direct link to Part A</h2>
      <Panel badge={<Badge variant="published">Published research</Badge>} className="mb-12">
        <p className="text-ink-soft leading-relaxed mb-3">{BDH_CQ_MEMORY_LINK.headline}</p>
        {BDH_CQ_MEMORY_LINK.body.map((p, i) => (
          <p key={i} className="text-sm text-ink-soft leading-relaxed mb-3 last:mb-0">
            {p}
          </p>
        ))}
        <SourceLine citationId={BDH_CQ_MEMORY_LINK.citation} />
      </Panel>

      <h2 className="font-serif text-xl mb-4">BDH-CQ's published result</h2>
      <Panel badge={<Badge variant="published">Published research — not a StateLens result</Badge>} className="mb-12">
        <dl className="grid sm:grid-cols-2 gap-4 mb-4">
          <Fact label="Model size" value={BDH_CQ_FACTS.paramCount} />
          <Fact label="Benchmark" value={BDH_CQ_FACTS.benchmark} />
          <Fact label="Reported accuracy" value={BDH_CQ_FACTS.metric} />
          <Fact label="Reported cost" value={BDH_CQ_FACTS.cost} />
        </dl>
        <p className="text-sm text-ink-soft leading-relaxed mb-3">{BDH_CQ_FACTS.mechanism}</p>
        <p className="text-sm text-ink-soft leading-relaxed mb-3">{BDH_CQ_FACTS.noWeightUpdates}</p>
        <p className="text-sm text-ink-soft leading-relaxed">{BDH_CQ_FACTS.scalingNote}</p>
        <SourceLine citationId={BDH_CQ_FACTS.citation} />
      </Panel>

      <h2 className="font-serif text-xl mb-4">Where this sits in the landscape</h2>
      <div className="overflow-x-auto mb-12">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-paper-line text-left text-ink-faint">
              <th className="py-2 pr-4 font-medium">System</th>
              <th className="py-2 pr-4 font-medium">Memory</th>
              <th className="py-2 font-medium">Trade-off</th>
            </tr>
          </thead>
          <tbody>
            {POST_TRANSFORMER_LANDSCAPE.map((row) => (
              <tr key={row.name} className="border-b border-paper-line align-top">
                <td className="py-3 pr-4 font-medium">{row.name}</td>
                <td className="py-3 pr-4 text-ink-soft font-mono text-xs">{row.memory}</td>
                <td className="py-3 text-ink-soft">{row.tradeoff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Fact({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-ink-faint font-mono uppercase tracking-wide mb-1">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  )
}

function SourceLine({ citationId }) {
  const c = CITATIONS[citationId]
  if (!c) return null
  return (
    <p className="text-xs text-ink-faint mt-3 font-mono">
      Source:{' '}
      <a href={c.url} target="_blank" rel="noreferrer" className="underline hover:text-ink">
        {c.authors} ({c.year})
      </a>
    </p>
  )
}
