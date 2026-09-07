import React from 'react';
import { Search, Play, Loader2, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useExperiment } from '../../context/ExperimentContext';

/**
 * QueryPanel — Displays the probe key, expected value, predictions for both models, and Run CTA.
 */
export const QueryPanel = () => {
  const {
    selectedQuery,
    facts,
    experimentStatus,
    executionProgress,
    results,
    selectedModels,
    runExperiment,
  } = useExperiment();

  const isRunning = experimentStatus === 'running';
  const isCompleted = experimentStatus === 'completed';
  const hasQuery = !!selectedQuery && facts.length > 0;

  const showFull = selectedModels === 'both' || selectedModels === 'full';
  const showLinear = selectedModels === 'both' || selectedModels === 'linear';

  const fullResult = results?.full;
  const linearResult = results?.linear;

  const runButtonLabel = isRunning
    ? executionProgress || 'Computing attention models…'
    : isCompleted
    ? 'Run Again'
    : 'Run Experiment';

  return (
    <Card variant="standard" className="p-5 space-y-5">
      <div className="flex items-center justify-between border-b border-lab-border pb-2.5">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-lab-text-primary">
          Query Probe & Predictions
        </h2>
        <Badge variant={hasQuery ? 'accent' : 'default'} size="sm">
          {hasQuery ? 'Probe Target Ready' : 'Select query above'}
        </Badge>
      </div>

      {hasQuery ? (
        <>
          {/* Query Probe Card */}
          <div className="p-5 rounded-xl bg-lab-secondary/60 border border-lab-border space-y-3.5 text-center">
            <div className="text-xs font-mono text-lab-text-muted uppercase tracking-wider">
              Which value belongs to:
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lab-accent/10 border border-lab-accent/30 flex items-center justify-center text-lab-accent">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-3xl font-mono font-extrabold text-lab-accent tracking-tight">
                {selectedQuery.key}
              </span>
            </div>

            {/* Expected vs Model Predictions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="p-2 rounded bg-lab-surface border border-lab-border text-center">
                <span className="text-[10px] text-lab-text-muted uppercase block">Expected Value</span>
                <span className="font-bold text-lg text-lab-text-primary">
                  {selectedQuery.value}
                </span>
              </div>

              {showFull && (
                <div className="p-2 rounded bg-lab-surface border border-lab-purple/30 text-center">
                  <span className="text-[10px] text-lab-purple uppercase block font-semibold">Full Attention</span>
                  <span className={`font-bold text-lg ${fullResult ? 'text-lab-purple' : 'text-lab-text-muted'}`}>
                    {fullResult?.predictedValue !== undefined && fullResult?.predictedValue !== null
                      ? fullResult.predictedValue
                      : '—'}
                  </span>
                </div>
              )}

              {showLinear && (
                <div className="p-2 rounded bg-lab-surface border border-lab-accent/30 text-center">
                  <span className="text-[10px] text-lab-accent uppercase block font-semibold">Linear Attention</span>
                  <span className={`font-bold text-lg ${linearResult ? 'text-lab-accent' : 'text-lab-text-muted'}`}>
                    {linearResult?.predictedValue !== undefined && linearResult?.predictedValue !== null
                      ? linearResult.predictedValue
                      : '—'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Running Progress */}
          {isRunning && (
            <div className="p-3 rounded-lg bg-lab-accent/10 border border-lab-accent/30 text-center text-xs font-mono text-lab-accent animate-pulse">
              {executionProgress || 'Evaluating models…'}
            </div>
          )}

          {isCompleted && (
            <div className="p-2.5 rounded-lg bg-lab-secondary/80 border border-lab-border flex items-center justify-between text-xs font-mono">
              <span className="text-lab-text-muted">Experiment status:</span>
              <span className="text-lab-accent font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Computation complete
              </span>
            </div>
          )}

          {/* Run Experiment CTA */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            icon={isRunning ? Loader2 : Play}
            isLoading={isRunning}
            disabled={isRunning}
            onClick={runExperiment}
            aria-label="Run the recall experiment against selected attention models"
          >
            {runButtonLabel}
          </Button>
        </>
      ) : (
        <div className="text-center py-6 text-xs font-mono text-lab-text-muted">
          Generate facts and select a query to probe the models.
        </div>
      )}
    </Card>
  );
};

export default QueryPanel;
