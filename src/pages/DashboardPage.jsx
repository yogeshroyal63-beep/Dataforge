import { useAuth } from '../context/AuthContext'
import Panel from '../components/common/Panel'
import { runFullBenchmark, summarizeBenchmark } from '../models/benchmark'

const DATA = runFullBenchmark([1, 2, 3, 4, 5])
const SUMMARY = summarizeBenchmark(DATA)

export default function DashboardPage() {
  const { user, signOut } = useAuth()

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="fig-caption mb-1">Researcher workspace</p>
          <h1 className="font-serif text-2xl">
            {user?.email ? `Signed in as ${user.email}` : 'Local session'}
          </h1>
        </div>
        {user && (
          <button onClick={signOut} className="text-sm text-ink-faint underline">
            Sign out
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Metric label="Conditions run" value={SUMMARY.totalConditions} />
        <Metric label="Total queries" value={SUMMARY.totalQueries} />
        <Metric label="Crossover point" value={`N ≈ ${SUMMARY.crossoverN}`} />
      </div>

      <Panel title="Mean accuracy this session">
        <div className="flex gap-8">
          <div>
            <p className="text-xs text-ink-faint font-mono uppercase mb-1">Full Attention</p>
            <p className="text-2xl font-mono text-full-deep">
              {(SUMMARY.meanFullAccuracy * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-faint font-mono uppercase mb-1">Linear Attention</p>
            <p className="text-2xl font-mono text-linear-deep">
              {(SUMMARY.meanLinearAccuracy * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Panel>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="panel p-4">
      <p className="text-xs text-ink-faint font-mono uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xl font-mono">{value}</p>
    </div>
  )
}
