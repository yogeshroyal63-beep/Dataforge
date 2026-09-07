import React from 'react';
import { Award, BarChart3, Info, CheckCircle2, Cpu, Brain } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { RESEARCH_FINDINGS_DATA, TOY_EXPERIMENT_DATA } from '../../data/bdhResearch.js';

/**
 * ResearchFindings — Displays published Pathway BDH-CQ findings clearly separated
 * from StateLens toy experiment measurements.
 */
export const ResearchFindings = () => {
  return (
    <Card variant="standard" className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-lab-accent" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            Published Research Findings & Toy Data Attribution
          </h2>
        </div>
        <Badge variant="research" size="sm">
          Explicit Attribution
        </Badge>
      </div>

      <p className="text-xs font-mono text-lab-text-secondary leading-relaxed">
        To prevent confusion between educational toy simulations and published research results, both are presented below with explicit origin labels.
      </p>

      {/* Two Delineated Findings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Card 1: Pathway Research Results */}
        <div className="p-5 rounded-xl bg-lab-secondary/60 border border-lab-purple/40 space-y-3.5">
          <div className="flex items-center justify-between border-b border-lab-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-lab-purple" />
              <h3 className="font-bold text-lab-purple uppercase">
                {RESEARCH_FINDINGS_DATA.modelName}
              </h3>
            </div>
            <Badge variant="research" size="sm">Pathway Research</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded bg-lab-bg border border-lab-border space-y-1">
              <span className="text-[10px] text-lab-text-muted uppercase block">Model Scale</span>
              <span className="text-sm font-bold text-lab-text-primary block">
                {RESEARCH_FINDINGS_DATA.parameterCount}
              </span>
            </div>

            <div className="p-2.5 rounded bg-lab-bg border border-lab-border space-y-1">
              <span className="text-[10px] text-lab-text-muted uppercase block">ARC-AGI-1 Benchmark</span>
              <span className="text-sm font-bold text-lab-purple block">
                {RESEARCH_FINDINGS_DATA.reportedScore}
              </span>
            </div>

            <div className="p-2.5 rounded bg-lab-bg border border-lab-border space-y-1">
              <span className="text-[10px] text-lab-text-muted uppercase block">Inference Cost</span>
              <span className="text-sm font-bold text-lab-accent block">
                {RESEARCH_FINDINGS_DATA.reportedCost}
              </span>
            </div>

            <div className="p-2.5 rounded bg-lab-bg border border-lab-border space-y-1">
              <span className="text-[10px] text-lab-text-muted uppercase block">Core Mechanism</span>
              <span className="text-xs font-semibold text-lab-text-secondary block">
                Recurrent Latent Reasoning
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-lab-bg/80 border border-lab-purple/30 text-[10px] text-lab-purple">
            <strong>Attribution:</strong> {RESEARCH_FINDINGS_DATA.attribution}
          </div>
        </div>

        {/* Card 2: StateLens Educational Toy Experiment */}
        <div className="p-5 rounded-xl bg-lab-secondary/60 border border-lab-accent/40 space-y-3.5">
          <div className="flex items-center justify-between border-b border-lab-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-lab-accent" />
              <h3 className="font-bold text-lab-accent uppercase">
                {TOY_EXPERIMENT_DATA.modelName}
              </h3>
            </div>
            <Badge variant="accent" size="sm">Phase 5 Benchmark</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded bg-lab-bg border border-lab-border space-y-1">
              <span className="text-[10px] text-lab-text-muted uppercase block">Model Scale</span>
              <span className="text-sm font-bold text-lab-text-primary block">
                0 Parameters (untrained)
              </span>
            </div>

            <div className="p-2.5 rounded bg-lab-bg border border-lab-border space-y-1">
              <span className="text-[10px] text-lab-text-muted uppercase block">Linear Attn (mean, N=2-20)</span>
              <span className="text-sm font-bold text-lab-accent block">
                ~50.8% Recall
              </span>
            </div>

            <div className="p-2.5 rounded bg-lab-bg border border-lab-border space-y-1">
              <span className="text-[10px] text-lab-text-muted uppercase block">Full Attention</span>
              <span className="text-sm font-bold text-lab-purple block">
                100.0% Recall
              </span>
            </div>

            <div className="p-2.5 rounded bg-lab-bg border border-lab-border space-y-1">
              <span className="text-[10px] text-lab-text-muted uppercase block">Core Mechanism</span>
              <span className="text-xs font-semibold text-lab-text-secondary block">
                16×10 State Matrix
              </span>
            </div>
          </div>

          <p className="text-[10px] text-lab-text-muted leading-relaxed">
            Computed live by this app&rsquo;s own benchmark (5 seeds averaged per condition) &mdash; see the Experiment page to reproduce.
          </p>

          <div className="p-2.5 rounded bg-lab-bg/80 border border-lab-accent/30 text-[10px] text-lab-accent">
            <strong>Attribution:</strong> {TOY_EXPERIMENT_DATA.attribution}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResearchFindings;
