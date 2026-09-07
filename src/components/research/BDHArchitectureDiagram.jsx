import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Cpu, Layers, Sparkles, Brain, CheckCircle } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { BDH_ARCHITECTURE_STAGES } from '../../data/bdhResearch.js';

const STAGE_ICONS = [Layers, Cpu, Brain, Sparkles, CheckCircle];

/**
 * BDHArchitectureDiagram — Interactive pipeline diagram explaining the 5 key stages
 * of Pathway's BDH-CQ architecture with interactive stage exploration.
 */
export const BDHArchitectureDiagram = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(2); // Synaptic state active by default
  const shouldReduceMotion = useReducedMotion();

  const activeStage = BDH_ARCHITECTURE_STAGES[activeStageIndex];

  return (
    <Card variant="standard" className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-lab-accent" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            BDH-CQ Architecture Pipeline
          </h2>
        </div>
        <Badge variant="research" size="sm">
          Pathway Research Architecture
        </Badge>
      </div>

      <p className="text-xs font-mono text-lab-text-secondary leading-relaxed">
        Click or focus any stage to inspect how information flows from in-context demonstration tokens to synaptic state updates and recurrent latent reasoning.
      </p>

      {/* Interactive Stages Row */}
      <div
        className="grid grid-cols-1 sm:grid-cols-5 gap-2.5"
        role="tablist"
        aria-label="BDH-CQ architecture stages"
      >
        {BDH_ARCHITECTURE_STAGES.map((stage, idx) => {
          const Icon = STAGE_ICONS[idx] || Cpu;
          const isActive = idx === activeStageIndex;

          return (
            <button
              key={stage.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`stage-panel-${stage.id}`}
              id={`stage-tab-${stage.id}`}
              onClick={() => setActiveStageIndex(idx)}
              className={`p-3.5 rounded-xl border text-left font-mono transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-lab-accent ${
                isActive
                  ? 'bg-lab-accent/15 border-lab-accent shadow-sm'
                  : 'bg-lab-secondary/50 border-lab-border hover:border-lab-border-light text-lab-text-secondary'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-lab-accent' : 'text-lab-text-muted'}`} />
                <span className="text-[10px] text-lab-text-muted font-bold">0{idx + 1}</span>
              </div>
              <div className={`text-xs font-bold leading-snug ${isActive ? 'text-lab-accent' : 'text-lab-text-primary'}`}>
                {stage.shortTitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Breakdown Panel */}
      {activeStage && (
        <motion.div
          key={activeStage.id}
          id={`stage-panel-${activeStage.id}`}
          role="tabpanel"
          aria-labelledby={`stage-tab-${activeStage.id}`}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-5 rounded-xl bg-lab-secondary/70 border border-lab-accent/30 space-y-3 font-mono"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border/50 pb-2">
            <h3 className="text-sm font-bold text-lab-text-primary">
              {activeStage.label}
            </h3>
            <span className="text-[10px] text-lab-accent font-semibold px-2 py-0.5 rounded bg-lab-accent/10 border border-lab-accent/20">
              Stage {activeStageIndex + 1} of 5
            </span>
          </div>

          <p className="text-xs text-lab-text-primary font-semibold leading-relaxed">
            {activeStage.summary}
          </p>

          <p className="text-xs text-lab-text-secondary leading-relaxed">
            {activeStage.details}
          </p>
        </motion.div>
      )}
    </Card>
  );
};

export default BDHArchitectureDiagram;
