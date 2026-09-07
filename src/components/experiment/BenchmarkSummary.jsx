import React from 'react';
import { Award, CheckCircle, Info, Scale, BarChart3 } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * BenchmarkSummary — Summary metric cards derived strictly from measured benchmark execution.
 *
 * @param {{
 *   summary: {
 *     conditionsCount: number,
 *     totalQueries: number,
 *     overallFullAccuracy: number,
 *     overallLinearAccuracy: number,
 *     differencePercentagePoints: number
 *   } | null
 * }} props
 */
export const BenchmarkSummary = ({ summary }) => {
  if (!summary) return null;

  const {
    conditionsCount,
    totalQueries,
    overallFullAccuracy,
    overallLinearAccuracy,
    differencePercentagePoints,
  } = summary;

  return (
    <Card variant="standard" className="p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-2.5">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-lab-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            Benchmark Summary Metrics
          </h3>
        </div>
        <Badge variant="research" size="sm">
          {totalQueries} Queries Evaluated
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-lab-secondary/60 border border-lab-border space-y-1 text-center">
          <span className="text-[10px] text-lab-text-muted uppercase block">Conditions</span>
          <span className="text-xl font-bold text-lab-text-primary block">
            {conditionsCount}
          </span>
          <span className="text-[10px] text-lab-text-secondary">N = 2 to 20</span>
        </div>

        <div className="p-3 rounded-xl bg-lab-secondary/60 border border-lab-purple/40 space-y-1 text-center">
          <span className="text-[10px] text-lab-purple uppercase font-semibold block">Full Attention</span>
          <span className="text-xl font-bold text-lab-purple block">
            {overallFullAccuracy}%
          </span>
          <span className="text-[10px] text-lab-text-muted">Unbounded KV</span>
        </div>

        <div className="p-3 rounded-xl bg-lab-secondary/60 border border-lab-accent/40 space-y-1 text-center">
          <span className="text-[10px] text-lab-accent uppercase font-semibold block">Linear Attention</span>
          <span className="text-xl font-bold text-lab-accent block">
            {overallLinearAccuracy}%
          </span>
          <span className="text-[10px] text-lab-text-muted">Fixed State Matrix</span>
        </div>

        <div className="p-3 rounded-xl bg-lab-secondary/60 border border-lab-border space-y-1 text-center">
          <span className="text-[10px] text-lab-text-muted uppercase block">Difference</span>
          <span className="text-xl font-bold text-lab-text-primary block">
            {Math.abs(differencePercentagePoints)} pts
          </span>
          <span className="text-[10px] text-lab-text-secondary">
            {differencePercentagePoints > 0 ? 'Full higher' : 'Linear parity'}
          </span>
        </div>
      </div>

      {/* Scientific Honesty Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-lab-secondary/50 border border-lab-border text-[11px] font-mono text-lab-text-muted">
        <Info className="w-4 h-4 text-lab-accent shrink-0 mt-0.5" />
        <p>
          <strong>Scientific note:</strong> This is a toy deterministic benchmark designed to isolate memory compression mechanics for educational demonstration, not a published LLM or production architecture evaluation.
        </p>
      </div>
    </Card>
  );
};

export default BenchmarkSummary;
