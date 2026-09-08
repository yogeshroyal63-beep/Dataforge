import { useState, useMemo } from 'react'
import Panel from '../components/common/Panel'
import Badge from '../components/common/Badge'
import RetentionChart from '../components/experiment/RetentionChart'
import { generateFacts, generateProbeOrder, decodeValueVector } from '../models/toyEncoding'
import { fullAttentionRecall } from '../models/fullAttention'
import { createEmptyState, updateState, readState } from '../models/linearAttention'
import { runFullBenchmark, summarizeBenchmark } from '../models/benchmark'

// Benchmark is deterministic given its seeds, so compute it once at module
// load rather than re-running on every render.
const BENCHMARK_DATA = runFullBenchmark([1, 2, 3, 4, 5])
const BENCHMARK_SUMMARY = summarizeBenchmark(BENCHMARK_DATA)

export default function ExperimentPage() {
  const [n, setN] = useState(8)
  const [seed] = useState(1)
  const [probeIndex, setProbeIndex] = useState(0)

  const facts = useMemo(() => generateFacts(n, seed), [n, seed])
  const probeOrder = useMemo(() => generateProbeOrder(facts, seed), [facts, seed])
  const activeProbe = facts[probeOrder[probeIndex % probeOrder.length]]

  const fullResult = useMemo(
    () => fullAttentionRecall(facts, activeProbe.keyVector),
    [facts, activeProbe]
  )

  const linearResult = useMemo(() => {
    const state = createEmptyState()
    for (const f of facts) updateState(state, f)
    const output = readState(state, activeProbe.keyVector)
    return { output, state }
  }, [facts, activeProbe])

  const fullGuess = fullResult.output ? decodeValueVector(fullResult.output) : null
  const linearGuess = linearResult.output ? decodeValueVector(linearResult.output) : null

  const fullCorrect = fullGuess === activeProbe.value
  const linearCorrect = linearGuess === activeProbe.value

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <div className="max-w-prose mb-10">
        <p className="fig-caption mb-2">Part A — Interactive recall lab</p>
        <h1 className="font-serif text-3xl sm:text-4xl mb-4">
          Watch memory break, live.
        </h1>
        <p className="text-ink-soft leading-relaxed">
          Both models below see the same list of facts — a key like{' '}
          <span className="font-mono text-sm">"Mango"</span> paired with a value
          like <span className="font-mono text-sm">7</span> — and are then
          asked to recall the value for a chosen key. Full Attention keeps
          every fact it has seen. Linear Attention compresses everything into
          one fixed-size running state. Drag the slider and watch the gap
          open up.
        </p>
      </div>

      <Panel
        title="1. Choose how many facts to remember"
        badge={<Badge variant="live">Live computation</Badge>}
        className="mb-6"
      >
        <div className="flex items-center gap-4 mb-2">
          <input
            type="range"
            min={2}
            max={20}
            step={1}
            value={n}
            onChange={(e) => {
              setN(Number(e.target.value))
              setProbeIndex(0)
            }}
            className="flex-1 accent-linear"
            aria-label="Number of facts to remember"
          />
          <span className="font-mono text-lg w-10 text-right">{n}</span>
        </div>
        <p className="text-sm text-ink-faint">
          Everything below recomputes instantly in your browser as you move
          this slider — nothing here is precomputed or animated.
        </p>
      </Panel>

      <Panel title="2. The facts both models just saw" className="mb-6">
        <div className="flex flex-wrap gap-2">
          {facts.map((f) => (
            <button
              key={f.key}
              onClick={() => setProbeIndex(probeOrder.indexOf(f.index))}
              className={`font-mono text-sm px-2.5 py-1 rounded-sm border transition-colors ${
                f.index === activeProbe.index
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-paper-dim border-paper-line hover:border-ink/40'
              }`}
            >
              {f.key} = {f.value}
            </button>
          ))}
        </div>
        <p className="text-sm text-ink-faint mt-3">
          Click a fact to probe the models with that key. Currently probing:{' '}
          <span className="font-mono text-ink">{activeProbe.key}</span>
        </p>
      </Panel>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <Panel
          title="Full Attention"
          badge={<Badge variant="live">O(N) memory</Badge>}
          className="border-full/30"
        >
          <ResultRow
            label="Model's guess"
            value={fullGuess}
            correct={fullCorrect}
            color="full"
          />
          <ResultRow label="Ground truth" value={activeProbe.value} muted />
          <p className="text-sm text-ink-faint mt-4">
            Storing every fact verbatim:{' '}
            <span className="font-mono">{fullResult.memoryCells}</span>{' '}
            numbers held in memory, growing with N.
          </p>
        </Panel>

        <Panel
          title="Linear Attention"
          badge={<Badge variant="live">O(1) memory</Badge>}
          className="border-linear/30"
        >
          <ResultRow
            label="Model's guess"
            value={linearGuess}
            correct={linearCorrect}
            color="linear"
          />
          <ResultRow label="Ground truth" value={activeProbe.value} muted />
          <p className="text-sm text-ink-faint mt-4">
            Fixed-size running state:{' '}
            <span className="font-mono">
              {KEY_DIM_TIMES_VALUE_DIM(linearResult.state)}
            </span>{' '}
            numbers held in memory, constant regardless of N.
          </p>
        </Panel>
      </div>

      <Panel
        title="Retention across sequence length"
        badge={<Badge variant="live">{BENCHMARK_SUMMARY.totalQueries} live queries</Badge>}
        caption={`Averaged over 5 random fact orderings per condition, computed live in this browser session. Full attention holds ${(BENCHMARK_SUMMARY.meanFullAccuracy * 100).toFixed(0)}% mean accuracy across all conditions; linear attention falls to a ${(BENCHMARK_SUMMARY.meanLinearAccuracy * 100).toFixed(0)}% mean as fixed-state interference accumulates.`}
      >
        <RetentionChart data={BENCHMARK_DATA} currentN={n} />
      </Panel>

      <div className="mt-10 max-w-prose">
        <h2 className="font-serif text-xl mb-3">The claim this demonstrates</h2>
        <blockquote className="border-l-2 border-linear pl-4 text-ink-soft leading-relaxed">
          A linear-attention model can track information across a sequence
          using a fixed-size running state instead of storing every past
          token, but as more facts are packed into that fixed state, older
          facts increasingly interfere with and get overwritten by newer
          ones — a failure mode standard attention does not have.
        </blockquote>
      </div>
    </div>
  )
}

function KEY_DIM_TIMES_VALUE_DIM(state) {
  return state.S.length * state.S[0].length + state.z.length
}

function ResultRow({ label, value, correct, muted, color }) {
  const colorCls = color === 'full' ? 'text-full-deep' : color === 'linear' ? 'text-linear-deep' : ''
  return (
    <div className="flex items-center justify-between py-2 border-b border-paper-line last:border-0">
      <span className="text-sm text-ink-soft">{label}</span>
      <span
        className={`font-mono text-lg font-medium ${
          muted ? 'text-ink' : correct ? 'text-signal-good' : 'text-signal-error'
        } ${!muted ? colorCls : ''}`}
      >
        {value === null || value === undefined ? '—' : value}
        {!muted && (correct ? ' ✓' : ' ✗')}
      </span>
    </div>
  )
}
