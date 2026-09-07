import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, Brain, RotateCcw, CheckCircle, Zap } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const REASONING_STEPS = [
  {
    step: 0,
    title: 'Initial Model Prior',
    badge: 'Step 0: Baseline',
    description: 'The static trained model weights prior to seeing any in-context demonstration examples.',
    stateLabel: 'S₀ (Pretrained Base Weights)',
    latentActivity: 'Quiet / Baseline',
    outputState: 'Awaiting task demonstration examples.',
  },
  {
    step: 1,
    title: 'In-Context Example 1',
    badge: 'Step 1: Ingestion',
    description: 'First demonstration is presented. Model applies fast synaptic plasticity to update internal state.',
    stateLabel: 'S₁ = S₀ + ΔW(Ex₁)',
    latentActivity: 'Initial pattern recognition',
    outputState: 'Latent space forms initial hypothesis.',
  },
  {
    step: 2,
    title: 'In-Context Example 2',
    badge: 'Step 2: Refinement',
    description: 'Second demonstration reinforces the invariant rule structure, updating synaptic weights without token generation.',
    stateLabel: 'S₂ = S₁ + ΔW(Ex₂)',
    latentActivity: 'Rule reinforcement & disambiguation',
    outputState: 'Synaptic connections tuned to task transformation.',
  },
  {
    step: 3,
    title: 'In-Context Example 3',
    badge: 'Step 3: Convergence',
    description: 'Third demonstration locks in the abstract mapping rule into the recurrent memory state.',
    stateLabel: 'S₃ = S₂ + ΔW(Ex₃)',
    latentActivity: 'Converged task representation',
    outputState: 'Working memory fully configured for probe query.',
  },
  {
    step: 4,
    title: 'Task Query & Latent Reasoning',
    badge: 'Step 4: Recurrent Latent Reasoning',
    description: 'Unsolved target grid/query is received. BDH-CQ executes multiple iterative computational loops entirely in latent state — with zero verbalized chain-of-thought tokens.',
    stateLabel: 'Latent Reasoning: S* = f_recurrent(S₃, Query)',
    latentActivity: 'Multi-step iterative latent convergence',
    outputState: 'Direct projection yields final verified solution.',
  },
];

/**
 * MemoryEvolutionDemo — Interactive demonstration of BDH-CQ in-context synaptic adaptation
 * and recurrent latent reasoning.
 */
export const MemoryEvolutionDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const stepInfo = REASONING_STEPS[currentStep];

  return (
    <Card variant="standard" className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-lab-accent" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            BDH-CQ: In-Context Adaptation & Latent Reasoning
          </h2>
        </div>
        <Badge variant="research" size="sm">
          Recurrent Latent Dynamics
        </Badge>
      </div>

      <p className="text-xs font-mono text-lab-text-secondary leading-relaxed">
        Step through how BDH-CQ assimilates task examples into an evolving synaptic state and then performs iterative reasoning directly in latent space without generating tokens.
      </p>

      {/* Step Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
        {REASONING_STEPS.map((s, idx) => {
          const isSelected = idx === currentStep;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-lab-accent/15 border-lab-accent text-lab-accent font-bold shadow-xs'
                  : 'bg-lab-secondary/40 border-lab-border hover:border-lab-border-light text-lab-text-secondary'
              }`}
            >
              <span className="text-[10px] text-lab-text-muted block">Step {idx}</span>
              <span className="text-xs block truncate">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Step Display */}
      <motion.div
        key={currentStep}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-5 rounded-xl bg-lab-secondary/60 border border-lab-border space-y-4 font-mono text-xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border/50 pb-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-lab-accent" />
            <h3 className="text-sm font-bold text-lab-text-primary">{stepInfo.title}</h3>
          </div>
          <Badge variant={currentStep === 4 ? 'accent' : 'research'} size="sm">
            {stepInfo.badge}
          </Badge>
        </div>

        <p className="text-xs text-lab-text-secondary leading-relaxed">
          {stepInfo.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-lab-bg border border-lab-border space-y-1">
            <span className="text-[10px] text-lab-text-muted uppercase block">Synaptic State Representation</span>
            <span className="text-xs font-bold text-lab-accent block break-all">
              {stepInfo.stateLabel}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-lab-bg border border-lab-border space-y-1">
            <span className="text-[10px] text-lab-text-muted uppercase block">Latent Reasoning Status</span>
            <span className="text-xs font-bold text-lab-purple block">
              {stepInfo.latentActivity}
            </span>
          </div>
        </div>

        {currentStep === 4 && (
          <div className="p-3 rounded-lg bg-lab-purple/10 border border-lab-purple/30 text-[11px] text-lab-purple font-semibold flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Latent Reasoning vs Chain-of-Thought:</strong> Instead of generating 1,000+ verbalized intermediate reasoning tokens, BDH-CQ updates its latent state iteratively until the solution converges.
            </span>
          </div>
        )}
      </motion.div>

      {/* Step Actions */}
      <div className="flex items-center justify-between pt-1">
        <Button
          variant="ghost"
          size="sm"
          icon={RotateCcw}
          onClick={() => setCurrentStep(0)}
          disabled={currentStep === 0}
        >
          Reset Demo
        </Button>

        <Button
          variant="primary"
          size="sm"
          icon={ArrowRight}
          onClick={() => setCurrentStep((prev) => (prev < REASONING_STEPS.length - 1 ? prev + 1 : 0))}
        >
          {currentStep < REASONING_STEPS.length - 1 ? 'Next Step →' : 'Restart Demo ↺'}
        </Button>
      </div>
    </Card>
  );
};

export default MemoryEvolutionDemo;
