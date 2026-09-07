import React from 'react';
import { Eye, Layers, AlertCircle, Info, CheckCircle2, XCircle } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { calculateModelAccuracy } from '../../utils/experimentAnalytics';

export const PerformanceOverview = ({ experiments = [] }) => {
  const fullStats = calculateModelAccuracy(experiments, 'full');
  const linearStats = calculateModelAccuracy(experiments, 'linear');
  const totalRuns = experiments.length;
  const isSmallSample = totalRuns > 0 && totalRuns < 5;

  return (
    <Card variant="standard" className="p-5 space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
            Saved Run Performance Overview
          </h2>
          <p className="text-[11px] text-lab-text-muted mt-0.5">
            Empirical accuracy aggregated across your saved toy experiment runs.
          </p>
        </div>
        <Badge variant="research" size="sm">
          Source: Saved StateLens Experiments
        </Badge>
      </div>

      {/* Small sample size scientific disclosure */}
      {isSmallSample && (
        <div className="p-3 rounded-lg bg-lab-warning/10 border border-lab-warning/30 text-xs text-lab-warning flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Small Sample Notice</span>
            <p className="text-[11px] text-lab-text-secondary">
              This summary reflects only your {totalRuns} saved run{totalRuns === 1 ? '' : 's'} and should not be interpreted as a general model benchmark.
            </p>
          </div>
        </div>
      )}

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Attention Performance */}
        <div className="p-4 rounded-xl bg-lab-secondary/40 border border-lab-purple/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-lab-purple" />
              <h3 className="text-xs font-bold uppercase text-lab-purple">Full Attention</h3>
            </div>
            {fullStats.evaluated > 0 ? (
              <span className="text-xs font-bold text-lab-purple">
                {fullStats.accuracy}% Accuracy
              </span>
            ) : (
              <Badge variant="default" size="sm">No Saved Runs</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded bg-lab-bg/80 border border-lab-border">
              <span className="text-[10px] text-lab-text-muted uppercase block">Correct Runs</span>
              <span className="text-base font-bold text-lab-text-primary">
                {fullStats.evaluated > 0 ? `${fullStats.correct} / ${fullStats.evaluated}` : '—'}
              </span>
            </div>
            <div className="p-2.5 rounded bg-lab-bg/80 border border-lab-border">
              <span className="text-[10px] text-lab-text-muted uppercase block">Direct Memory Rate</span>
              <span className="text-base font-bold text-lab-purple">
                {fullStats.accuracy !== null ? `${fullStats.accuracy}%` : '—'}
              </span>
            </div>
          </div>

          <div className="w-full bg-lab-surface rounded-full h-1.5 overflow-hidden border border-lab-border">
            <div
              className="bg-lab-purple h-full rounded-full transition-all duration-500"
              style={{ width: `${fullStats.accuracy || 0}%` }}
            />
          </div>
        </div>

        {/* Linear Attention Performance */}
        <div className="p-4 rounded-xl bg-lab-secondary/40 border border-lab-accent/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-lab-accent" />
              <h3 className="text-xs font-bold uppercase text-lab-accent">Linear Attention</h3>
            </div>
            {linearStats.evaluated > 0 ? (
              <span className="text-xs font-bold text-lab-accent">
                {linearStats.accuracy}% Accuracy
              </span>
            ) : (
              <Badge variant="default" size="sm">No Saved Runs</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded bg-lab-bg/80 border border-lab-border">
              <span className="text-[10px] text-lab-text-muted uppercase block">Correct Runs</span>
              <span className="text-base font-bold text-lab-text-primary">
                {linearStats.evaluated > 0 ? `${linearStats.correct} / ${linearStats.evaluated}` : '—'}
              </span>
            </div>
            <div className="p-2.5 rounded bg-lab-bg/80 border border-lab-border">
              <span className="text-[10px] text-lab-text-muted uppercase block">Recurrent State Rate</span>
              <span className="text-base font-bold text-lab-accent">
                {linearStats.accuracy !== null ? `${linearStats.accuracy}%` : '—'}
              </span>
            </div>
          </div>

          <div className="w-full bg-lab-surface rounded-full h-1.5 overflow-hidden border border-lab-border">
            <div
              className="bg-lab-accent h-full rounded-full transition-all duration-500"
              style={{ width: `${linearStats.accuracy || 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-lab-secondary/30 border border-lab-border text-[11px] text-lab-text-muted">
        <Info className="w-3.5 h-3.5 text-lab-accent shrink-0 mt-0.5" />
        <span>
          These metrics summarize your personal saved runs. They are separate from the deterministic 110-query StateLens benchmark suite.
        </span>
      </div>
    </Card>
  );
};

export default PerformanceOverview;
