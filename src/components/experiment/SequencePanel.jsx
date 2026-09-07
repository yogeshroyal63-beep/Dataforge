import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useExperiment } from '../../context/ExperimentContext';

/**
 * SequencePanel — Animated display of the ordered fact sequence entering the model.
 */
export const SequencePanel = () => {
  const { facts, selectedQuery } = useExperiment();
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, x: shouldReduceMotion ? 0 : -12 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.28, ease: 'easeOut' },
    },
  };

  if (facts.length === 0) {
    return (
      <Card variant="standard" className="p-6 text-center text-xs font-mono text-lab-text-muted">
        Generate facts to see the sequence.
      </Card>
    );
  }

  return (
    <Card variant="standard" className="p-5 space-y-3">
      <div className="flex items-center justify-between border-b border-lab-border pb-2.5">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-lab-text-primary">
          Fact Sequence
        </h2>
        <div className="flex items-center gap-2 text-[11px] font-mono text-lab-text-muted">
          <span>N = {facts.length}</span>
          <span className="text-lab-border">|</span>
          <span>Order: t₁ → t{facts.length}</span>
        </div>
      </div>

      <motion.div
        key={facts.length}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-1.5 overflow-y-auto max-h-72 pr-1"
        style={{ gridTemplateColumns: '1fr' }}
        role="list"
        aria-label="Sequence of facts entering the model"
      >
        {facts.map((fact, idx) => {
          const isQuery = selectedQuery?.key === fact.key;
          return (
            <motion.div
              key={`${fact.key}-${idx}`}
              variants={itemVariants}
              role="listitem"
              className={`flex items-center justify-between px-3 py-2 rounded-lg border font-mono text-xs transition-all ${
                isQuery
                  ? 'bg-lab-accent/15 border-lab-accent text-lab-accent shadow-sm'
                  : 'bg-lab-secondary/60 border-lab-border text-lab-text-secondary hover:border-lab-border-light'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-lab-text-muted w-5 text-right select-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className={`font-bold text-sm ${isQuery ? 'text-lab-accent' : 'text-lab-text-primary'}`}>
                  {fact.key}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-lab-text-muted" />
                <span className={`font-bold text-base ${isQuery ? 'text-lab-accent' : 'text-lab-text-primary'}`}>
                  {fact.value}
                </span>
                {isQuery && (
                  <Badge variant="accent" size="sm">query target</Badge>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Card>
  );
};

export default SequencePanel;
