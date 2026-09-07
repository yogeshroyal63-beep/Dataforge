import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, Sparkles, AlertCircle } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * AttentionWeights — Visualizes computed softmax attention weights for Full Attention.
 * Shows proportional bars, percentage values, and highlights the token with argmax(α_i).
 *
 * @param {{
 *   attentionWeights: Array<{
 *     index: number,
 *     key: string,
 *     value: number,
 *     weight: number,
 *     percentage: number,
 *     isAttended: boolean,
 *     isTarget: boolean
 *   }>,
 *   queryKey: string
 * }} props
 */
export const AttentionWeights = ({ attentionWeights, queryKey }) => {
  const shouldReduceMotion = useReducedMotion();

  if (!attentionWeights || attentionWeights.length === 0) {
    return (
      <Card variant="standard" className="p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-lab-border pb-2.5">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-lab-purple" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-lab-text-primary">
              Attention Weight Distribution
            </h3>
          </div>
          <Badge variant="default" size="sm">Awaiting Run</Badge>
        </div>
        <p className="text-xs font-mono text-lab-text-muted text-center py-6">
          Run Full Attention to compute dynamic attention weight distribution.
        </p>
      </Card>
    );
  }

  // Calculate sum of weights to verify Σ ≈ 1
  const sumWeights = attentionWeights.reduce((acc, curr) => acc + curr.weight, 0);

  return (
    <Card variant="standard" className="p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-2.5">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-lab-purple" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            Full Attention Weights (α_i)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-lab-text-muted">
            Σ α = {sumWeights.toFixed(4)}
          </span>
          <Badge variant="research" size="sm">
            softmax(QKᵀ / √d)
          </Badge>
        </div>
      </div>

      <p className="text-[11px] font-mono text-lab-text-secondary leading-relaxed">
        Query <span className="font-bold text-lab-accent">{queryKey}</span> directly evaluates pairwise dot-product similarity against all token keys. The highest-weighted entry is retrieved.
      </p>

      {/* List of Attention Weight Bars */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1" role="list" aria-label="Attention weights for each token in sequence">
        {attentionWeights.map((item) => {
          const isHighest = item.isAttended;
          const barWidthPercent = Math.max(item.percentage, 2); // Minimum 2% width for visual presence

          return (
            <div
              key={`att-${item.key}-${item.index}`}
              role="listitem"
              className={`p-2.5 rounded-lg border transition-all ${
                isHighest
                  ? 'bg-lab-purple/15 border-lab-purple/60 shadow-xs'
                  : 'bg-lab-secondary/40 border-lab-border/60 hover:border-lab-border'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-lab-text-muted w-4 select-none">
                    {String(item.index + 1).padStart(2, '0')}
                  </span>
                  <span className={`font-bold ${isHighest ? 'text-lab-purple' : 'text-lab-text-primary'}`}>
                    {item.key}
                  </span>
                  <span className="text-[10px] text-lab-text-muted">→</span>
                  <span className="text-lab-text-secondary">{item.value}</span>
                  {isHighest && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] bg-lab-purple/30 text-lab-purple font-semibold">
                      <Sparkles className="w-2.5 h-2.5" />
                      Attended (argmax)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10px] text-lab-text-muted">
                    raw: {item.rawScore.toFixed(2)}
                  </span>
                  <span className={`text-xs font-bold ${isHighest ? 'text-lab-purple' : 'text-lab-text-primary'}`}>
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Proportional Bar */}
              <div
                className="w-full bg-lab-surface/80 rounded-full h-2 overflow-hidden border border-lab-border/40"
                role="progressbar"
                aria-valuenow={item.percentage}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`Attention weight for ${item.key}: ${item.percentage.toFixed(1)}%`}
              >
                <motion.div
                  initial={shouldReduceMotion ? { width: `${barWidthPercent}%` } : { width: '0%' }}
                  animate={{ width: `${barWidthPercent}%` }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: 'easeOut', delay: shouldReduceMotion ? 0 : item.index * 0.03 }}
                  className={`h-full rounded-full ${
                    isHighest
                      ? 'bg-gradient-to-r from-lab-purple/80 to-lab-purple'
                      : 'bg-lab-border-light/70'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AttentionWeights;
