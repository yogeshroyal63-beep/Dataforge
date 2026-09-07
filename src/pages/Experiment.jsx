import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain } from 'lucide-react';
import ExperimentHeader from '../components/experiment/ExperimentHeader';
import ExperimentControls from '../components/experiment/ExperimentControls';
import SequencePanel from '../components/experiment/SequencePanel';
import ModelSelector from '../components/experiment/ModelSelector';
import MemoryVisualization from '../components/experiment/MemoryVisualization';
import AttentionWeights from '../components/experiment/AttentionWeights';
import AttentionComputation from '../components/experiment/AttentionComputation';
import LinearAttentionComputation from '../components/experiment/LinearAttentionComputation';
import QueryPanel from '../components/experiment/QueryPanel';
import ResultsPanel from '../components/experiment/ResultsPanel';
import CapacityComparison from '../components/experiment/CapacityComparison';
import BenchmarkControls from '../components/experiment/BenchmarkControls';
import AccuracyChart from '../components/experiment/AccuracyChart';
import BenchmarkSummary from '../components/experiment/BenchmarkSummary';
import Button from '../components/common/Button';
import { useExperiment } from '../context/ExperimentContext';
import { ROUTES } from '../routes/routes';

/**
 * Experiment Page — Phase 5 Live Comparison & Accuracy Benchmarks
 */
export const Experiment = () => {
  const {
    experimentStatus,
    results,
    selectedQuery,
    selectedModels,
    benchmarkData,
    benchmarkSummary,
  } = useExperiment();

  const fullResult = results?.full;
  const linearResult = results?.linear;

  const isFullSelected = selectedModels === 'both' || selectedModels === 'full';
  const isLinearSelected = selectedModels === 'both' || selectedModels === 'linear';

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
      {/* Top Header with dynamic phase/status badges */}
      <ExperimentHeader experimentStatus={experimentStatus} />

      {/* SECTION 1: Single-Query Interactive Laboratory */}
      <div className="space-y-6">
        <div className="border-b border-lab-border pb-2">
          <h2 className="text-lg font-bold font-mono text-lab-text-primary tracking-tight">
            Part 1 — Single Probe Observation Lab
          </h2>
          <p className="text-xs text-lab-text-secondary font-mono">
            Test a single associative recall probe and inspect memory representations & attention mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Controls, Model Selector & Fact Sequence (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ExperimentControls />
            <ModelSelector />
            <SequencePanel />
          </div>

          {/* Right Column: Memory Representation, Attention Weights, Query Probe & Results (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <MemoryVisualization />

            {/* Attention Weights Distribution (Full Attention) */}
            {isFullSelected && (
              <AttentionWeights
                attentionWeights={fullResult?.attentionWeights || []}
                queryKey={selectedQuery?.key || ''}
              />
            )}

            {/* Query Probe & Results Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <QueryPanel />
              <ResultsPanel />
            </div>

            {/* Inspectable Mathematical Traces */}
            {isFullSelected && fullResult && (
              <AttentionComputation result={fullResult} />
            )}

            {isLinearSelected && linearResult && (
              <LinearAttentionComputation result={linearResult} />
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: Architecture & Memory Comparison Breakdown */}
      <div className="space-y-4">
        <div className="border-b border-lab-border pb-2">
          <h2 className="text-lg font-bold font-mono text-lab-text-primary tracking-tight">
            Part 2 — Architectural Trade-Off Analysis
          </h2>
          <p className="text-xs text-lab-text-secondary font-mono">
            How memory representation fundamentally differentiates Full and Linear Attention.
          </p>
        </div>
        <CapacityComparison />
      </div>

      {/* SECTION 3: Multi-Condition Accuracy Benchmark Suite */}
      <div className="space-y-6">
        <div className="border-b border-lab-border pb-2">
          <h2 className="text-lg font-bold font-mono text-lab-text-primary tracking-tight">
            Part 3 — Multi-Condition Accuracy Benchmark
          </h2>
          <p className="text-xs text-lab-text-secondary font-mono">
            Evaluate retention curves across sequence lengths (N = 2 to 20 facts) testing all entries as probe queries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls & Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <BenchmarkControls />
            {benchmarkSummary && <BenchmarkSummary summary={benchmarkSummary} />}
          </div>

          {/* Retention Curve Line Chart (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <AccuracyChart data={benchmarkData} />
          </div>
        </div>
      </div>

      {/* SECTION 4: Research Connection CTA */}
      <div className="p-6 rounded-2xl bg-lab-secondary/60 border border-lab-accent/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-lab-accent font-bold text-sm">
            <Brain className="w-4 h-4" />
            <span>You observed the memory trade-off.</span>
          </div>
          <p className="text-xs text-lab-text-secondary">
            Now see how modern architectures like Pathway&rsquo;s BDH-CQ explore high-dimensional synaptic state and recurrent latent reasoning.
          </p>
        </div>

        <Link to={ROUTES.BDH_CQ}>
          <Button variant="primary" size="md" icon={ArrowRight}>
            Explore BDH-CQ →
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Experiment;
