import React from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Info } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * ResearchBoundaryCard — Scientific honesty card establishing clear boundaries
 * between StateLens educational mechanics and actual research.
 */
export const ResearchBoundaryCard = () => {
  return (
    <Card variant="standard" className="p-6 space-y-5 border-lab-warning/40 bg-lab-secondary/80">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-lab-warning" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            Scientific Boundary & Honesty Disclosure
          </h2>
        </div>
        <Badge variant="warning" size="sm">
          Auditable Boundaries
        </Badge>
      </div>

      <p className="text-xs font-mono text-lab-text-secondary leading-relaxed">
        StateLens is built for educational transparency. It is critical to maintain explicit scientific boundaries regarding what this application demonstrates and what it does not.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
        {/* What StateLens Demonstrates */}
        <div className="p-4 rounded-xl bg-lab-bg/90 border border-lab-success/40 space-y-2.5">
          <div className="flex items-center gap-2 text-lab-success font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <h3 className="text-xs uppercase">What StateLens Demonstrates</h3>
          </div>
          <ul className="space-y-1.5 text-[11px] text-lab-text-secondary list-disc list-inside leading-relaxed">
            <li>The mathematical mechanics of scaled dot-product vs recurrent outer-product state updates.</li>
            <li>How fixed-dimensional memory compression can lead to capacity interference.</li>
            <li>Why constant state memory yields $O(1)$ per-step inference speed.</li>
            <li>An observable step-by-step trace of associative memory probe queries.</li>
          </ul>
        </div>

        {/* What StateLens Does NOT Demonstrate */}
        <div className="p-4 rounded-xl bg-lab-bg/90 border border-lab-warning/40 space-y-2.5">
          <div className="flex items-center gap-2 text-lab-warning font-bold">
            <XCircle className="w-4 h-4 shrink-0" />
            <h3 className="text-xs uppercase">What StateLens Does NOT Demonstrate</h3>
          </div>
          <ul className="space-y-1.5 text-[11px] text-lab-text-secondary list-disc list-inside leading-relaxed">
            <li>The full architecture, learned weights, or training dynamics of Pathway&rsquo;s BDH.</li>
            <li>The 150M parameter BDH-CQ model or its multi-layer latent reasoning loops.</li>
            <li>Any published benchmark reproduction of ARC-AGI or production LLM metrics.</li>
            <li>Real biological neural dynamics or hardware-level neuromorphic execution.</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ResearchBoundaryCard;
