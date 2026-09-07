import React, { useState } from 'react';
import { Sliders, Layers, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * ConceptualFactSlider: Interactive "Poke It" section.
 * Lets the learner intuitively see how packing facts into a fixed-size space causes density to rise.
 * Purely conceptual; zero fake accuracy scores.
 */
export const ConceptualFactSlider = ({ className = '' }) => {
  const [factCount, setFactCount] = useState(3);

  const allAvailableFacts = [
    { key: 'APPLE', value: 7 },
    { key: 'MANGO', value: 3 },
    { key: 'KIWI', value: 9 },
    { key: 'BERRY', value: 4 },
    { key: 'LEMON', value: 2 },
    { key: 'PEACH', value: 8 },
    { key: 'GRAPE', value: 5 },
    { key: 'MELON', value: 1 },
    { key: 'PLUM', value: 6 },
    { key: 'CHERRY', value: 2 },
    { key: 'FIG', value: 7 },
    { key: 'LIME', value: 4 },
  ];

  const visibleFacts = allAvailableFacts.slice(0, factCount);

  // Categorical density state based on fact count
  const getStateStatus = (count) => {
    if (count <= 5) {
      return {
        label: 'Comfortable',
        variant: 'success',
        icon: CheckCircle2,
        desc: 'Low information density. Vector representations have low angular overlap.',
        colorText: 'text-lab-success',
        matrixDensity: 'opacity-40',
      };
    }
    if (count <= 8) {
      return {
        label: 'Getting crowded',
        variant: 'warning',
        icon: AlertCircle,
        desc: 'Moderate density. New vectors begin competing for remaining state capacity.',
        colorText: 'text-lab-warning',
        matrixDensity: 'opacity-70',
      };
    }
    return {
      label: 'Potential interference',
      variant: 'danger',
      icon: ShieldAlert,
      desc: 'High density. Packed representations overlap in the fixed space, risking state corruption.',
      colorText: 'text-lab-danger',
      matrixDensity: 'opacity-100',
    };
  };

  const status = getStateStatus(factCount);
  const StatusIcon = status.icon;

  return (
    <Card variant="standard" className={`p-6 sm:p-8 space-y-8 ${className}`}>
      {/* Header & Watermark */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-lab-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-lab-accent" />
            <h3 className="text-lg sm:text-xl font-bold text-lab-text-primary">
              What happens when we keep adding facts?
            </h3>
          </div>
          <p className="text-xs text-lab-text-secondary mt-1">
            Drag the slider to watch how fixed-size memory behaves as more facts are introduced.
          </p>
        </div>
        <Badge variant="default" size="sm">
          Conceptual visualization — not the benchmark
        </Badge>
      </div>

      {/* Slider Interactive Control */}
      <div className="space-y-3 bg-lab-secondary/50 p-5 rounded-xl border border-lab-border">
        <div className="flex items-center justify-between">
          <label
            htmlFor="conceptual-facts-slider"
            className="text-xs font-mono font-semibold text-lab-text-secondary uppercase tracking-wider"
          >
            Number of Facts to Pack
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-lab-text-muted">Facts:</span>
            <span className="font-mono text-base font-bold text-lab-accent bg-lab-surface px-3 py-1 rounded-md border border-lab-accent/30 shadow-xs">
              {factCount}
            </span>
          </div>
        </div>

        <input
          id="conceptual-facts-slider"
          type="range"
          min={3}
          max={12}
          step={1}
          value={factCount}
          onChange={(e) => setFactCount(Number(e.target.value))}
          aria-label="Conceptual number of facts to pack into running state"
          aria-valuemin={3}
          aria-valuemax={12}
          aria-valuenow={factCount}
          aria-valuetext={`${factCount} facts (${status.label})`}
          className="w-full h-2.5 bg-lab-surface rounded-lg appearance-none cursor-pointer accent-lab-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-accent focus-visible:ring-offset-2 focus-visible:ring-offset-lab-bg border border-lab-border"
        />

        <div className="flex justify-between text-[11px] font-mono text-lab-text-muted" aria-hidden="true">
          <span>3 Facts (Sparse)</span>
          <span>7 Facts (Moderate)</span>
          <span>12 Facts (Dense)</span>
        </div>
      </div>

      {/* Side-by-Side: Incoming Stream vs Fixed State Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Input Fact Tokens */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-lab-text-secondary">
            <span>Incoming Stream ({factCount} Facts)</span>
            <span className="text-[10px] text-lab-text-muted">Sequential order</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {visibleFacts.map((fact, idx) => (
              <div
                key={fact.key}
                className="p-2.5 rounded-lg border border-lab-border bg-lab-surface font-mono text-xs flex items-center justify-between transition-all"
              >
                <span className="font-semibold text-lab-text-primary text-[11px]">{fact.key}</span>
                <span className="text-[10px] text-lab-accent font-bold px-1.5 py-0.5 rounded bg-lab-secondary">
                  ={fact.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Fixed State Crowding Visualizer */}
        <div className="p-5 rounded-xl bg-lab-secondary/80 border border-lab-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-lab-purple" />
              <span className="text-xs font-mono font-semibold uppercase text-lab-text-primary">
                Fixed Running State
              </span>
            </div>
            <Badge variant={status.variant} size="sm">
              <StatusIcon className="w-3 h-3 mr-1 inline" />
              State: {status.label}
            </Badge>
          </div>

          {/* Fixed-Dimension Matrix Grid */}
          <div className="p-3.5 rounded-lg bg-lab-bg/90 border border-lab-border/80">
            <div className="grid grid-cols-6 gap-1.5 py-1">
              {Array.from({ length: 24 }).map((_, i) => {
                const isOccupied = i < factCount * 2;
                const isOverlapped = factCount >= 9 && i < (factCount - 6) * 3;
                return (
                  <div
                    key={i}
                    className={`h-4 rounded-xs border transition-all duration-300 flex items-center justify-center font-mono text-[9px] ${
                      isOverlapped
                        ? 'bg-lab-danger/30 border-lab-danger text-lab-danger font-bold animate-pulse'
                        : isOccupied
                        ? factCount > 8
                          ? 'bg-lab-danger/20 border-lab-danger/50 text-lab-danger'
                          : factCount > 5
                          ? 'bg-lab-warning/20 border-lab-warning/50 text-lab-warning'
                          : 'bg-lab-accent/20 border-lab-accent/50 text-lab-accent'
                        : 'bg-lab-surface border-lab-border/40 text-lab-text-muted/40'
                    }`}
                  >
                    {isOverlapped ? '!' : isOccupied ? '•' : ''}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-lab-text-secondary leading-relaxed">
              {status.desc}
            </p>
            <p className="text-[10px] font-mono text-lab-text-muted">
              Note: The state matrix dimensions never expand; only the superposition density changes.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConceptualFactSlider;
