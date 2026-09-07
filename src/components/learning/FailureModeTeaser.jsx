import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, ArrowRight, ArrowDown, XCircle } from 'lucide-react';
import { ROUTES } from '../../routes/routes';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';

/**
 * FailureModeTeaser: Teases the state interference failure mode before linking to /limitation.
 */
export const FailureModeTeaser = ({ className = '' }) => {
  return (
    <Card
      variant="standard"
      className={`p-6 sm:p-8 md:p-10 border-l-4 border-l-lab-danger space-y-6 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <Badge variant="danger" size="sm">
            State Interference
          </Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-lab-text-primary">
            The interesting part isn't when it works.
          </h2>
          <p className="text-lg sm:text-xl font-bold text-lab-danger">
            It's when memory starts to interfere.
          </p>
        </div>
        <Badge variant="default" size="sm">
          Conceptual illustration
        </Badge>
      </div>

      {/* Visual Sequence of Corruption */}
      <div className="p-4 sm:p-5 rounded-xl bg-lab-bg/90 border border-lab-border space-y-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-lab-text-muted uppercase">
          <span>Interference Progression</span>
          <span className="text-lab-danger">Superposition Overwrite</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center font-mono text-xs text-center">
          {/* Step 1 */}
          <div className="p-3 rounded-lg bg-lab-secondary border border-lab-accent/40 text-lab-accent">
            <span className="text-[10px] text-lab-text-muted block">1. Clean Fact</span>
            <span className="font-bold">KIWI = 9</span>
          </div>

          <div className="flex justify-center text-lab-text-muted">
            <ArrowRight className="w-4 h-4 hidden sm:block" />
            <ArrowDown className="w-4 h-4 sm:hidden" />
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-lg bg-lab-secondary border border-lab-warning/40 text-lab-warning">
            <span className="text-[10px] text-lab-text-muted block">2. Influx</span>
            <span className="font-bold">+ 10 New Facts</span>
          </div>

          <div className="flex justify-center text-lab-text-muted">
            <ArrowRight className="w-4 h-4 hidden sm:block" />
            <ArrowDown className="w-4 h-4 sm:hidden" />
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-lg bg-lab-danger/10 border border-lab-danger text-lab-danger">
            <span className="text-[10px] text-lab-danger block">3. Query: KIWI</span>
            <span className="font-bold flex items-center justify-center gap-1">
              <XCircle className="w-3.5 h-3.5 inline" /> Recall: 2 (Corrupted)
            </span>
          </div>
        </div>

        <p className="text-xs text-lab-text-secondary leading-relaxed pt-2 border-t border-lab-border/40">
          In fixed-size recurrent attention, earlier associations are not rejected with an error; they gradually blur into overlapping weights as new tokens enter the running state.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <p className="text-xs text-lab-text-muted max-w-xl">
          Learn how interference differs fundamentally from standard Transformer context truncation.
        </p>
        <Link to={ROUTES.LIMITATION} className="w-full sm:w-auto">
          <Button variant="danger" size="md" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
            Understand the Failure Mode
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default FailureModeTeaser;
