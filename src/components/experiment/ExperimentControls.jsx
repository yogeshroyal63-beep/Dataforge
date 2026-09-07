import React from 'react';
import { RefreshCw, Shuffle } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import FactSlider from './FactSlider';
import { useExperiment } from '../../context/ExperimentContext';

/**
 * ExperimentControls — Configuration panel for fact count, fact generation, and query selection.
 */
export const ExperimentControls = () => {
  const {
    factCount,
    facts,
    selectedQuery,
    experimentStatus,
    setFactCount,
    generateAndSetFacts,
    setSelectedQuery,
    resetExperiment,
  } = useExperiment();

  const isRunning = experimentStatus === 'running';

  return (
    <Card variant="standard" className="p-5 space-y-5">
      <div className="flex items-center justify-between border-b border-lab-border pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-lab-text-primary">
          Experiment Configuration
        </h2>
        <Button
          variant="ghost"
          size="sm"
          icon={RefreshCw}
          onClick={resetExperiment}
          disabled={isRunning}
          aria-label="Reset experiment to initial state"
        >
          Reset
        </Button>
      </div>

      {/* Fact Count Slider */}
      <FactSlider
        value={factCount}
        min={2}
        max={20}
        onChange={setFactCount}
        disabled={isRunning}
      />

      {/* Generate Facts Button */}
      <div className="space-y-1.5">
        <Button
          variant="secondary"
          size="md"
          icon={Shuffle}
          onClick={generateAndSetFacts}
          disabled={isRunning}
          className="w-full"
          aria-label="Generate deterministic toy facts for the experiment"
        >
          Generate Facts
        </Button>
        <p className="text-[11px] text-lab-text-muted text-center font-mono">
          Toy facts for the educational experiment.
        </p>
      </div>

      {/* Query Selector */}
      {facts.length > 0 && (
        <div className="space-y-2">
          <label
            htmlFor="query-selector"
            className="block text-xs font-mono font-semibold text-lab-text-secondary uppercase tracking-wider"
          >
            Query Key
          </label>
          <select
            id="query-selector"
            value={selectedQuery?.key || ''}
            onChange={(e) => {
              const fact = facts.find((f) => f.key === e.target.value);
              if (fact) setSelectedQuery(fact);
            }}
            disabled={isRunning || facts.length === 0}
            className="w-full bg-lab-secondary border border-lab-border rounded-lg px-3.5 py-2.5 text-sm font-mono font-semibold text-lab-accent focus:outline-none focus:ring-1 focus:ring-lab-accent focus:border-lab-accent hover:border-lab-border-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Select query key to probe the model memory"
          >
            {facts.map((fact) => (
              <option key={fact.key} value={fact.key}>
                {fact.key} (expected: {fact.value})
              </option>
            ))}
          </select>

          {selectedQuery && (
            <div className="flex items-center justify-between px-3 py-2 bg-lab-surface/80 rounded-lg border border-lab-accent/30 text-xs font-mono">
              <span className="text-lab-text-secondary">Probing for:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lab-accent">{selectedQuery.key}</span>
                <span className="text-lab-text-muted">→</span>
                <span className="text-lab-text-primary font-bold">{selectedQuery.value}</span>
                <Badge variant="accent" size="sm">ground truth</Badge>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ExperimentControls;
