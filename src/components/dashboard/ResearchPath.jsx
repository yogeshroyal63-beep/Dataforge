import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight, Compass } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { ROUTES } from '../../routes/routes';

export const ResearchPath = ({ experiments = [] }) => {
  const hasSavedRun = experiments.length > 0;
  const hasDualModelRun = experiments.some((e) => e.fullAttention && e.linearAttention);
  const uniqueFactCounts = new Set(experiments.map((e) => e.factCount));
  const hasMultipleConditions = uniqueFactCounts.size >= 3;
  const hasTestedMax = uniqueFactCounts.has(20);

  const steps = [
    {
      id: 'step-1',
      title: 'Run & Save First Experiment',
      desc: 'Execute an associative recall probe and save results to local history.',
      completed: hasSavedRun,
      link: ROUTES.EXPERIMENT,
      linkText: 'Run Lab',
    },
    {
      id: 'step-2',
      title: 'Compare Full vs Linear Attention',
      desc: 'Evaluate both quadratic attention and recurrent linear state on identical facts.',
      completed: hasDualModelRun,
      link: ROUTES.EXPERIMENT,
      linkText: 'Compare Models',
    },
    {
      id: 'step-3',
      title: 'Test Varying Sequence Lengths',
      desc: 'Observe how memory interference increases as N scales from 2 to 20 facts.',
      completed: hasMultipleConditions,
      link: ROUTES.EXPERIMENT,
      linkText: 'Scale Sequence',
    },
    {
      id: 'step-4',
      title: 'Explore BDH-CQ Research Bridge',
      desc: 'Discover how Pathway BDH-CQ maintains unbounded precision without quadratic storage.',
      completed: null, // Informational step
      link: ROUTES.BDH_CQ,
      linkText: 'Read BDH-CQ',
    },
  ];

  const completedCount = steps.filter((s) => s.completed === true).length;

  return (
    <Card variant="standard" className="p-5 space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-lab-purple" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
            Research Path & Milestones
          </h2>
        </div>
        <Badge variant="research" size="sm">
          {completedCount} / 3 Milestones
        </Badge>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className="p-3 rounded-lg bg-lab-secondary/30 border border-lab-border flex items-start justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-2.5">
              {step.completed === true ? (
                <CheckCircle2 className="w-4 h-4 text-lab-accent shrink-0 mt-0.5" />
              ) : step.completed === false ? (
                <Circle className="w-4 h-4 text-lab-text-muted shrink-0 mt-0.5" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-lab-purple flex items-center justify-center shrink-0 mt-0.5 text-[9px] text-lab-purple font-bold">
                  ★
                </div>
              )}
              <div className="space-y-0.5">
                <span className="font-bold text-lab-text-primary block text-xs">
                  {idx + 1}. {step.title}
                </span>
                <p className="text-[11px] text-lab-text-secondary">
                  {step.desc}
                </p>
              </div>
            </div>

            <Link
              to={step.link}
              className="text-[11px] text-lab-accent hover:underline flex items-center gap-1 shrink-0 font-semibold mt-0.5"
            >
              <span>{step.linkText}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ResearchPath;
