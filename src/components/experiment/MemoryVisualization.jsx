import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, Layers, ArrowDown, Database, Sparkles } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import StateMatrix from './StateMatrix';
import { useExperiment } from '../../context/ExperimentContext';

/**
 * FullAttentionMemory — Shows KV cache accessible tokens, reacting to computed attention weights.
 */
const FullAttentionMemory = ({ facts, selectedQuery, fullResult }) => {
  const shouldReduceMotion = useReducedMotion();
  const hasResult = !!fullResult;

  return (
    <div className="flex-1 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-lab-purple" />
          <h3 className="text-xs font-mono font-bold uppercase text-lab-text-primary">
            Full Attention Memory
          </h3>
        </div>
        <Badge variant="research" size="sm">
          {hasResult ? 'Weights Available' : 'O(N) Access'}
        </Badge>
      </div>

      <div className="p-4 rounded-xl bg-lab-secondary/60 border border-lab-purple/25 space-y-3">
        <div className="text-[11px] font-mono text-lab-text-secondary text-center border-b border-lab-border/50 pb-2 mb-2 flex items-center justify-center gap-1.5">
          {hasResult ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-lab-purple" />
              <span className="text-lab-purple font-semibold">
                Token {fullResult.predictedKey} attended ({fullResult.confidence}%)
              </span>
            </>
          ) : (
            <span>Direct pairwise token access</span>
          )}
        </div>

        {/* KV cache representation */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5" role="list" aria-label="Full attention key-value entries">
          {facts.map((fact, idx) => {
            const isAttended = hasResult && fullResult.attendedIndex === idx;
            const weightObj = hasResult ? fullResult.attentionWeights?.[idx] : null;
            const isTargetQuery = selectedQuery?.key === fact.key;

            return (
              <motion.div
                key={`full-${fact.key}-${idx}`}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: shouldReduceMotion ? 0 : idx * 0.03, duration: 0.2 }}
              >
                <div className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono transition-all ${
                  isAttended
                    ? 'bg-lab-purple/20 border-lab-purple text-lab-purple font-bold shadow-xs'
                    : isTargetQuery
                    ? 'bg-lab-surface border-lab-accent/50 text-lab-text-primary'
                    : 'bg-lab-surface/60 border-lab-border/60 text-lab-text-secondary'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-lab-text-muted w-4">{idx + 1}</span>
                    <span className={isAttended ? 'text-lab-purple' : 'text-lab-text-primary'}>{fact.key}</span>
                    <span className="text-lab-text-muted">→</span>
                    <span className="text-lab-text-primary">{fact.value}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {weightObj && (
                      <span className={`text-[11px] ${isAttended ? 'text-lab-purple font-bold' : 'text-lab-text-muted'}`}>
                        α = {weightObj.percentage.toFixed(1)}%
                      </span>
                    )}
                    {isAttended && (
                      <Badge variant="research" size="sm">argmax</Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-lab-border/50">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-lab-text-muted">Stored tokens:</span>
            <span className="text-lab-purple font-semibold">{facts.length} entries (d = 8)</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono mt-0.5">
            <span className="text-lab-text-muted">Access model:</span>
            <span className="text-lab-purple font-semibold">Direct interaction across sequence entries</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * LinearAttentionMemory — Shows fixed-size state matrix absorbing incoming facts with real S_t matrix.
 */
const LinearAttentionMemory = ({ facts, factCount, linearResult }) => {
  const hasResult = !!linearResult;

  return (
    <div className="flex-1 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-lab-accent" />
          <h3 className="text-xs font-mono font-bold uppercase text-lab-text-primary">
            Linear Attention Memory
          </h3>
        </div>
        <Badge variant="accent" size="sm">
          {hasResult ? 'State S_N Ready' : 'O(1) State'}
        </Badge>
      </div>

      <div className="p-4 rounded-xl bg-lab-secondary/60 border border-lab-accent/25 space-y-3">
        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-lab-text-secondary">
          <span className="px-2 py-0.5 bg-lab-surface border border-lab-border rounded text-lab-text-secondary">
            {facts.length} facts
          </span>
          <ArrowDown className="w-3.5 h-3.5 text-lab-accent" />
          <span className="text-lab-accent font-semibold">Sequential State Matrix Compression</span>
        </div>

        {/* Embedded StateMatrix interactive scrubber */}
        {hasResult ? (
          <StateMatrix linearResult={linearResult} facts={facts} />
        ) : (
          <div className="p-4 rounded-lg bg-lab-bg/90 border border-lab-border space-y-2 text-center text-xs font-mono text-lab-text-muted">
            <p>State matrix dimensions: 8 × 10 (constant)</p>
            <p className="text-[11px]">Run experiment to inspect sequential S_t accumulation.</p>
          </div>
        )}

        <div className="pt-2 border-t border-lab-border/50">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-lab-text-muted">Memory dimension:</span>
            <span className="text-lab-accent font-semibold">O(1) Constant (8 × 10)</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono mt-0.5">
            <span className="text-lab-text-muted">Compression model:</span>
            <span className="text-lab-accent font-semibold">Compresses sequence contributions into running state</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * MemoryVisualization — Side-by-side comparison of Full vs Linear Attention memory representations.
 */
export const MemoryVisualization = () => {
  const { facts, factCount, selectedQuery, selectedModels, results } = useExperiment();

  const showFull = selectedModels === 'full' || selectedModels === 'both';
  const showLinear = selectedModels === 'linear' || selectedModels === 'both';
  const fullResult = results?.full;
  const linearResult = results?.linear;

  return (
    <Card variant="standard" className="p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-lab-border pb-2.5">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-lab-text-primary">
          Memory Architecture Comparison
        </h2>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-lab-text-muted">
          <Database className="w-3.5 h-3.5" />
          <span>Internal State vs KV Storage</span>
        </div>
      </div>

      {facts.length === 0 ? (
        <div className="text-center py-8 text-xs font-mono text-lab-text-muted">
          Generate facts to visualize memory representations.
        </div>
      ) : (
        <div className={`flex gap-5 ${selectedModels === 'both' ? 'flex-col' : 'flex-col'}`}>
          {showFull && (
            <FullAttentionMemory
              facts={facts}
              selectedQuery={selectedQuery}
              fullResult={fullResult}
            />
          )}
          {showLinear && (
            <LinearAttentionMemory
              facts={facts}
              factCount={factCount}
              linearResult={linearResult}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default MemoryVisualization;
