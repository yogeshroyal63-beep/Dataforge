import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Binary, Calculator, Info } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * AttentionComputation — Inspectable transparent breakdown of the mathematical steps
 * inside the Full Attention toy engine.
 *
 * @param {{
 *   result: object | null
 * }} props
 */
export const AttentionComputation = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!result || result.model !== 'full-attention') {
    return null;
  }

  const {
    query,
    dimension,
    sqrtD,
    queryVector,
    keyVectors,
    rawScores,
    scaledScores,
    softmaxWeights,
    attentionWeights,
    predictedValue,
    weightedContinuousValue,
    attendedIndex,
  } = result;

  return (
    <Card variant="standard" className="p-5 space-y-4">
      {/* Header Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-lab-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            Full Attention Mathematical Trace
          </h3>
          <Badge variant="research" size="sm">
            d = {dimension}
          </Badge>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-xs font-mono text-lab-accent hover:text-lab-accent/80 transition-colors focus:outline-none focus:ring-1 focus:ring-lab-accent px-2.5 py-1 rounded-md bg-lab-secondary"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse mathematical trace' : 'Expand mathematical trace'}
        >
          <span>{isExpanded ? 'Collapse Trace' : 'Inspect Computation Steps'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <p className="text-[11px] font-mono text-lab-text-secondary leading-relaxed">
        Step-by-step observable pipeline from query token representation to final retrieved value.
      </p>

      {/* Collapsible Detail Sections */}
      {isExpanded && (
        <div className="space-y-4 pt-2 font-mono text-xs text-lab-text-secondary">
          {/* Step 1: Query Vector */}
          <div className="p-3.5 rounded-lg bg-lab-secondary/50 border border-lab-border space-y-2">
            <div className="flex items-center justify-between text-lab-text-primary font-bold">
              <span>Step 1: Query Vector Q ({query})</span>
              <span className="text-[10px] text-lab-text-muted">Unit L2 Normalized</span>
            </div>
            <div className="p-2 bg-lab-bg rounded border border-lab-border/60 text-[11px] text-lab-accent break-all">
              [{queryVector.map((v) => v.toFixed(3)).join(', ')}]
            </div>
          </div>

          {/* Step 2: Dot Products & Scaled Scores */}
          <div className="p-3.5 rounded-lg bg-lab-secondary/50 border border-lab-border space-y-2">
            <div className="flex items-center justify-between text-lab-text-primary font-bold">
              <span>Step 2: Pairwise Dot Products & Scaling (QKᵀ / √{dimension})</span>
              <span className="text-[10px] text-lab-text-muted">√d ≈ {sqrtD}</span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {keyVectors.map((kv, i) => (
                <div
                  key={`dot-${kv.key}-${i}`}
                  className={`p-2 rounded flex flex-wrap items-center justify-between gap-2 text-[11px] border ${
                    i === attendedIndex
                      ? 'bg-lab-purple/10 border-lab-purple/40 text-lab-purple font-semibold'
                      : 'bg-lab-bg/60 border-lab-border/40 text-lab-text-secondary'
                  }`}
                >
                  <span className="font-bold">{kv.key}:</span>
                  <span>Q · K = {rawScores[i].toFixed(4)}</span>
                  <span>÷ √d = {scaledScores[i].toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Stable Softmax Weights */}
          <div className="p-3.5 rounded-lg bg-lab-secondary/50 border border-lab-border space-y-2">
            <div className="flex items-center justify-between text-lab-text-primary font-bold">
              <span>Step 3: Numerically Stable Softmax (α_i = exp(s_i - max(s)) / Σ)</span>
              <span className="text-[10px] text-lab-purple font-bold">Highest: α[{attendedIndex}]</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {attentionWeights.map((aw) => (
                <div
                  key={`sw-${aw.key}-${aw.index}`}
                  className={`p-2 rounded border text-[11px] ${
                    aw.isAttended
                      ? 'bg-lab-purple/20 border-lab-purple text-lab-purple font-bold'
                      : 'bg-lab-bg/60 border-lab-border/40 text-lab-text-secondary'
                  }`}
                >
                  <div className="flex justify-between">
                    <span>{aw.key}:</span>
                    <span>{aw.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Value Retrieval & Aggregation */}
          <div className="p-3.5 rounded-lg bg-lab-secondary/50 border border-lab-border space-y-2">
            <div className="text-lab-text-primary font-bold">
              Step 4: Output Value Retrieval
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-lab-bg border border-lab-border space-y-1">
                <span className="text-lab-text-muted text-[10px] uppercase block">Discrete Key Lookup (argmax α)</span>
                <span className="text-lab-text-primary font-bold text-sm">
                  {attentionWeights[attendedIndex]?.key} → {predictedValue}
                </span>
              </div>
              <div className="p-2.5 rounded bg-lab-bg border border-lab-border space-y-1">
                <span className="text-lab-text-muted text-[10px] uppercase block">Continuous Expectation (Σ α_i × v_i)</span>
                <span className="text-lab-accent font-bold text-sm">
                  {weightedContinuousValue}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Disclosure */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-lab-secondary/80 border border-lab-border text-[11px] text-lab-text-muted">
            <Info className="w-4 h-4 text-lab-accent shrink-0 mt-0.5" />
            <p>
              <strong>Educational disclosure:</strong> This is a deterministic toy attention model designed to make the mechanism visible. Its token encoding and recall setup are educational simplifications, not a reproduction of a production language model.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AttentionComputation;
