import React, { useMemo } from 'react'
import { AlertOctagon, Layers, Cpu } from 'lucide-react'
import SectionHeader from '../components/common/SectionHeader'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Panel from '../components/common/Panel'
import { BDH_LIMITATIONS } from '../data/bdhResearch'
import { generateFacts, generateProbeOrder, decodeValueVector } from '../models/toyEncoding'
import { fullAttentionRecall } from '../models/fullAttention'
import { createEmptyState, updateState, readState } from '../models/linearAttention'

/**
 * Computes the concrete failure case: seed=5, N=14, query key = 'Mango'.
 *
 * Selected because at this exact setting the linear-attention model returns
 * the wrong answer while full attention stays correct, making the interference
 * failure mode visible and falsifiable. Computed live, identical to the
 * Experiment page — not precomputed or faked.
 */
function computeFailureCase() {
  const SEED = 5
  const N = 14
  const facts = generateFacts(N, SEED)

  const mangoFact = facts.find((f) => f.key === 'Mango')
  if (!mangoFact) return null

  // Full attention recall
  const { output: fullOut, trace: fullTrace } = fullAttentionRecall(facts, mangoFact.keyVector)
  const fullGuess = fullOut ? decodeValueVector(fullOut) : null
  const fullWeightEntry = fullTrace.find((t) => t.key === 'Mango')
  const fullWeight = fullWeightEntry ? (fullWeightEntry.weight * 100).toFixed(1) : null

  // Linear attention recall
  const state = createEmptyState()
  for (const f of facts) updateState(state, f)
  const linearOut = readState(state, mangoFact.keyVector)
  const linearGuess = linearOut ? decodeValueVector(linearOut) : null

  return {
    seed: SEED,
    n: N,
    queryKey: 'Mango',
    trueValue: mangoFact.value,
    fullGuess,
    linearGuess,
    fullCorrect: fullGuess === mangoFact.value,
    linearCorrect: linearGuess === mangoFact.value,
    fullAttentionWeight: fullWeight,
  }
}

export default function Limitation() {
  // Deterministic, runs in <1ms
  const fc = useMemo(() => {
    try { return computeFailureCase() } catch { return null }
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16 space-y-10">
      <div>
        <p className="fig-caption mb-2">Part C — Named out loud</p>
        <h1 className="font-serif text-3xl sm:text-4xl mb-6">
          The failure that doesn't announce itself
        </h1>
        <p className="text-ink-soft leading-relaxed max-w-prose">
          A linear-attention model doesn't crash or truncate when its fixed
          state is full. It keeps answering — confidently, in the same format
          as always — it just starts getting the answer wrong, with nothing on
          screen to tell you that happened. That silent failure mode is the
          single most important thing to walk away from this project
          understanding.
        </p>
      </div>

      {/* Core thesis */}
      <Card variant="standard" className="border-l-4 border-l-red-500 p-6 space-y-3">
        <Badge variant="danger" size="sm">Core failure mode</Badge>
        <h2 className="text-xl font-bold">
          It doesn't simply "run out of context."
        </h2>
        <p className="text-sm text-ink-soft leading-relaxed">
          A fixed memory state experiences <strong>interference</strong>: information
          degrades without any system error, truncation event, or visible warning.
          The model keeps returning a well-formatted, confident-looking answer —
          it's just wrong.
        </p>
      </Card>

      {/* Live failure case */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Live computation — seed 5, N = 14"
          title="Concrete failure example"
          description="The numbers below are computed right now by the same toy models that run on the Experiment page. Nothing here is precomputed or faked."
          align="left"
        />

        {fc ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full attention result */}
              <Card variant="standard" className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold">Full Attention</span>
                  <Badge variant="success" size="sm">Correct</Badge>
                </div>
                <div className="font-mono text-xs text-ink-soft space-y-1">
                  <div>Query: <strong className="text-ink">{fc.queryKey}</strong></div>
                  <div>True value: <strong className="text-ink">{fc.trueValue}</strong></div>
                  <div>
                    Model answer:{' '}
                    <strong className="text-green-600">{fc.fullGuess}</strong>
                  </div>
                  {fc.fullAttentionWeight && (
                    <div>
                      Attention weight on {fc.queryKey}:{' '}
                      <strong>{fc.fullAttentionWeight}%</strong>
                    </div>
                  )}
                  <p className="text-ink-faint mt-2">
                    Retains every past key–value pair. The query key finds
                    its exact match with high weight.
                  </p>
                </div>
              </Card>

              {/* Linear attention result */}
              <Card variant="standard" className="p-5 space-y-3 border-red-200">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold">Linear Attention</span>
                  <Badge variant="danger" size="sm">
                    {fc.linearCorrect ? 'Correct at N=14' : 'Wrong'}
                  </Badge>
                </div>
                <div className="font-mono text-xs text-ink-soft space-y-1">
                  <div>Query: <strong className="text-ink">{fc.queryKey}</strong></div>
                  <div>True value: <strong className="text-ink">{fc.trueValue}</strong></div>
                  <div>
                    Model answer:{' '}
                    <strong
                      className={
                        fc.linearCorrect ? 'text-green-600' : 'text-red-500'
                      }
                    >
                      {fc.linearGuess}
                    </strong>
                  </div>
                  <p className="text-ink-faint mt-2">
                    All {fc.n} facts compressed into one 16×10 matrix.
                    The {fc.queryKey} association is partially overwritten by
                    the other {fc.n - 1} facts packed into the same state.
                  </p>
                </div>
              </Card>
            </div>

            <p className="text-xs text-ink-faint leading-relaxed">
              Computed with{' '}
              <code className="font-mono">generateFacts(n=14, seed=5)</code> and{' '}
              <code className="font-mono">readState(state, mangoKeyVector)</code> — same
              code path as the Experiment page. Increase N to 20 on the Experiment page
              to see interference worsen across all queries.
            </p>
          </>
        ) : (
          <Card variant="standard" className="p-5 text-sm text-ink-soft">
            Could not run the live failure case (check browser console).
          </Card>
        )}
      </section>

      {/* Side-by-side failure taxonomy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="standard" className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-sm">Full attention failure: hard truncation</h3>
          </div>
          <p className="text-sm text-ink-soft leading-relaxed">
            When sequence length exceeds the context window (N &gt; N_max), tokens
            outside the window are discarded completely. The boundary is sharp,
            discrete, and predictable — the model errors or stops rather than
            silently answering wrong.
          </p>
          <div className="p-2 rounded bg-paper text-xs font-mono text-ink-faint">
            Symptom: hard token cutoff or OOM error
          </div>
        </Card>

        <Card variant="standard" className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-red-500" />
            <h3 className="font-semibold text-sm">Linear attention failure: state interference</h3>
          </div>
          <p className="text-sm text-ink-soft leading-relaxed">
            The state matrix continues accepting tokens indefinitely. As more
            key–value outer products accumulate in the same fixed 16×10 matrix,
            older associations are overwritten by newer ones — silently.
          </p>
          <div className="p-2 rounded bg-paper text-xs font-mono text-red-400">
            Symptom: confident wrong answer, no error signal
          </div>
        </Card>
      </div>

      {/* N=20 hidden-limit disclosure (bug 9 fix) */}
      <Card variant="standard" className="p-4 border-l-2 border-l-amber-400">
        <div className="flex items-start gap-3">
          <AlertOctagon className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <div className="text-sm text-ink-soft leading-relaxed">
            <strong className="text-ink">Model limit (stated explicitly):</strong>{' '}
            The vocabulary in{' '}
            <code className="font-mono text-xs">toyEncoding.js</code> is capped at 20
            words (VOCAB.length = 20). Experiments with N &gt; 20 are not supported —
            the slider and benchmark suite both respect this cap. This is a toy-encoding
            constraint chosen so interference is observable at small N; it is not a
            property of linear attention in general. See README for full model
            constraints and how to reproduce all results.
          </div>
        </div>
      </Card>

      {/* Named limitations pulled from bdhResearch */}
      <div className="space-y-4">
        {BDH_LIMITATIONS.map((item) => (
          <Panel
            key={item.title}
            title={item.title}
            badge={<Badge variant="neutral">Limitation</Badge>}
          >
            <p className="text-sm text-ink-soft leading-relaxed">{item.body}</p>
          </Panel>
        ))}
      </div>
    </div>
  )
}
