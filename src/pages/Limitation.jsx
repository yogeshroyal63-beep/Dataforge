import React from 'react';
import { AlertOctagon, Layers, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const Limitation = () => {
  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Page Header */}
      <SectionHeader
        eyebrow="Theoretical Boundary"
        title="The important failure mode"
        description="Understanding the fundamental difference between context window limits and recurrent state interference."
        align="left"
      />

      {/* Main Thesis Banner */}
      <Card variant="standard" className="border-l-4 border-l-lab-danger p-6 sm:p-8 space-y-4">
        <Badge variant="danger" size="sm">Core Failure Mode</Badge>
        <h2 className="text-2xl sm:text-3xl font-bold text-lab-text-primary">
          It doesn't simply "run out of context."
        </h2>
        <p className="text-base sm:text-lg text-lab-text-secondary leading-relaxed max-w-3xl">
          A fixed memory state can experience interference, causing information to degrade without an obvious system failure.
        </p>
      </Card>

      {/* Comparative Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="standard" className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-lab-purple" />
            <h3 className="font-bold text-lab-text-primary">Full Attention Failure: Hard Truncation</h3>
          </div>
          <p className="text-sm text-lab-text-secondary leading-relaxed">
            In standard Softmax Attention, when sequence length exceeds context window limits (<span className="font-mono text-xs text-lab-purple">N &gt; N_max</span>), tokens outside the window are discarded completely. The boundary is sharp, discrete, and predictable.
          </p>
          <div className="p-3 rounded bg-lab-secondary/50 border border-lab-border text-xs font-mono text-lab-text-muted">
            Symptom: Out of bounds error or hard token cutoff.
          </div>
        </Card>

        <Card variant="standard" className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-lab-accent" />
            <h3 className="font-bold text-lab-text-primary">Linear Attention Failure: State Interference</h3>
          </div>
          <p className="text-sm text-lab-text-secondary leading-relaxed">
            In Linear Attention and recurrent architectures, the state matrix continues accepting tokens indefinitely. However, as inner products overlap in the fixed d×d matrix, older key-value associations become corrupted by newer ones.
          </p>
          <div className="p-3 rounded bg-lab-secondary/50 border border-lab-border text-xs font-mono text-lab-danger/90">
            Symptom: Subtle hallucinations, misattributions, and silent accuracy decay.
          </div>
        </Card>
      </div>

      {/* Phase Label Notice */}
      <div className="p-4 rounded-xl bg-lab-surface border border-lab-border text-xs font-mono text-lab-text-muted flex items-center justify-between">
        <span>Educational narrative and mathematical interference proofs scheduled for Phase 6.</span>
        <Badge variant="default" size="sm">Phase 1 Foundation</Badge>
      </div>
    </div>
  );
};

export default Limitation;
