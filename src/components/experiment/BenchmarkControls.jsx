import React from 'react';
import { Play, RotateCcw, Loader2, BarChart2 } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useExperiment } from '../../context/ExperimentContext';

/**
 * BenchmarkControls — Actions to trigger and clear the multi-condition accuracy benchmark.
 */
export const BenchmarkControls = () => {
  const {
    benchmarkStatus,
    benchmarkProgress,
    runBenchmark,
    clearBenchmark,
  } = useExperiment();

  const isRunning = benchmarkStatus === 'running';
  const hasCompleted = benchmarkStatus === 'completed';

  return (
    <Card variant="standard" className="p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-2.5">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-lab-accent" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            Multi-Condition Benchmark Suite
          </h2>
        </div>
        <Badge
          variant={isRunning ? 'warning' : hasCompleted ? 'success' : 'default'}
          size="sm"
          dot
        >
          {isRunning
            ? `Condition ${benchmarkProgress?.condition || 1} / 10`
            : hasCompleted
            ? 'Benchmark Complete'
            : 'Ready'}
        </Badge>
      </div>

      <p className="text-[11px] font-mono text-lab-text-secondary leading-relaxed">
        Executes both Full Attention and Linear Attention across 10 sequence length conditions (N = 2, 4, 6, 8, 10, 12, 14, 16, 18, 20), testing all facts as probe queries to measure retention curves.
      </p>

      {/* Progress status */}
      {isRunning && (
        <div className="p-3 rounded-xl bg-lab-accent/10 border border-lab-accent/30 space-y-1.5 font-mono text-xs text-lab-accent text-center">
          <div className="flex items-center justify-center gap-2 font-bold">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Evaluating Condition {benchmarkProgress?.condition} of {benchmarkProgress?.total}</span>
          </div>
          <p className="text-[10px] text-lab-text-secondary">
            Testing sequence length N = {benchmarkProgress?.factCount} facts…
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          size="md"
          icon={isRunning ? Loader2 : Play}
          isLoading={isRunning}
          disabled={isRunning}
          onClick={runBenchmark}
          className="flex-1 min-w-[200px]"
          aria-label="Run the multi-condition accuracy benchmark across sequence lengths"
        >
          {isRunning ? 'Running Benchmark…' : hasCompleted ? 'Re-run Benchmark' : 'Run Accuracy Benchmark'}
        </Button>

        {hasCompleted && (
          <Button
            variant="ghost"
            size="md"
            icon={RotateCcw}
            disabled={isRunning}
            onClick={clearBenchmark}
            aria-label="Clear benchmark results"
          >
            Clear Benchmark
          </Button>
        )}
      </div>
    </Card>
  );
};

export default BenchmarkControls;
