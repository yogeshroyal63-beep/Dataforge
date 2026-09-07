import React from 'react';
import { FlaskConical, Info } from 'lucide-react';
import Badge from '../common/Badge';

/**
 * ExperimentHeader — Top of the experiment workspace.
 * Shows title, description, and current phase status badge.
 */
export const ExperimentHeader = ({ experimentStatus = 'idle' }) => {
  const statusConfig = {
    idle:        { label: 'READY TO CONFIGURE',    variant: 'default' },
    configuring: { label: 'CONFIGURING',           variant: 'accent' },
    ready:       { label: 'READY TO RUN',          variant: 'success' },
    running:     { label: 'EXPERIMENT RUNNING',    variant: 'warning' },
    completed:   { label: 'PIPELINE COMPLETE',     variant: 'success' },
    error:       { label: 'EXPERIMENT ERROR',      variant: 'danger' },
  };

  const currentStatus = statusConfig[experimentStatus] || statusConfig.idle;

  return (
    <div className="border-b border-lab-border pb-6 mb-6 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-lab-accent">
          Interactive Experiment
        </span>
        <Badge variant={currentStatus.variant} size="sm" dot>
          {currentStatus.label}
        </Badge>
        <Badge variant="research" size="sm">
          Phase 3 — Interaction Ready
        </Badge>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-lab-accent/10 border border-lab-accent/30 flex items-center justify-center text-lab-accent flex-shrink-0 mt-0.5">
          <FlaskConical className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-lab-text-primary">
            Can a fixed memory keep everything straight?
          </h1>
          <p className="text-sm text-lab-text-secondary mt-1.5 leading-relaxed max-w-2xl">
            Pack more facts into a sequence, probe the memory with a query, and observe how different attention mechanisms represent information.
          </p>
        </div>
      </div>

      {/* Screen Reader Live Status Announcement Region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {experimentStatus === 'running'
          ? 'Running experiment computation across selected attention models.'
          : experimentStatus === 'completed'
          ? 'Experiment computation complete. Results and memory traces are updated.'
          : experimentStatus === 'error'
          ? 'Experiment encountered an error during execution.'
          : `Experiment status: ${currentStatus.label}`}
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-lab-secondary/60 border border-lab-border text-xs text-lab-text-muted">
        <Info className="w-4 h-4 text-lab-accent flex-shrink-0 mt-px" />
        <span>
          The experiment interface is fully interactive. Numerical model results and attention traces update deterministically.
        </span>
      </div>
    </div>
  );
};

export default ExperimentHeader;
