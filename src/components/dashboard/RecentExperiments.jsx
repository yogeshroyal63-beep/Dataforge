import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, XCircle, Eye, Layers, FlaskConical } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { ROUTES } from '../../routes/routes';
import { getRecentExperiments } from '../../utils/experimentAnalytics';

export const RecentExperiments = ({ experiments = [] }) => {
  const recent = getRecentExperiments(experiments, 5);
  const hasRuns = recent.length > 0;

  return (
    <Card variant="standard" className="p-5 space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-lab-border pb-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
            Recent Experiment Runs
          </h2>
          <p className="text-[11px] text-lab-text-muted mt-0.5">
            Latest saved attention probe results.
          </p>
        </div>
        {hasRuns && (
          <Link
            to={ROUTES.DASHBOARD_HISTORY}
            className="text-xs text-lab-accent hover:underline flex items-center gap-1"
          >
            <span>View All ({experiments.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {hasRuns ? (
        <div className="space-y-2.5">
          {recent.map((exp) => (
            <div
              key={exp.id}
              className="p-3.5 rounded-xl bg-lab-secondary/40 border border-lab-border hover:border-lab-border-light transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-lab-accent">
                    Probe: {exp.query}
                  </span>
                  <span className="text-lab-text-muted">→</span>
                  <span className="text-lab-text-primary font-semibold">
                    Expected: {exp.expectedValue}
                  </span>
                  <Badge variant="research" size="sm">N = {exp.factCount}</Badge>
                </div>
                <span className="text-[10px] text-lab-text-muted block">
                  {new Date(exp.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  •{' '}
                  {new Date(exp.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Model Predictions summary */}
                <div className="flex items-center gap-3">
                  {exp.fullAttention && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-lab-bg border border-lab-border text-[11px]">
                      <Eye className="w-3 h-3 text-lab-purple" />
                      <span className="text-lab-text-muted">Full:</span>
                      <span className="font-bold text-lab-text-primary">{exp.fullAttention.prediction}</span>
                      {exp.fullAttention.isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-lab-accent" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-lab-danger" />
                      )}
                    </div>
                  )}

                  {exp.linearAttention && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-lab-bg border border-lab-border text-[11px]">
                      <Layers className="w-3 h-3 text-lab-accent" />
                      <span className="text-lab-text-muted">Linear:</span>
                      <span className="font-bold text-lab-text-primary">{exp.linearAttention.prediction}</span>
                      {exp.linearAttention.isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-lab-accent" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-lab-warning" />
                      )}
                    </div>
                  )}
                </div>

                <Link to={ROUTES.DASHBOARD_HISTORY_DETAIL(exp.id)}>
                  <Button variant="ghost" size="sm" icon={ArrowRight}>
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 space-y-3">
          <p className="text-xs text-lab-text-secondary">
            No saved experiments found in your personal history.
          </p>
          <Link to={ROUTES.EXPERIMENT}>
            <Button variant="secondary" size="sm" icon={FlaskConical}>
              Run Your First Experiment
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default RecentExperiments;
