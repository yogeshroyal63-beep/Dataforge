import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, ArrowRight, FlaskConical, Layers, Sparkles, Scale, Info } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import BDHArchitectureDiagram from '../components/research/BDHArchitectureDiagram';
import SynapticMemoryVisual from '../components/research/SynapticMemoryVisual';
import MemoryEvolutionDemo from '../components/research/MemoryEvolutionDemo';
import StateLensConnection from '../components/research/StateLensConnection';
import ResearchBridge from '../components/research/ResearchBridge';
import ResearchFindings from '../components/research/ResearchFindings';
import ResearchBoundaryCard from '../components/research/ResearchBoundaryCard';
import ResearchSources from '../components/research/ResearchSources';
import { ROUTES } from '../routes/routes';

/**
 * BDHCQ Page — Phase 6 Research Module & Technical Visualization
 *
 * Provides a rigorous, educational explanation of how StateLens toy memory dynamics
 * connect conceptually to Pathway's BDH & BDH-CQ research architectures.
 */
export const BDHCQ = () => {
  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
      {/* Page Header */}
      <div className="space-y-3 border-b border-lab-border pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-lab-accent">
            Pathway Research Module
          </span>
          <Badge variant="research" size="sm" dot>
            Research & Technical Deep-Dive
          </Badge>
          <Badge variant="accent" size="sm">
            BDH / BDH-CQ
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-lab-text-primary">
          From Linear Attention to BDH-CQ: Memory as Synaptic State & Recurrent Latent Reasoning
        </h1>

        <p className="text-sm text-lab-text-secondary leading-relaxed max-w-3xl">
          Explore how the fixed-state memory compression principles observed in the StateLens toy laboratory connect to Pathway&rsquo;s research in high-dimensional synaptic architectures and latent in-context reasoning.
        </p>
      </div>

      {/* SECTION 1: Why This Matters */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-lab-accent" />
          <h2 className="text-xl font-bold font-mono text-lab-text-primary">
            1. Why This Matters: The Memory & Reasoning Challenge
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <Card variant="standard" className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-lab-purple uppercase">
              The Standard Attention Dilemma
            </h3>
            <p className="text-lab-text-secondary leading-relaxed">
              Standard Transformer models retain information by appending token vectors to an unbounded Key-Value (KV) cache. As context and demonstration sequences grow longer, memory consumption grows linearly $O(N)$, creating steep GPU memory footprints and quadratic attention costs during long-context inference.
            </p>
          </Card>

          <Card variant="standard" className="p-5 space-y-3 border-lab-accent/40">
            <h3 className="text-sm font-bold text-lab-accent uppercase">
              The Recurrent Synaptic Paradigm
            </h3>
            <p className="text-lab-text-secondary leading-relaxed">
              Recurrent state architectures explore a fundamentally different way of carrying information: incorporating context tokens and demonstrations directly into an evolving, fixed-size high-dimensional internal state. Future computation and reasoning then operate over this persistent internal memory.
            </p>
          </Card>
        </div>
      </section>

      {/* SECTION 2: From Attention to State (Conceptual Bridge) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-lab-purple" />
          <h2 className="text-xl font-bold font-mono text-lab-text-primary">
            2. Mathematical Bridge: From Attention Matrix to Recurrent State
          </h2>
        </div>

        <Card variant="standard" className="p-6 space-y-4 font-mono text-xs">
          <p className="text-lab-text-secondary leading-relaxed">
            By replacing the standard softmax normalizer with positive feature maps &phi;(x), kernelized linear attention allows the associative property of matrix multiplication to re-order the attention equation:
          </p>

          <div className="p-4 rounded-xl bg-lab-bg border border-lab-border text-center space-y-2">
            <div className="text-lab-text-muted text-[11px] uppercase">Standard Softmax Attention</div>
            <div className="text-sm font-bold text-lab-purple">
              Output = softmax(QKᵀ / √d) V &nbsp; [Requires storing all K, V token vectors]
            </div>
            <div className="text-lab-text-muted text-[11px] uppercase pt-2">Kernelized Recurrent Perspective</div>
            <div className="text-sm font-bold text-lab-accent">
              S_t = S_(t-1) + &phi;(K_t) V_tᵀ &nbsp; ⟶ &nbsp; Output = (&phi;(Q)ᵀ S_N) / (&phi;(Q) · z_N)
            </div>
          </div>

          <p className="text-[11px] text-lab-text-muted leading-relaxed">
            StateLens demonstrated this exact outer-product formulation in Phase 5 with an 8 × 10 matrix. Pathway&rsquo;s BDH takes this concept into biological and high-dimensional sparse representations.
          </p>
        </Card>
      </section>

      {/* SECTION 3: BDH Architecture Pipeline */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-lab-accent" />
          <h2 className="text-xl font-bold font-mono text-lab-text-primary">
            3. Pathway BDH Architecture
          </h2>
        </div>
        <BDHArchitectureDiagram />
      </section>

      {/* SECTION 4: Memory Mechanism Comparison */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-lab-purple" />
          <h2 className="text-xl font-bold font-mono text-lab-text-primary">
            4. Memory Mechanism: KV Cache vs Synaptic State
          </h2>
        </div>
        <SynapticMemoryVisual />
      </section>

      {/* SECTION 5: BDH-CQ Latent Reasoning */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-lab-accent" />
          <h2 className="text-xl font-bold font-mono text-lab-text-primary">
            5. BDH-CQ: In-Context Adaptation & Latent Reasoning
          </h2>
        </div>
        <MemoryEvolutionDemo />
      </section>

      {/* SECTION 6: StateLens Connection */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-lab-accent" />
          <h2 className="text-xl font-bold font-mono text-lab-text-primary">
            6. StateLens ↔ BDH-CQ Comparative Connection
          </h2>
        </div>
        <StateLensConnection />
      </section>

      {/* SECTION 7: Toy to Research Spectrum */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-lab-accent" />
          <h2 className="text-xl font-bold font-mono text-lab-text-primary">
            7. From Educational Toy to Research Architecture
          </h2>
        </div>
        <ResearchBridge />
      </section>

      {/* SECTION 8: Research Findings & Toy Data */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-lab-purple" />
          <h2 className="text-xl font-bold font-mono text-lab-text-primary">
            8. Published Research Findings & Model Attribution
          </h2>
        </div>
        <ResearchFindings />
      </section>

      {/* SECTION 9: Research Boundary Card */}
      <section className="space-y-4">
        <ResearchBoundaryCard />
      </section>

      {/* SECTION 10: Research Sources Panel */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-lab-accent" />
          <h2 className="text-xl font-bold font-mono text-lab-text-primary">
            9. Primary Research Literature
          </h2>
        </div>
        <ResearchSources />
      </section>

      {/* Bottom CTA to return to Experiment Lab */}
      <div className="p-6 rounded-2xl bg-lab-secondary/60 border border-lab-accent/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold font-mono text-lab-text-primary">
            Ready to test associative memory trade-offs hands-on?
          </h3>
          <p className="text-xs font-mono text-lab-text-secondary">
            Switch back to the interactive laboratory to experiment with Full Attention and Linear Attention.
          </p>
        </div>

        <Link to={ROUTES.EXPERIMENT}>
          <Button variant="primary" size="md" icon={ArrowRight}>
            Open Experiment Lab
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BDHCQ;
