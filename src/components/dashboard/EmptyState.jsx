import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Sparkles, BookOpen } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { ROUTES } from '../../routes/routes';

export const EmptyState = () => {
  return (
    <Card variant="standard" className="p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto font-mono">
      <div className="w-14 h-14 rounded-2xl bg-lab-secondary border border-lab-border flex items-center justify-center mx-auto text-lab-accent shadow-inner">
        <FlaskConical className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-lab-text-primary">
          No saved experiments yet.
        </h2>
        <p className="text-xs sm:text-sm text-lab-text-secondary max-w-lg mx-auto leading-relaxed">
          Run the StateLens experiment and save your results to start building your personal research history.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link to={ROUTES.EXPERIMENT}>
          <Button variant="primary" size="md" icon={FlaskConical}>
            Run Your First Experiment
          </Button>
        </Link>
        <Link to={ROUTES.BDH_CQ}>
          <Button variant="secondary" size="md" icon={Sparkles}>
            Explore BDH-CQ Research
          </Button>
        </Link>
      </div>

      <div className="pt-4 border-t border-lab-border/60 text-[11px] text-lab-text-muted">
        <span>StateLens computes deterministic attention models directly in your browser.</span>
      </div>
    </Card>
  );
};

export default EmptyState;
