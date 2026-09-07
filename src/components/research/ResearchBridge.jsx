import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sliders, ArrowRight, Brain, Cpu, Sparkles } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { TOY_VS_RESEARCH_SLIDER_STEPS } from '../../data/bdhResearch.js';

/**
 * ResearchBridge — Interactive spectrum slider showing the progression from
 * the StateLens educational toy model to the full BDH-CQ research architecture.
 */
export const ResearchBridge = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const step = TOY_VS_RESEARCH_SLIDER_STEPS[activeStepIndex];

  return (
    <Card variant="standard" className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-lab-accent" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            Toy Model to Research Architecture Spectrum
          </h2>
        </div>
        <Badge variant="research" size="sm">
          Educational Abstraction Bridge
        </Badge>
      </div>

      <p className="text-xs font-mono text-lab-text-secondary leading-relaxed">
        Drag the spectrum slider or click the level indicators to inspect how memory representations, feature spaces, and learning dynamics scale up from the StateLens toy lab to Pathway&rsquo;s BDH-CQ research model.
      </p>

      {/* Spectrum Range Slider */}
      <div className="p-4 rounded-xl bg-lab-secondary/50 border border-lab-border space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs">
          <span className="text-lab-accent font-semibold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            Educational Abstraction
          </span>
          <span className="text-lab-purple font-semibold flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" />
            Full Research Architecture
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={TOY_VS_RESEARCH_SLIDER_STEPS.length - 1}
          value={activeStepIndex}
          onChange={(e) => setActiveStepIndex(Number(e.target.value))}
          aria-label="Spectrum from toy abstraction to research model"
          aria-valuemin={0}
          aria-valuemax={TOY_VS_RESEARCH_SLIDER_STEPS.length - 1}
          aria-valuenow={activeStepIndex}
          aria-valuetext={`Level ${activeStepIndex + 1}: ${step.title}`}
          className="w-full h-2 bg-lab-surface rounded-lg appearance-none cursor-pointer accent-lab-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-accent focus-visible:ring-offset-2 focus-visible:ring-offset-lab-bg"
        />

        <div className="grid grid-cols-4 gap-1 text-[10px] text-center text-lab-text-muted" aria-hidden="true">
          <span>01. StateLens Toy</span>
          <span>02. Linear Attn</span>
          <span>03. BDH Synaptic</span>
          <span>04. BDH-CQ Latent</span>
        </div>
      </div>

      {/* Active Step Details Card */}
      <motion.div
        key={activeStepIndex}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-5 rounded-xl bg-lab-secondary/70 border border-lab-border space-y-4 font-mono text-xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border/50 pb-2">
          <h3 className="text-sm font-bold text-lab-text-primary">
            Level {activeStepIndex + 1}: {step.title}
          </h3>
          <Badge variant={activeStepIndex >= 2 ? 'research' : 'accent'} size="sm">
            {step.purpose}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-lab-bg border border-lab-border space-y-1">
            <span className="text-[10px] text-lab-text-muted uppercase block">Memory State Structure</span>
            <span className="text-xs font-bold text-lab-text-primary block">{step.stateSize}</span>
          </div>

          <div className="p-3 rounded-lg bg-lab-bg border border-lab-border space-y-1">
            <span className="text-[10px] text-lab-text-muted uppercase block">Feature / Activation Space</span>
            <span className="text-xs font-bold text-lab-accent block">{step.featureSpace}</span>
          </div>

          <div className="p-3 rounded-lg bg-lab-bg border border-lab-border space-y-1">
            <span className="text-[10px] text-lab-text-muted uppercase block">Value Representation</span>
            <span className="text-xs font-semibold text-lab-text-secondary block">{step.valueSpace}</span>
          </div>

          <div className="p-3 rounded-lg bg-lab-bg border border-lab-border space-y-1">
            <span className="text-[10px] text-lab-text-muted uppercase block">Reasoning / Output Engine</span>
            <span className="text-xs font-semibold text-lab-purple block">{step.reasoning}</span>
          </div>
        </div>
      </motion.div>
    </Card>
  );
};

export default ResearchBridge;
