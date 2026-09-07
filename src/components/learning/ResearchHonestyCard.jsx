import React from 'react';
import { ShieldCheck, Cpu, BookOpen, Compass } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * ResearchHonestyCard: Transparent disclosure distinguishing toy model experiments,
 * published research connections, and conceptual animations.
 */
export const ResearchHonestyCard = ({ className = '' }) => {
  return (
    <Card variant="standard" className={`p-6 sm:p-8 space-y-6 ${className}`}>
      <div className="flex items-center justify-between border-b border-lab-border/70 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-lab-accent" />
          <h3 className="text-base sm:text-lg font-bold text-lab-text-primary">
            What are we actually showing?
          </h3>
        </div>
        <Badge variant="research" size="sm">
          Technical Transparency
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: OUR EXPERIMENT */}
        <div className="p-4 rounded-xl bg-lab-secondary/50 border border-lab-border space-y-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-lab-accent" />
            <h4 className="text-xs font-mono font-bold uppercase text-lab-text-primary">
              Our Experiment
            </h4>
          </div>
          <p className="text-xs text-lab-accent font-mono font-semibold">
            Toy model
          </p>
          <p className="text-xs text-lab-text-secondary leading-relaxed">
            An isolated associative memory task running directly in your browser. Demonstrates core state dynamics without cloud overhead.
          </p>
        </div>

        {/* Column 2: RESEARCH CONNECTION */}
        <div className="p-4 rounded-xl bg-lab-secondary/50 border border-lab-border space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-lab-purple" />
            <h4 className="text-xs font-mono font-bold uppercase text-lab-text-primary">
              Research Connection
            </h4>
          </div>
          <p className="text-xs text-lab-purple font-mono font-semibold">
            Published BDH / BDH-CQ work
          </p>
          <p className="text-xs text-lab-text-secondary leading-relaxed">
            Pathway's formal architecture using bounded recurrent memory states for continuous real-time streaming adaptation.
          </p>
        </div>

        {/* Column 3: ILLUSTRATIONS */}
        <div className="p-4 rounded-xl bg-lab-secondary/50 border border-lab-border space-y-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-lab-warning" />
            <h4 className="text-xs font-mono font-bold uppercase text-lab-text-primary">
              Illustrations
            </h4>
          </div>
          <p className="text-xs text-lab-warning font-mono font-semibold">
            Conceptual visualizations
          </p>
          <p className="text-xs text-lab-text-secondary leading-relaxed">
            Diagrams, previews, and packing sliders designed to build intuition before interacting with quantitative model trials.
          </p>
        </div>
      </div>

      <div className="pt-2 text-center sm:text-left">
        <p className="text-xs font-mono text-lab-text-muted">
          We clearly distinguish our interactive toy experiment from published research.
        </p>
      </div>
    </Card>
  );
};

export default ResearchHonestyCard;
