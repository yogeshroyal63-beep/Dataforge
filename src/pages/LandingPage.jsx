import { Link } from 'react-router-dom'
import Badge from '../components/common/Badge'

export default function LandingPage() {
  return (
    <div>
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-14">
        <p className="fig-caption mb-3">DataForge 2026 — Pathway Track</p>
        <h1 className="font-serif text-4xl sm:text-5xl leading-[1.1] max-w-2xl mb-6">
          See how memory changes attention.
        </h1>
        <p className="text-lg text-ink-soft max-w-prose leading-relaxed mb-8">
          Standard attention keeps every word it has ever seen. Linear
          attention keeps a single fixed-size notepad instead — fast and
          cheap, but it can forget. StateLens makes that trade-off something
          you can watch happen, then connects it to Pathway's own BDH-CQ
          research.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/experiment" className="px-5 py-3 bg-ink text-paper rounded-sm text-sm font-medium">
            Run the experiment
          </Link>
          <Link to="/bdh-cq" className="px-5 py-3 border border-ink/25 rounded-sm text-sm font-medium">
            Read the BDH-CQ module
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid sm:grid-cols-3 gap-5">
          <ClaimCard
            badge={<Badge variant="live">Live</Badge>}
            title="One claim"
            body='A fixed-size state forgets under load. Full attention doesn\u2019t — at the cost of memory that keeps growing.'
          />
          <ClaimCard
            badge={<Badge variant="toy">Toy, honestly labeled</Badge>}
            title="One substrate"
            body="Both attention mechanisms run as real math in your browser on a tiny synthetic recall task — not a scripted animation."
          />
          <ClaimCard
            badge={<Badge variant="published">Published research</Badge>}
            title="One bridge"
            body="The same fixed-state trade-off shows up, at enormous scale, in Pathway's BDH-CQ technical report."
          />
        </div>
      </section>
    </div>
  )
}

function ClaimCard({ badge, title, body }) {
  return (
    <div className="panel p-5">
      <div className="mb-3">{badge}</div>
      <h3 className="font-serif text-lg mb-2">{title}</h3>
      <p className="text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  )
}
