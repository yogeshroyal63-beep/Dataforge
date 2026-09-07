/**
 * Data Processing & Analytics Utilities for Saved StateLens Experiments
 * 
 * CRITICAL SCIENTIFIC RULE:
 * All metrics, charts, and insights are computed STRICTLY from actual saved user records.
 * Zero fabricated statistics or benchmark blending.
 */

import { sanitizeExperimentList } from './experimentValidation.js';

/**
 * Calculate empirical recall accuracy for a specific model across saved runs.
 * 
 * @param {Array<object>} experiments - Saved experiment records
 * @param {'full'|'linear'} model - Target model identifier
 * @returns {{ evaluated: number, correct: number, accuracy: number|null }}
 */
export function calculateModelAccuracy(experiments, model) {
  const valid = sanitizeExperimentList(experiments);
  const key = model === 'full' ? 'fullAttention' : 'linearAttention';

  const evaluatedRuns = valid.filter((exp) => exp[key] && typeof exp[key].isCorrect === 'boolean');
  const evaluatedCount = evaluatedRuns.length;

  if (evaluatedCount === 0) {
    return { evaluated: 0, correct: 0, accuracy: null };
  }

  const correctCount = evaluatedRuns.filter((exp) => exp[key].isCorrect === true).length;
  const accuracy = Number(((correctCount / evaluatedCount) * 100).toFixed(1));

  return {
    evaluated: evaluatedCount,
    correct: correctCount,
    accuracy,
  };
}

/**
 * Calculate distribution of experiments across different sequence lengths (fact counts).
 * 
 * @param {Array<object>} experiments 
 * @returns {Array<{ factCount: number, count: number }>} Sorted ascending by factCount
 */
export function calculateFactCountDistribution(experiments) {
  const valid = sanitizeExperimentList(experiments);
  const distributionMap = new Map();

  for (const exp of valid) {
    const fc = exp.factCount;
    distributionMap.set(fc, (distributionMap.get(fc) || 0) + 1);
  }

  return Array.from(distributionMap.entries())
    .map(([factCount, count]) => ({ factCount, count }))
    .sort((a, b) => a.factCount - b.factCount);
}

/**
 * Group saved experiment accuracy by fact count for charting.
 * Only includes fact counts with at least one actual evaluated record.
 * 
 * @param {Array<object>} experiments 
 * @returns {Array<{ factCount: number, totalRuns: number, fullAccuracy: number|null, linearAccuracy: number|null, fullEvaluated: number, linearEvaluated: number }>}
 */
export function groupExperimentsByFactCount(experiments) {
  const valid = sanitizeExperimentList(experiments);
  const groups = new Map();

  for (const exp of valid) {
    const fc = exp.factCount;
    if (!groups.has(fc)) {
      groups.set(fc, []);
    }
    groups.get(fc).push(exp);
  }

  const sortedFactCounts = Array.from(groups.keys()).sort((a, b) => a - b);

  return sortedFactCounts.map((fc) => {
    const groupExps = groups.get(fc);
    const fullStats = calculateModelAccuracy(groupExps, 'full');
    const linearStats = calculateModelAccuracy(groupExps, 'linear');

    return {
      factCount: fc,
      totalRuns: groupExps.length,
      fullAccuracy: fullStats.accuracy,
      linearAccuracy: linearStats.accuracy,
      fullEvaluated: fullStats.evaluated,
      linearEvaluated: linearStats.evaluated,
    };
  });
}

/**
 * Get the most recent valid experiment records.
 * 
 * @param {Array<object>} experiments 
 * @param {number} limit 
 * @returns {Array<object>}
 */
export function getRecentExperiments(experiments, limit = 5) {
  const valid = sanitizeExperimentList(experiments);
  return [...valid]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

/**
 * Extract personal rule-based descriptive observations from saved runs.
 * Note: These are descriptive observations of personal history, not universal theoretical claims.
 * 
 * @param {Array<object>} experiments 
 * @returns {Array<{ id: string, type: 'info'|'warning'|'success'|'notice', title: string, description: string }>}
 */
export function getExperimentInsights(experiments) {
  const valid = sanitizeExperimentList(experiments);
  const insights = [];

  if (valid.length === 0) {
    return [
      {
        id: 'no-data',
        type: 'info',
        title: 'Begin Your Research History',
        description: 'Run and save StateLens associative recall experiments across varying fact counts to populate personal analytics.',
      },
    ];
  }

  // Small sample warning
  if (valid.length < 5) {
    insights.push({
      id: 'small-sample',
      type: 'notice',
      title: 'Small Sample Size',
      description: `Based on ${valid.length} saved run${valid.length === 1 ? '' : 's'}. Save additional runs to reveal clearer empirical trends.`,
    });
  }

  // Sequence length breadth
  const uniqueFactCounts = [...new Set(valid.map((e) => e.factCount))].sort((a, b) => a - b);
  if (uniqueFactCounts.length > 1) {
    insights.push({
      id: 'breadth',
      type: 'info',
      title: 'Sequence Length Range',
      description: `You have tested ${uniqueFactCounts.length} distinct sequence lengths (N = ${uniqueFactCounts.join(', ')} facts).`,
    });
  }

  // Boundary condition test (N = 20)
  if (uniqueFactCounts.includes(20)) {
    insights.push({
      id: 'max-tested',
      type: 'success',
      title: 'Maximum Sequence Tested',
      description: 'You have tested the maximum StateLens sequence length of 20 facts in your saved runs.',
    });
  }

  // Model comparison observation
  const dualRuns = valid.filter((e) => e.fullAttention && e.linearAttention);
  if (dualRuns.length > 0) {
    const fullStats = calculateModelAccuracy(valid, 'full');
    const linearStats = calculateModelAccuracy(valid, 'linear');

    if (fullStats.accuracy !== null && linearStats.accuracy !== null) {
      if (fullStats.accuracy > linearStats.accuracy) {
        insights.push({
          id: 'model-comparison',
          type: 'warning',
          title: 'Observed Recall Discrepancy',
          description: `In your saved runs, Linear Attention currently shows a lower recall rate (${linearStats.accuracy}%) than Full Attention (${fullStats.accuracy}%).`,
        });
      } else if (fullStats.accuracy === linearStats.accuracy) {
        insights.push({
          id: 'model-parity',
          type: 'info',
          title: 'Equivalent Performance Observed',
          description: `In your saved runs, both Full Attention and Linear Attention currently have matching observed accuracy (${fullStats.accuracy}%).`,
        });
      }
    }

    // Parity / divergence check
    const divergentCount = dualRuns.filter(
      (e) => e.fullAttention.prediction !== e.linearAttention.prediction
    ).length;

    if (divergentCount > 0) {
      insights.push({
        id: 'divergence',
        type: 'notice',
        title: 'Model Divergence Occurrences',
        description: `Full Attention and Linear Attention produced differing predictions in ${divergentCount} of ${dualRuns.length} dual-model saved run${dualRuns.length === 1 ? '' : 's'}.`,
      });
    }
  }

  return insights;
}

/**
 * Compare two specific saved experiment records side-by-side.
 * 
 * @param {object} recordA 
 * @param {object} recordB 
 * @returns {object} Comparative breakdown
 */
export function compareExperiments(recordA, recordB) {
  if (!recordA || !recordB) return null;

  return {
    runA: {
      id: recordA.id,
      createdAt: recordA.createdAt,
      factCount: recordA.factCount,
      query: recordA.query,
      expectedValue: recordA.expectedValue,
      fullAttention: recordA.fullAttention,
      linearAttention: recordA.linearAttention,
      facts: recordA.facts || [],
    },
    runB: {
      id: recordB.id,
      createdAt: recordB.createdAt,
      factCount: recordB.factCount,
      query: recordB.query,
      expectedValue: recordB.expectedValue,
      fullAttention: recordB.fullAttention,
      linearAttention: recordB.linearAttention,
      facts: recordB.facts || [],
    },
    metrics: {
      sameFactCount: recordA.factCount === recordB.factCount,
      sameQuery: recordA.query === recordB.query,
      sameExpected: recordA.expectedValue === recordB.expectedValue,
      fullAgreement:
        recordA.fullAttention?.prediction !== undefined &&
        recordB.fullAttention?.prediction !== undefined &&
        recordA.fullAttention?.prediction === recordB.fullAttention?.prediction,
      linearAgreement:
        recordA.linearAttention?.prediction !== undefined &&
        recordB.linearAttention?.prediction !== undefined &&
        recordA.linearAttention?.prediction === recordB.linearAttention?.prediction,
    },
  };
}
