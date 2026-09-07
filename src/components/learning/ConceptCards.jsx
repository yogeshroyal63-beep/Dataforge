import React from 'react';
import { Eye, Layers, AlertTriangle, ArrowDown, Network } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * ConceptCards: The 3 core pillars of the educational narrative.
 * 1) Full Attention (Look back at the past)
 * 2) Linear Attention (Maintain a running state)
 * 3) The Trade-off (Compression can introduce interference)
 */
export const ConceptCards = ({ className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {/* CARD 1 — FULL ATTENTION */}
      <Card
        variant="interactive"
        className="flex flex-col justify-between border-t-2 border-t-lab-purple/80 hover:border-lab-purple"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-lab-purple uppercase font-semibold">
              Look back at the past
            </span>
            <Badge variant="research" size="sm">Full Attention</Badge>
          </div>

          <h3 className="text-xl font-bold text-lab-text-primary">
            Full Attention
          </h3>

          {/* Visual: Multiple previous tokens connected to current query */}
          <div className="p-4 rounded-lg bg-lab-bg/80 border border-lab-border space-y-2">
            <div className="flex items-center justify-between gap-1">
              {['K₁', 'K₂', 'K₃', 'K₄'].map((tok) => (
                <span
                  key={tok}
                  className="px-2 py-1 rounded bg-lab-secondary text-[11px] font-mono font-medium text-lab-text-secondary border border-lab-border/70"
                >
                  {tok}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-center text-lab-purple text-xs font-mono gap-1 py-1">
              <span>↓↓↓↓ (Direct pairwise comparison)</span>
            </div>
            <div className="p-1.5 rounded bg-lab-purple/15 text-center text-xs font-mono text-lab-purple font-bold border border-lab-purple/40">
              Current Query (Q)
            </div>
          </div>

          <p className="text-xs text-lab-text-secondary leading-relaxed">
            The current query can directly interact with previous information. Every historical token remains distinct in storage.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-lab-border/60 flex items-center justify-between text-xs font-mono text-lab-text-muted">
          <span>Memory access:</span>
          <span className="text-lab-purple font-semibold">grows with sequence</span>
        </div>
      </Card>

      {/* CARD 2 — LINEAR ATTENTION */}
      <Card
        variant="interactive"
        className="flex flex-col justify-between border-t-2 border-t-lab-accent/80 hover:border-lab-accent"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-lab-accent uppercase font-semibold">
              Maintain a running state
            </span>
            <Badge variant="accent" size="sm">Linear Attention</Badge>
          </div>

          <h3 className="text-xl font-bold text-lab-text-primary">
            Linear Attention
          </h3>

          {/* Visual: Multiple inputs flowing into one fixed state representation */}
          <div className="p-4 rounded-lg bg-lab-bg/80 border border-lab-border space-y-2">
            <div className="flex items-center justify-between gap-1">
              {['In₁', 'In₂', 'In₃', 'In₄'].map((tok) => (
                <span
                  key={tok}
                  className="px-1.5 py-0.5 rounded bg-lab-secondary text-[10px] font-mono text-lab-text-secondary border border-lab-border/70"
                >
                  {tok}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-center text-lab-accent text-xs font-mono py-1">
              <ArrowDown className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="p-2 rounded bg-lab-accent/15 text-center text-xs font-mono text-lab-accent font-bold border border-lab-accent/40 flex items-center justify-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Fixed Running State Matrix (S_t)</span>
            </div>
          </div>

          <p className="text-xs text-lab-text-secondary leading-relaxed">
            Instead of repeatedly comparing against the entire history, information can be accumulated into a running state.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-lab-border/60 flex items-center justify-between text-xs font-mono text-lab-text-muted">
          <span>State footprint:</span>
          <span className="text-lab-accent font-semibold">fixed-size</span>
        </div>
      </Card>

      {/* CARD 3 — THE TRADE-OFF */}
      <Card
        variant="interactive"
        className="flex flex-col justify-between border-t-2 border-t-lab-warning/80 hover:border-lab-warning"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-lab-warning uppercase font-semibold">
              Compression introduces interference
            </span>
            <Badge variant="warning" size="sm">The Trade-off</Badge>
          </div>

          <h3 className="text-xl font-bold text-lab-text-primary">
            The Trade-off
          </h3>

          {/* Visual: Memory cells gradually becoming crowded */}
          <div className="p-4 rounded-lg bg-lab-bg/80 border border-lab-border space-y-2">
            <div className="grid grid-cols-6 gap-1 py-1">
              {Array.from({ length: 18 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-3 rounded-xs border text-[8px] flex items-center justify-center font-mono ${
                    idx > 10
                      ? 'bg-lab-danger/30 border-lab-danger text-lab-danger'
                      : idx > 5
                      ? 'bg-lab-warning/20 border-lab-warning text-lab-warning'
                      : 'bg-lab-secondary border-lab-border text-lab-text-muted'
                  }`}
                >
                  {idx > 10 ? '×' : '•'}
                </div>
              ))}
            </div>
            <div className="text-[10px] font-mono text-center text-lab-warning pt-1 border-t border-lab-border/40">
              Superposition density increases with sequence load
            </div>
          </div>

          <p className="text-xs text-lab-text-secondary leading-relaxed">
            A compact state is efficient to maintain, but different facts can interfere with one another as more information is packed into it.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-lab-border/60 flex items-center justify-between text-xs font-mono text-lab-text-muted">
          <span>State dynamics:</span>
          <span className="text-lab-warning font-semibold">more facts → more interference</span>
        </div>
      </Card>
    </div>
  );
};

export default ConceptCards;
