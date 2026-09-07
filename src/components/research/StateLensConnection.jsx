import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, Scale, Brain, Cpu } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * StateLensConnection — Compares StateLens educational mechanics with real BDH/BDH-CQ research.
 */
export const StateLensConnection = () => {
  return (
    <Card variant="standard" className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-lab-accent" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            StateLens ↔ BDH-CQ Conceptual Connection
          </h2>
        </div>
        <Badge variant="research" size="sm">
          Comparative Analysis
        </Badge>
      </div>

      <p className="text-xs font-mono text-lab-text-secondary leading-relaxed">
        StateLens isolates a simple, inspectable mathematical analogy for fixed-state memory accumulation. Here is how that intuition maps to the actual BDH research architecture.
      </p>

      {/* Two-Column Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Left: StateLens Toy Model */}
        <div className="p-5 rounded-xl bg-lab-secondary/50 border border-lab-accent/30 space-y-3.5">
          <div className="flex items-center justify-between border-b border-lab-border pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-lab-accent" />
              <h3 className="font-bold text-lab-accent uppercase">StateLens Toy Model</h3>
            </div>
            <Badge variant="accent" size="sm">Educational Analogy</Badge>
          </div>

          <div className="space-y-2 text-[11px] text-lab-text-secondary">
            <div className="p-2 rounded bg-lab-bg border border-lab-border">
              <span className="font-bold text-lab-text-primary block">Input Space:</span>
              Toy KV facts (e.g. APPLE → 7)
            </div>
            <div className="p-2 rounded bg-lab-bg border border-lab-border">
              <span className="font-bold text-lab-text-primary block">State Dimension:</span>
              Small fixed 8 × 10 matrix
            </div>
            <div className="p-2 rounded bg-lab-bg border border-lab-border">
              <span className="font-bold text-lab-text-primary block">State Ingestion:</span>
              Direct outer-product sum: S_t = S_(t-1) + φ(K)Vᵀ
            </div>
            <div className="p-2 rounded bg-lab-bg border border-lab-border">
              <span className="font-bold text-lab-text-primary block">Reasoning / Query:</span>
              Single-step dot product: y = φ(Q)ᵀS / η
            </div>
            <div className="p-2 rounded bg-lab-bg border border-lab-border">
              <span className="font-bold text-lab-text-primary block">Goal:</span>
              Visualize memory compression and interference
            </div>
          </div>
        </div>

        {/* Right: Pathway BDH / BDH-CQ Research */}
        <div className="p-5 rounded-xl bg-lab-secondary/50 border border-lab-purple/30 space-y-3.5">
          <div className="flex items-center justify-between border-b border-lab-border pb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-lab-purple" />
              <h3 className="font-bold text-lab-purple uppercase">Pathway BDH-CQ Research</h3>
            </div>
            <Badge variant="research" size="sm">150M Parameter Model</Badge>
          </div>

          <div className="space-y-2 text-[11px] text-lab-text-secondary">
            <div className="p-2 rounded bg-lab-bg border border-lab-border">
              <span className="font-bold text-lab-text-primary block">Input Space:</span>
              Rich multi-modal / in-context task demonstrations
            </div>
            <div className="p-2 rounded bg-lab-bg border border-lab-border">
              <span className="font-bold text-lab-text-primary block">State Dimension:</span>
              High-dimensional sparse synaptic connectivity
            </div>
            <div className="p-2 rounded bg-lab-bg border border-lab-border">
              <span className="font-bold text-lab-text-primary block">State Ingestion:</span>
              Trained structural priors + fast dynamic synaptic updates
            </div>
            <div className="p-2 rounded bg-lab-bg border border-lab-border">
              <span className="font-bold text-lab-text-primary block">Reasoning / Query:</span>
              Multi-step recurrent latent reasoning cycles
            </div>
            <div className="p-2 rounded bg-lab-bg border border-lab-border">
              <span className="font-bold text-lab-text-primary block">Goal:</span>
              Sample-efficient abstract reasoning (ARC-AGI)
            </div>
          </div>
        </div>
      </div>

      {/* What they share vs What they do not share */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
        <div className="p-4 rounded-xl bg-lab-success/10 border border-lab-success/30 space-y-2">
          <div className="flex items-center gap-2 text-lab-success font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>What They Share Conceptually</span>
          </div>
          <ul className="space-y-1 text-[11px] text-lab-text-secondary list-disc list-inside">
            <li>Information is accumulated into an evolving internal state.</li>
            <li>Inference operates on constant memory without an unbounded KV cache.</li>
            <li>Later queries probe and interact directly with the compressed state.</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-lab-warning/10 border border-lab-warning/30 space-y-2">
          <div className="flex items-center gap-2 text-lab-warning font-bold">
            <XCircle className="w-4 h-4" />
            <span>What They Do NOT Share</span>
          </div>
          <ul className="space-y-1 text-[11px] text-lab-text-secondary list-disc list-inside">
            <li>StateLens uses an unparameterized 8×10 educational matrix.</li>
            <li>StateLens does not train neural networks or sparse neuron dynamics.</li>
            <li>StateLens benchmark results (26.4%) are not BDH-CQ research results.</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default StateLensConnection;
