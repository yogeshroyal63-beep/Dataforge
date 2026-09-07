import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Sparkles, BookOpen } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { ROUTES } from '../../routes/routes';

export const DashboardHeader = ({ displayName, email, createdAt }) => {
  return (
    <div className="p-6 rounded-2xl bg-lab-secondary/60 border border-lab-border flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      <div className="space-y-1.5 max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-lab-accent font-semibold font-mono">
            Researcher Workspace
          </span>
          <Badge variant="accent" size="sm" dot>Active Session</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-lab-text-primary">
          Welcome back, {displayName || 'Researcher'}
        </h1>
        <p className="text-xs text-lab-text-secondary leading-relaxed">
          Explore your saved attention experiments and observe how memory behavior changes across conditions.
        </p>
        {email && (
          <p className="text-[11px] text-lab-text-muted font-mono pt-1">
            {email} {createdAt ? `• Workspace initialized ${new Date(createdAt).toLocaleDateString()}` : ''}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Link to={ROUTES.EXPERIMENT}>
          <Button variant="primary" size="md" icon={FlaskConical}>
            Run Experiment
          </Button>
        </Link>
        <Link to={ROUTES.BDH_CQ}>
          <Button variant="secondary" size="md" icon={Sparkles}>
            Explore BDH-CQ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
