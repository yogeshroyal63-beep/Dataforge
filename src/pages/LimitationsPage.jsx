import Panel from '../components/common/Panel'
import Badge from '../components/common/Badge'
import { BDH_LIMITATIONS } from '../data/bdhResearch'

export default function LimitationsPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <p className="fig-caption mb-2">Part C — Named out loud</p>
      <h1 className="font-serif text-3xl sm:text-4xl mb-6">
        The failure that doesn't announce itself
      </h1>
      <p className="text-ink-soft leading-relaxed max-w-prose mb-10">
        A linear-attention model doesn't crash or truncate when its fixed
        state is full. It keeps answering — confidently, in the same format
        as always — it just starts getting the answer wrong, with nothing on
        screen to tell you that happened. That silent failure mode is the
        single most important thing to walk away from this project
        understanding.
      </p>

      <div className="space-y-4">
        {BDH_LIMITATIONS.map((item) => (
          <Panel key={item.title} title={item.title} badge={<Badge variant="neutral">Limitation</Badge>}>
            <p className="text-sm text-ink-soft leading-relaxed">{item.body}</p>
          </Panel>
        ))}
      </div>
    </div>
  )
}
