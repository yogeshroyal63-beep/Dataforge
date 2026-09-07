import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Plus, Database, Brain, Sparkles, RefreshCw } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const SAMPLE_TOKENS = ['Demonstration A', 'Demonstration B', 'Rule Pattern X', 'Target Context Q'];

/**
 * SynapticMemoryVisual — Visualizes Transformer KV cache vs BDH-style evolving synaptic memory.
 */
export const SynapticMemoryVisual = () => {
  const [injectedCount, setInjectedCount] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  const handleAddInfo = () => {
    setInjectedCount((prev) => (prev < SAMPLE_TOKENS.length ? prev + 1 : 1));
  };

  return (
    <Card variant="standard" className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-lab-purple" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            Memory Mechanism: KV Storage vs Synaptic State
          </h2>
        </div>
        <Badge variant="research" size="sm">
          Conceptual Comparison
        </Badge>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-mono text-lab-text-secondary max-w-xl">
          Click &ldquo;Add In-Context Information&rdquo; to observe how Transformer memory extends token-by-token while BDH synaptic memory evolves an existing internal network.
        </p>

        <Button
          variant="secondary"
          size="sm"
          icon={injectedCount < SAMPLE_TOKENS.length ? Plus : RefreshCw}
          onClick={handleAddInfo}
          aria-label="Add new information token to compare memory architectures"
        >
          {injectedCount < SAMPLE_TOKENS.length ? 'Add In-Context Info' : 'Reset Ingestion'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start font-mono text-xs">
        {/* Left: Transformer KV Memory */}
        <div className="p-4 rounded-xl bg-lab-secondary/50 border border-lab-purple/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-lab-purple" />
              <h3 className="font-bold text-lab-purple uppercase">
                Transformer KV Memory
              </h3>
            </div>
            <span className="text-[10px] text-lab-purple font-semibold bg-lab-purple/10 px-2 py-0.5 rounded border border-lab-purple/30">
              Unbounded O(N) Cache
            </span>
          </div>

          <p className="text-[11px] text-lab-text-secondary">
            Retains every token vector as a distinct entry in GPU memory:
          </p>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {SAMPLE_TOKENS.slice(0, injectedCount).map((token, i) => (
              <motion.div
                key={`kv-${token}-${i}`}
                initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-2 rounded bg-lab-bg border border-lab-purple/40 flex items-center justify-between text-[11px]"
              >
                <span className="text-lab-text-primary font-semibold">Token {i + 1}: {token}</span>
                <span className="text-lab-purple text-[10px]">[K_{i+1}, V_{i+1}] Cached</span>
              </motion.div>
            ))}
          </div>

          <div className="pt-2 border-t border-lab-border text-[10px] text-lab-text-muted">
            Memory footprint: Grows linearly with each new demonstration token.
          </div>
        </div>

        {/* Right: BDH Synaptic Memory */}
        <div className="p-4 rounded-xl bg-lab-secondary/50 border border-lab-accent/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-lab-accent" />
              <h3 className="font-bold text-lab-accent uppercase">
                BDH Synaptic Memory
              </h3>
            </div>
            <span className="text-[10px] text-lab-accent font-semibold bg-lab-accent/10 px-2 py-0.5 rounded border border-lab-accent/30">
              Fixed-Size Synaptic State
            </span>
          </div>

          <p className="text-[11px] text-lab-text-secondary">
            Information updates high-dimensional neuron-to-neuron synaptic connections:
          </p>

          {/* Abstract Synaptic Network Node Grid */}
          <div className="p-3.5 rounded-lg bg-lab-bg border border-lab-accent/30 space-y-2 text-center">
            <div className="text-[10px] text-lab-accent font-semibold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Synaptic Connection Matrix (State W_syn)</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 max-w-[200px] mx-auto py-1">
              {Array.from({ length: 12 }).map((_, n) => {
                const isActive = (n + injectedCount) % 3 === 0 || n < injectedCount * 2;
                return (
                  <motion.div
                    key={n}
                    animate={shouldReduceMotion ? {} : { opacity: isActive ? 0.9 : 0.25 }}
                    transition={{ duration: 0.3 }}
                    className={`h-5 rounded flex items-center justify-center text-[9px] border ${
                      isActive
                        ? 'bg-lab-accent/30 border-lab-accent text-lab-accent font-bold'
                        : 'bg-lab-surface border-lab-border/40 text-lab-text-muted/40'
                    }`}
                  >
                    w_{n+1}
                  </motion.div>
                );
              })}
            </div>

            <span className="text-[10px] text-lab-text-muted block">
              Updated by {injectedCount} context token(s) • Dimensions remain constant
            </span>
          </div>

          <div className="pt-2 border-t border-lab-border text-[10px] text-lab-text-muted">
            Memory footprint: Constant state size regardless of sequence length.
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-lab-secondary/80 border border-lab-border text-[11px] font-mono text-lab-text-muted">
        <strong>Note:</strong> Conceptual visualization demonstrating the architectural paradigm shift, not a direct numerical reproduction of Pathway&rsquo;s full model.
      </div>
    </Card>
  );
};

export default SynapticMemoryVisual;
