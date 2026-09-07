import { runFullAttention } from './fullAttention.js';
import { runLinearAttention } from './linearAttention.js';
import { createRecallTask } from './recallTask.js';

/**
 * ExperimentEngine — Coordinates benchmark runs across selected models.
 *
 * Phase 5: Both Full Attention and Linear Attention are fully operational computational models.
 *
 * @param {{
 *   facts: Array<{key: string, value: number, index?: number}>,
 *   queryFact: {key: string, value: number} | string,
 *   models: 'both' | 'full' | 'linear',
 *   onProgress?: (status: string) => void
 * }} config
 */
export async function runExperiment(config) {
  const { facts, queryFact, models = 'both', onProgress } = config;

  if (!facts || facts.length === 0) {
    throw new Error('Experiment requires a non-empty fact sequence.');
  }

  const resolvedQuery = typeof queryFact === 'string'
    ? (facts.find((f) => f.key === queryFact) || { key: queryFact, value: null })
    : queryFact;

  onProgress?.('Constructing recall task…');
  const task = createRecallTask(facts, resolvedQuery);

  let fullResult = null;
  let linearResult = null;

  if (models === 'full' || models === 'both') {
    onProgress?.('Running Full Attention computation…');
    fullResult = await runFullAttention(task.facts, resolvedQuery);
  }

  if (models === 'linear' || models === 'both') {
    onProgress?.('Running Linear Attention recurrent computation…');
    linearResult = await runLinearAttention(task.facts, resolvedQuery);
  }

  onProgress?.('Comparison pipeline complete.');

  // Construct honest comparison summary if both were executed
  let comparison = null;
  if (fullResult && linearResult) {
    comparison = {
      fullCorrect: fullResult.isCorrect,
      linearCorrect: linearResult.isCorrect,
      fullPrediction: fullResult.predictedValue,
      linearPrediction: linearResult.predictedValue,
      expectedValue: resolvedQuery.value,
      fullConfidence: fullResult.confidence,
      linearConfidence: linearResult.confidence,
      match: fullResult.predictedValue === linearResult.predictedValue,
    };
  }

  return {
    task,
    fullResult,
    linearResult,
    comparison,
    status: 'completed',
  };
}

export const experimentEngine = { runExperiment };
export default experimentEngine;
