import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Play,
  BookOpen,
  FlaskConical,
  ExternalLink,
  Layers,
  Cpu,
  HelpCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ROUTES } from '../routes/routes';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import SectionHeader from '../components/common/SectionHeader';

// Specialized Narrative & Visual Components
import MemoryPreview from '../components/learning/MemoryPreview';
import ProblemSequenceVisual from '../components/learning/ProblemSequenceVisual';
import ConceptCards from '../components/learning/ConceptCards';
import ConceptualFactSlider from '../components/learning/ConceptualFactSlider';
import ExperimentPreviewCard from '../components/learning/ExperimentPreviewCard';
import ResearchHonestyCard from '../components/learning/ResearchHonestyCard';
import FailureModeTeaser from '../components/learning/FailureModeTeaser';

export const Landing = () => {
  const scrollToProblem = () => {
    const el = document.getElementById('the-problem');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col space-y-20 sm:space-y-28 py-10 sm:py-16">
      {/* 1. HERO SECTION */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline, Eyebrow & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lab-accent/10 border border-lab-accent/30 text-lab-accent text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DATAFORGE 2026 · PATHWAY TRACK</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-lab-text-primary leading-[1.15]">
              What happens when AI memory has a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lab-accent via-teal-300 to-lab-purple">
                fixed size
              </span>
              ?
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-lab-text-secondary leading-relaxed max-w-xl">
              Explore Linear Attention by changing the number of facts a model must remember — and watch how information inside a fixed-size state can begin to interfere.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link to={ROUTES.EXPERIMENT}>
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                  Run the Experiment →
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                onClick={scrollToProblem}
                className="w-full sm:w-auto"
              >
                See How It Works
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive Hero Visualization */}
          <div className="lg:col-span-6">
            <MemoryPreview />
          </div>
        </div>
      </section>

      {/* 2. TRUST / CONTEXT STRIP */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="py-4 px-6 rounded-xl bg-lab-surface/70 border border-lab-border/80 flex flex-col md:flex-row items-center justify-around gap-4 text-center">
          <div className="flex items-center gap-2 text-xs font-mono text-lab-text-secondary tracking-wider uppercase">
            <FlaskConical className="w-4 h-4 text-lab-accent" />
            <span>Interactive Learning Artifact</span>
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-lab-border" />
          <div className="flex items-center gap-2 text-xs font-mono text-lab-text-secondary tracking-wider uppercase">
            <Cpu className="w-4 h-4 text-lab-purple" />
            <span>Toy Model + Research Connection</span>
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-lab-border" />
          <div className="flex items-center gap-2 text-xs font-mono text-lab-accent tracking-wider uppercase font-semibold">
            <ShieldCheck className="w-4 h-4 text-lab-accent" />
            <span>No Sign-In Required</span>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM */}
      <section id="the-problem" className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24 space-y-6">
        <SectionHeader
          eyebrow="The Memory Dilemma"
          title="How does a model remember the past?"
          description="When a model processes a sequence, it needs some way to preserve information from earlier inputs. Different attention mechanisms make different trade-offs."
        />
        <ProblemSequenceVisual />
      </section>

      {/* 4. THREE CONCEPT CARDS */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <SectionHeader
          eyebrow="Core Architecture"
          title="Comparing the Two Approaches"
          description="One approach keeps access to previous information. Another compresses information into a running state."
        />
        <ConceptCards />
      </section>

      {/* 5. INTERACTIVE “POKE IT” SECTION */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <SectionHeader
          eyebrow="Interactive Demonstration"
          title="Watch the State Superposition Fill"
          description="A quick, lightweight preview of how memory density increases as more sequential facts are packed into a constant-sized coordinate state."
        />
        <ConceptualFactSlider />
      </section>

      {/* 6. THE CENTRAL QUESTION */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-lab-surface via-[#121927] to-lab-secondary border border-lab-accent/30 text-center space-y-5 shadow-card">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-lab-accent">
            The Central Question
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-lab-text-primary max-w-2xl mx-auto">
            So what happens when the memory state gets crowded?
          </h2>
          <p className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lab-accent via-teal-200 to-lab-purple py-1">
            Let's test it.
          </p>
          <p className="text-sm sm:text-base text-lab-text-secondary max-w-xl mx-auto leading-relaxed">
            Instead of telling you the answer, we'll let you change the number of facts and observe the recall behavior yourself.
          </p>
          <div className="pt-3">
            <Link to={ROUTES.EXPERIMENT}>
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="px-8 py-3 text-base">
                Run the Experiment →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. EXPERIMENT PREVIEW CARD */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-4">
        <SectionHeader
          eyebrow="Interactive Lab Setup"
          title="The Associative Recall Protocol"
          description="Take a preview look at the experimental controls and recall probes before running the live simulation."
        />
        <ExperimentPreviewCard />
      </section>

      {/* 8. WHY THIS MATTERS (RESEARCH CONNECTION) */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Card variant="research" className="p-6 sm:p-8 md:p-10 space-y-5 border-lab-purple/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="research" size="sm">
                RESEARCH CONNECTION
              </Badge>
              <span className="text-xs font-mono text-lab-text-muted">Pathway BDH-CQ</span>
            </div>
            <Link
              to={ROUTES.BDH_CQ}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-lab-purple hover:underline"
            >
              <span>Explore the BDH-CQ connection</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-lab-text-primary">
            This isn't just a toy problem.
          </h2>

          <p className="text-sm sm:text-base text-lab-text-secondary leading-relaxed max-w-3xl">
            The fixed-state memory perspective also appears in Pathway's BDH-CQ research, where a model can adapt to new examples through an evolving memory state rather than updating its trained weights.
          </p>

          <div className="pt-2">
            <Link to={ROUTES.BDH_CQ}>
              <Button variant="secondary" icon={ChevronRight} iconPosition="right">
                Read Architectural Analysis
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* 9. RESEARCH HONESTY CARD */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <ResearchHonestyCard />
      </section>

      {/* 10. THE FAILURE MODE TEASER */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <FailureModeTeaser />
      </section>

      {/* 11. LEARNING OUTCOMES */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <SectionHeader
          eyebrow="Pedagogical Goals"
          title="By the end, you'll be able to explain three things."
          description="StateLens provides both hands-on empirical experimentation and conceptual clarity."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Outcome 1 */}
          <Card variant="standard" className="p-6 space-y-3">
            <span className="text-2xl font-mono font-extrabold text-lab-accent">
              01
            </span>
            <h3 className="text-base font-bold text-lab-text-primary">
              What Linear Attention does
            </h3>
            <p className="text-xs text-lab-text-secondary leading-relaxed">
              Maintains a running memory state matrix across tokens instead of storing an expanding KV cache.
            </p>
          </Card>

          {/* Outcome 2 */}
          <Card variant="standard" className="p-6 space-y-3">
            <span className="text-2xl font-mono font-extrabold text-lab-purple">
              02
            </span>
            <h3 className="text-base font-bold text-lab-text-primary">
              Why the trade-off exists
            </h3>
            <p className="text-xs text-lab-text-secondary leading-relaxed">
              A fixed representation can cause information interference when more facts are packed than its dimension can preserve.
            </p>
          </Card>

          {/* Outcome 3 */}
          <Card variant="standard" className="p-6 space-y-3">
            <span className="text-2xl font-mono font-extrabold text-lab-warning">
              03
            </span>
            <h3 className="text-base font-bold text-lab-text-primary">
              How this connects to BDH-CQ
            </h3>
            <p className="text-xs text-lab-text-secondary leading-relaxed">
              BDH-CQ uses a memory-state approach for adaptation without changing trained weights in streaming environments.
            </p>
          </Card>
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-12 rounded-2xl bg-lab-surface/90 border border-lab-border text-center space-y-5 backdrop-blur-md">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-lab-text-primary">
            Don't take our word for it.
          </h2>
          <p className="text-sm sm:text-base text-lab-text-secondary max-w-lg mx-auto leading-relaxed">
            Change the number of facts. Run the recall test. See what happens.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link to={ROUTES.EXPERIMENT} className="w-full sm:w-auto">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                Run the Experiment →
              </Button>
            </Link>
            <Link to={ROUTES.SOURCES} className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" icon={BookOpen} className="w-full sm:w-auto">
                Read the Research →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
