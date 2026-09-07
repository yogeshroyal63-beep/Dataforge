import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Database, Search, CheckCircle2, ArrowRight, Layers, ArrowDown } from 'lucide-react';
import Badge from '../common/Badge';

/**
 * MemoryPreview: Hero demonstration of sequential fact encoding, recurrent state memory,
 * and associative key-value retrieval.
 *
 * Demonstrates: FACTS -> MEMORY -> QUERY -> RECALL
 * Illustrative preview only. Fully respects reduced-motion preferences.
 */
export const MemoryPreview = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  const facts = [
    { key: 'APPLE', value: 7 },
    { key: 'MANGO', value: 3 },
    { key: 'KIWI', value: 9, highlight: true },
  ];

  // Animation variants with reduced-motion fallback
  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.35, ease: 'easeOut' },
    },
  };

  return (
    <div
      className={`w-full max-w-xl mx-auto rounded-2xl bg-lab-surface/95 border border-lab-border p-5 sm:p-6 shadow-card backdrop-blur-md relative ${className}`}
      aria-label="Illustrative preview of sequential fact encoding and recall"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-lab-border/70 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-lab-accent" />
          <span className="text-xs font-mono font-semibold text-lab-text-secondary uppercase tracking-wider">
            Memory Stream Flow
          </span>
        </div>
        <Badge variant="accent" size="sm" dot>
          Illustrative preview
        </Badge>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Step 1: FACTS */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-lab-text-muted uppercase">
            <span>1. Sequential Facts</span>
            <span className="text-[10px] text-lab-text-muted">Key → Value</span>
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            {facts.map((fact, idx) => (
              <motion.div
                key={fact.key}
                variants={itemVariants}
                className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors ${
                  fact.highlight
                    ? 'border-lab-accent/60 bg-lab-accent/10 text-lab-accent'
                    : 'border-lab-border bg-lab-secondary/60 text-lab-text-secondary'
                }`}
              >
                <span className="text-[11px] font-semibold tracking-wide">{fact.key}</span>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-lab-text-muted">→</span>
                  <span className="font-bold text-lab-text-primary text-xs">{fact.value}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Transition: Flow Down into Memory */}
        <div className="flex items-center justify-center gap-2 py-0.5 text-lab-text-muted">
          <div className="h-px bg-lab-border/80 flex-1" />
          <div className="flex items-center gap-1 text-[10px] font-mono text-lab-text-muted uppercase px-2 py-0.5 rounded bg-lab-secondary/80 border border-lab-border/60">
            <ArrowDown className="w-3 h-3 text-lab-accent" />
            <span>Encodes into Running State</span>
          </div>
          <div className="h-px bg-lab-border/80 flex-1" />
        </div>

        {/* Step 2: MEMORY STATE REPRESENTATION */}
        <motion.div
          variants={itemVariants}
          className="p-3 rounded-xl bg-lab-secondary/80 border border-lab-border/90 space-y-2"
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-lab-text-secondary uppercase">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-lab-purple" />
              <span>2. Recurrent Memory State Matrix (S_t)</span>
            </div>
            <span className="text-lab-accent">O(1) Fixed Size</span>
          </div>
          <div className="grid grid-cols-8 gap-1 py-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-[2px] border transition-opacity ${
                  i % 3 === 0
                    ? 'bg-lab-accent/30 border-lab-accent/40'
                    : 'bg-lab-purple/20 border-lab-purple/30'
                }`}
                style={{ opacity: 0.4 + (i % 5) * 0.12 }}
              />
            ))}
          </div>
          <p className="text-[10px] font-mono text-lab-text-muted text-center pt-1 border-t border-lab-border/40">
            All facts compressed continuously into a single fixed coordinate space.
          </p>
        </motion.div>

        {/* Step 3 & 4: QUERY & RECALL */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-lab-text-muted uppercase">
            <span>3. Query Probe</span>
            <span>4. Recalled Value</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
            {/* Query */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between bg-lab-surface p-3 rounded-xl border border-lab-accent/30 text-lab-accent"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-bold">QUERY: KIWI</span>
              </div>
              <span className="text-[10px] text-lab-text-muted">Probe Key</span>
            </motion.div>

            {/* Recalled Value */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between bg-lab-accent/15 p-3 rounded-xl border border-lab-accent text-lab-accent font-bold"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-lab-accent" />
                <span>RECALL: 9</span>
              </div>
              <span className="text-[10px] font-normal text-lab-accent/80 font-mono">Matched</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Honesty Notice */}
      <div className="mt-4 pt-3 border-t border-lab-border/50 text-center">
        <p className="text-[11px] font-mono text-lab-text-muted">
          Conceptual flow. Does not imply values were generated by an active neural network.
        </p>
      </div>
    </div>
  );
};

export default MemoryPreview;
