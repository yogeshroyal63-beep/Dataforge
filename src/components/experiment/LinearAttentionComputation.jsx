import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, Layers, Info } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * LinearAttentionComputation — Inspectable transparent mathematical trace
 * for the Linear Attention recurrent engine.
 *
 * @param {{
 *   result: object | null
 * }} props
 */
export const LinearAttentionComputation = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!result || result.model !== 'linear-attention') {
    return null;
  }

  const {
    query,
    featureDimension,
    valueDimension,
    stateShape,
    queryFeature,
    normalizerScalar,
    unnormalizedOutput,
    normalizedOutput,
    predictedValue,
    expectedValue,
    isCorrect,
    confidence,
  } = result;

  return (
    <Card variant="standard" className="p-5 space-y-4">
      {/* Header Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-lab-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            Linear Attention Mathematical Trace
          </h3>
          <Badge variant="accent" size="sm">
            {stateShape}
          </Badge>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-xs font-mono text-lab-accent hover:text-lab-accent/80 transition-colors focus:outline-none focus:ring-1 focus:ring-lab-accent px-2.5 py-1 rounded-md bg-lab-secondary"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse mathematical trace' : 'Expand mathematical trace'}
        >
          <span>{isExpanded ? 'Collapse Trace' : 'Inspect Recurrent Steps'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <p className="text-[11px] font-mono text-lab-text-secondary leading-relaxed">
        Observable recurrent pipeline: feature map transformation $\phi(x)$, running state accumulation $S_t$, normalizer accumulation $z_t$, and query-state retrieval.
      </p>

      {/* Collapsible Trace */}
      {isExpanded && (
        <div className="space-y-4 pt-2 font-mono text-xs text-lab-text-secondary">
          {/* Step 1: Query Feature Vector */}
          <div className="p-3.5 rounded-lg bg-lab-secondary/50 border border-lab-border space-y-2">
            <div className="flex items-center justify-between text-lab-text-primary font-bold">
              <span>Step 1: Non-Negative Query Feature φ(Q) ({query})</span>
              <span className="text-[10px] text-lab-accent font-semibold">ELU(x) + 1</span>
            </div>
            <div className="p-2 bg-lab-bg rounded border border-lab-border/60 text-[11px] text-lab-accent break-all">
              [{queryFeature.map((v) => v.toFixed(3)).join(', ')}]
            </div>
          </div>

          {/* Step 2: Recurrent Update Formulation */}
          <div className="p-3.5 rounded-lg bg-lab-secondary/50 border border-lab-border space-y-2">
            <div className="flex items-center justify-between text-lab-text-primary font-bold">
              <span>Step 2: Sequential State Accumulation (S_t = S_(t-1) + φ(K_t) V_tᵀ)</span>
              <span className="text-[10px] text-lab-text-muted">{featureDimension} × {valueDimension} state</span>
            </div>
            <p className="text-[11px] text-lab-text-secondary">
              Each fact is converted into an outer product between its key feature vector $\phi(K_t) \in \mathbb{R}^8$ and one-hot value vector $V_t \in \mathbb{R}^{10}$, and added directly into $S_t$.
            </p>
          </div>

          {/* Step 3: Query-State Product & Normalization */}
          <div className="p-3.5 rounded-lg bg-lab-secondary/50 border border-lab-border space-y-2">
            <div className="flex items-center justify-between text-lab-text-primary font-bold">
              <span>Step 3: Query-State Interaction & Normalization</span>
              <span className="text-[10px] text-lab-text-muted">η = {normalizerScalar}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-lab-bg rounded border border-lab-border space-y-1">
                <span className="text-lab-text-muted text-[10px] uppercase block">Numerator (φ(Q)ᵀ S_N)</span>
                <span className="text-lab-text-primary block break-all">
                  [{unnormalizedOutput.map((v) => v.toFixed(2)).join(', ')}]
                </span>
              </div>
              <div className="p-2 bg-lab-bg rounded border border-lab-border space-y-1">
                <span className="text-lab-text-muted text-[10px] uppercase block">Normalized Output Distribution y</span>
                <span className="text-lab-accent font-bold block break-all">
                  [{normalizedOutput.map((v) => v.toFixed(2)).join(', ')}]
                </span>
              </div>
            </div>
          </div>

          {/* Step 4: Value Extraction via argmax */}
          <div className="p-3.5 rounded-lg bg-lab-secondary/50 border border-lab-border space-y-2">
            <div className="text-lab-text-primary font-bold">
              Step 4: Discrete Prediction
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded bg-lab-bg border border-lab-border">
              <div>
                <span className="text-lab-text-muted text-[10px] uppercase block">argmax_v (y_v)</span>
                <span className="text-lab-accent font-bold text-base">
                  Retrieved Value: {predictedValue}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lab-text-muted text-[10px] uppercase block">Expected Ground Truth</span>
                <span className="text-lab-text-primary font-bold text-base">
                  {expectedValue}
                </span>
              </div>
              <Badge variant={isCorrect ? 'success' : 'warning'} size="sm">
                {isCorrect ? 'Exact Match' : 'Interference / Mismatch'}
              </Badge>
            </div>
          </div>

          {/* Educational Disclosure */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-lab-secondary/80 border border-lab-border text-[11px] text-lab-text-muted">
            <Info className="w-4 h-4 text-lab-accent shrink-0 mt-0.5" />
            <p>
              <strong>Educational disclosure:</strong> This is a deterministic toy linear attention model using recurrent state outer products. Results demonstrate fixed-memory compression, not a production language model or published benchmark.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default LinearAttentionComputation;
