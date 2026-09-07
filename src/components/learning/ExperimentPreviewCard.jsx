import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Layers, Cpu, HelpCircle } from 'lucide-react';
import { ROUTES } from '../../routes/routes';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';

/**
 * ExperimentPreviewCard: Section 14 preview card leading into the real experiment.
 */
export const ExperimentPreviewCard = ({ className = '' }) => {
  return (
    <Card
      variant="interactive"
      className={`p-6 sm:p-8 md:p-10 border-lab-accent/40 bg-gradient-to-br from-lab-surface via-[#0d121c] to-lab-secondary relative overflow-hidden ${className}`}
    >
      {/* Watermark badge */}
      <div className="flex items-center justify-between border-b border-lab-border/70 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="sm" dot>
            Experiment preview
          </Badge>
          <span className="text-xs font-mono text-lab-text-muted hidden sm:inline">
            Interactive associative recall benchmark
          </span>
        </div>
        <span className="text-[11px] font-mono text-lab-text-muted">
          No sign-in required
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: THE RECALL TASK */}
        <div className="space-y-3 bg-lab-surface/70 p-5 rounded-xl border border-lab-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-lab-text-secondary tracking-wider">
              The Recall Task
            </span>
            <span className="text-[10px] font-mono text-lab-text-muted">N Facts</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2 rounded bg-lab-secondary/80 border border-lab-border flex justify-between">
              <span className="text-lab-text-primary">APPLE</span>
              <span className="text-lab-accent font-bold">= 7</span>
            </div>
            <div className="p-2 rounded bg-lab-secondary/80 border border-lab-border flex justify-between">
              <span className="text-lab-text-primary">MANGO</span>
              <span className="text-lab-accent font-bold">= 3</span>
            </div>
            <div className="p-2 rounded bg-lab-secondary/80 border border-lab-border flex justify-between">
              <span className="text-lab-text-primary">KIWI</span>
              <span className="text-lab-accent font-bold">= 9</span>
            </div>
            <div className="text-center text-lab-text-muted text-[11px] py-0.5">
              ... [customizable fact sequence]
            </div>
          </div>
        </div>

        {/* Right: THE TEST & PROBE */}
        <div className="space-y-4">
          <div className="bg-lab-surface/70 p-5 rounded-xl border border-lab-border space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-lab-text-secondary tracking-wider">
                The Test Probe
              </span>
              <span className="text-[10px] text-lab-accent">Target Evaluation</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-lab-secondary border border-lab-accent/40 text-sm">
              <span className="text-lab-text-primary font-semibold">QUERY: KIWI</span>
              <span className="text-lab-accent font-bold flex items-center gap-1">
                → <HelpCircle className="w-4 h-4 text-lab-accent inline" /> ?
              </span>
            </div>
            <p className="text-[11px] text-lab-text-secondary font-sans">
              Test whether the models accurately predict 9 as sequence length scales.
            </p>
          </div>

          {/* Model labels comparison */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-lab-secondary/60 border border-lab-purple/30 text-center">
              <span className="block text-[10px] text-lab-purple font-semibold">Model A</span>
              <span className="text-lab-text-primary font-bold">FULL ATTENTION</span>
            </div>
            <div className="p-2.5 rounded-lg bg-lab-secondary/60 border border-lab-accent/30 text-center">
              <span className="block text-[10px] text-lab-accent font-semibold">Model B</span>
              <span className="text-lab-text-primary font-bold">LINEAR ATTENTION</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center callout & CTA */}
      <div className="mt-8 pt-6 border-t border-lab-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold text-lab-text-primary">
            Change the number of facts → observe the result
          </p>
          <p className="text-xs text-lab-text-muted mt-0.5">
            Test actual retrieval accuracy side-by-side with ground-truth verification.
          </p>
        </div>

        <Link to={ROUTES.EXPERIMENT} className="w-full sm:w-auto">
          <Button variant="primary" size="lg" icon={Play} className="w-full sm:w-auto">
            Open Interactive Experiment
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ExperimentPreviewCard;
