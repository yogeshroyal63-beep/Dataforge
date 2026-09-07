const VARIANTS = {
  live: 'bg-signal-goodSoft text-signal-good border-signal-good/30',
  toy: 'bg-linear-soft text-linear-deep border-linear-deep/30',
  published: 'bg-full-soft text-full-deep border-full-deep/30',
  illustrative: 'bg-paper-dim text-ink-soft border-ink-faint/30',
  neutral: 'bg-paper-dim text-ink-soft border-paper-line',
}

/**
 * A small inline label used everywhere the app needs to say plainly what
 * kind of content something is: live computation, a toy model, a
 * published research figure, or an illustrative simplification. This is
 * the mechanism behind the brief's "truth beside estimate" / honest
 * labeling requirement -- every figure and panel that could be mistaken
 * for something else carries one of these.
 */
export default function Badge({ variant = 'neutral', children }) {
  const cls = VARIANTS[variant] || VARIANTS.neutral
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[0.7rem] font-mono font-medium ${cls}`}
    >
      {children}
    </span>
  )
}
