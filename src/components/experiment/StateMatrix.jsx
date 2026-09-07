import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Layers, History, ArrowRight, Grid } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * StateMatrix — Interactive inspection of Linear Attention's running state matrix S_t ∈ ℝ^(8 × 10).
 * Users can scrub through time steps t = 1..N to observe how each fact updates the matrix.
 *
 * @param {{
 *   linearResult: object | null,
 *   facts: Array<{key: string, value: number}>
 * }} props
 */
export const StateMatrix = ({ linearResult, facts }) => {
  const [selectedStep, setSelectedStep] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  if (!linearResult || !linearResult.stateHistory || linearResult.stateHistory.length === 0) {
    return null;
  }

  const stateHistory = linearResult.stateHistory;
  const maxSteps = stateHistory.length;
  const currentStep = Math.min(Math.max(1, selectedStep), maxSteps);
  const currentSnapshot = stateHistory[currentStep - 1];
  const matrix = currentSnapshot?.stateSnapshot || linearResult.stateMatrix;

  // Find max value in current matrix for heatmap scaling
  let maxCellVal = 1e-4;
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] > maxCellVal) maxCellVal = matrix[r][c];
    }
  }

  return (
    <Card variant="standard" className="p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-lab-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            Linear Memory State S_t ({linearResult.stateShape})
          </h3>
        </div>
        <Badge variant="accent" size="sm">
          Step {currentStep} of {maxSteps}
        </Badge>
      </div>

      {/* Step scrubber */}
      <div className="p-3.5 rounded-xl bg-lab-secondary/50 border border-lab-border space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-lab-text-secondary flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-lab-accent" />
            Recurrent Ingestion Step (t):
          </span>
          <span className="font-bold text-lab-accent">
            {currentSnapshot ? `${currentSnapshot.factKey} → ${currentSnapshot.factValue}` : ''}
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={maxSteps}
          value={currentStep}
          onChange={(e) => setSelectedStep(Number(e.target.value))}
          aria-label="Select recurrent state time step"
          aria-valuemin={1}
          aria-valuemax={maxSteps}
          aria-valuenow={currentStep}
          aria-valuetext={`Step ${currentStep} of ${maxSteps}: Fact ${currentSnapshot?.factKey || ''}`}
          className="w-full h-1.5 bg-lab-surface rounded-lg appearance-none cursor-pointer accent-lab-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-accent focus-visible:ring-offset-2 focus-visible:ring-offset-lab-bg"
        />

        <div className="flex justify-between text-[10px] font-mono text-lab-text-muted" aria-hidden="true">
          <span>t₁ ({facts[0]?.key})</span>
          <span>t{maxSteps} ({facts[maxSteps - 1]?.key})</span>
        </div>
      </div>

      {/* State Matrix Grid Heatmap */}
      <div className="space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-[11px] text-lab-text-muted">
          <span>Rows: φ(K) ∈ ℝ⁸</span>
          <span>Columns: Value Vectors V ∈ ℝ¹⁰ (0..9)</span>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="min-w-[340px] p-3 rounded-xl bg-lab-bg border border-lab-border/70 space-y-1.5">
            {/* Column Headers */}
            <div className="grid grid-cols-11 gap-1 text-center text-[10px] text-lab-text-muted border-b border-lab-border/40 pb-1">
              <span className="text-left pl-1">φ \ V</span>
              {Array.from({ length: 10 }).map((_, c) => (
                <span
                  key={c}
                  className={`font-semibold ${
                    currentSnapshot?.factValue === c ? 'text-lab-accent font-bold' : ''
                  }`}
                >
                  v{c}
                </span>
              ))}
            </div>

            {/* Matrix Rows */}
            {matrix.map((row, r) => (
              <div key={r} className="grid grid-cols-11 gap-1 text-center items-center">
                <span className="text-[10px] text-lab-text-muted text-left pl-1 font-semibold">
                  k{r + 1}
                </span>
                {row.map((cellVal, c) => {
                  const intensity = Math.min(1, cellVal / maxCellVal);
                  const isCurrentTarget = currentSnapshot?.factValue === c;

                  return (
                    <motion.div
                      key={c}
                      initial={shouldReduceMotion ? false : { scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className={`h-6 rounded flex items-center justify-center text-[10px] border transition-colors ${
                        cellVal > 0
                          ? 'bg-lab-accent/20 border-lab-accent/40 text-lab-accent font-semibold'
                          : 'bg-lab-surface/40 border-lab-border/30 text-lab-text-muted/60'
                      }`}
                      style={{
                        backgroundColor: cellVal > 0 ? `rgba(16, 185, 129, ${0.1 + intensity * 0.35})` : undefined,
                      }}
                      title={`S_${currentStep}[k${r + 1}, v${c}] = ${cellVal.toFixed(3)}`}
                    >
                      {cellVal > 0 ? cellVal.toFixed(1) : '0'}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-lab-text-muted leading-relaxed">
          State matrix dimension remains constant ($8 \times 10$) regardless of how many facts enter memory.
        </p>
      </div>
    </Card>
  );
};

export default StateMatrix;
