import React, { createContext, useContext, useState, useCallback } from 'react';
import { generateFacts, DEFAULT_FACT_COUNT } from '../models/facts.js';
import { runExperiment as runExperimentEngine } from '../models/experimentEngine.js';
import { runAccuracyBenchmark } from '../models/benchmark.js';

/**
 * ExperimentContext — Phase 5 State Architecture
 * Manages both single-query laboratory runs and multi-condition accuracy benchmarks.
 */

const DEFAULT_FACTS = generateFacts(DEFAULT_FACT_COUNT);

const INITIAL_STATE = {
  factCount: DEFAULT_FACT_COUNT,
  facts: DEFAULT_FACTS,
  selectedQuery: DEFAULT_FACTS[2], // KIWI default
  selectedModels: 'both',          // 'both' | 'full' | 'linear'
  experimentStatus: 'idle',        // idle | configuring | ready | running | completed | error
  executionProgress: '',
  memoryState: {
    full: null,
    linear: null,
  },
  results: {
    full: null,
    linear: null,
  },
  comparison: null,
  error: null,

  // Multi-condition benchmark state
  benchmarkStatus: 'idle',         // idle | running | completed | error
  benchmarkProgress: null,
  benchmarkData: null,
  benchmarkSummary: null,
  benchmarkError: null,
};

const ExperimentContext = createContext({
  ...INITIAL_STATE,
  setFactCount: () => {},
  generateAndSetFacts: () => {},
  setSelectedQuery: () => {},
  setSelectedModels: () => {},
  runExperiment: async () => {},
  resetExperiment: () => {},
  runBenchmark: async () => {},
  clearBenchmark: () => {},
  isReady: false,
});

export const ExperimentProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE);

  const setFactCount = useCallback((count) => {
    const facts = generateFacts(count);
    const firstFact = facts[0];
    setState((prev) => {
      const queryStillValid = facts.find((f) => f.key === prev.selectedQuery?.key);
      return {
        ...prev,
        factCount: count,
        facts,
        selectedQuery: queryStillValid || firstFact,
        experimentStatus: 'configuring',
        results: INITIAL_STATE.results,
        comparison: null,
        memoryState: INITIAL_STATE.memoryState,
        error: null,
      };
    });
  }, []);

  const generateAndSetFacts = useCallback(() => {
    setState((prev) => {
      const facts = generateFacts(prev.factCount);
      const queryStillValid = facts.find((f) => f.key === prev.selectedQuery?.key);
      return {
        ...prev,
        facts,
        selectedQuery: queryStillValid || facts[0],
        experimentStatus: 'ready',
        results: INITIAL_STATE.results,
        comparison: null,
        memoryState: INITIAL_STATE.memoryState,
        error: null,
      };
    });
  }, []);

  const setSelectedQuery = useCallback((fact) => {
    setState((prev) => ({
      ...prev,
      selectedQuery: fact,
      results: INITIAL_STATE.results,
      comparison: null,
      memoryState: INITIAL_STATE.memoryState,
      error: null,
    }));
  }, []);

  const setSelectedModels = useCallback((models) => {
    setState((prev) => ({ ...prev, selectedModels: models }));
  }, []);

  /**
   * Run single-probe experiment across selected models.
   */
  const runExperiment = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      experimentStatus: 'running',
      executionProgress: 'Initiating attention models…',
      error: null,
    }));

    try {
      const { fullResult, linearResult, comparison } = await runExperimentEngine({
        facts: state.facts,
        queryFact: state.selectedQuery,
        models: state.selectedModels,
        onProgress: (progressMsg) => {
          setState((prev) => ({ ...prev, executionProgress: progressMsg }));
        },
      });

      setState((prev) => ({
        ...prev,
        experimentStatus: 'completed',
        executionProgress: 'Computation complete.',
        results: {
          full: fullResult,
          linear: linearResult,
        },
        comparison,
        memoryState: {
          full: fullResult ? { attendedIndex: fullResult.attendedIndex, weights: fullResult.attentionWeights } : null,
          linear: linearResult ? { stateMatrix: linearResult.stateMatrix, stateHistory: linearResult.stateHistory } : null,
        },
        error: null,
      }));
    } catch (err) {
      console.error('Experiment execution error:', err);
      setState((prev) => ({
        ...prev,
        experimentStatus: 'error',
        executionProgress: '',
        error: err.message || 'Unable to compute attention for this configuration.',
      }));
    }
  }, [state.facts, state.selectedQuery, state.selectedModels]);

  const resetExperiment = useCallback(() => {
    setState((prev) => ({
      ...INITIAL_STATE,
      benchmarkStatus: prev.benchmarkStatus,
      benchmarkProgress: prev.benchmarkProgress,
      benchmarkData: prev.benchmarkData,
      benchmarkSummary: prev.benchmarkSummary,
      benchmarkError: prev.benchmarkError,
    }));
  }, []);

  /**
   * Run multi-condition accuracy benchmark (fact counts 2..20).
   */
  const runBenchmark = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      benchmarkStatus: 'running',
      benchmarkProgress: { condition: 1, total: 10, factCount: 2 },
      benchmarkError: null,
    }));

    try {
      const benchmarkResult = await runAccuracyBenchmark((progress) => {
        setState((prev) => ({ ...prev, benchmarkProgress: progress }));
      });

      setState((prev) => ({
        ...prev,
        benchmarkStatus: 'completed',
        benchmarkProgress: null,
        benchmarkData: benchmarkResult.data,
        benchmarkSummary: benchmarkResult.summary,
        benchmarkError: null,
      }));
    } catch (err) {
      console.error('Benchmark execution error:', err);
      setState((prev) => ({
        ...prev,
        benchmarkStatus: 'error',
        benchmarkProgress: null,
        benchmarkError: err.message || 'Error running accuracy benchmark.',
      }));
    }
  }, []);

  const clearBenchmark = useCallback(() => {
    setState((prev) => ({
      ...prev,
      benchmarkStatus: 'idle',
      benchmarkProgress: null,
      benchmarkData: null,
      benchmarkSummary: null,
      benchmarkError: null,
    }));
  }, []);

  const value = {
    ...state,
    setFactCount,
    generateAndSetFacts,
    setSelectedQuery,
    setSelectedModels,
    runExperiment,
    resetExperiment,
    runBenchmark,
    clearBenchmark,
    isReady: state.experimentStatus === 'ready' || state.experimentStatus === 'configuring' || state.experimentStatus === 'completed',
  };

  return (
    <ExperimentContext.Provider value={value}>
      {children}
    </ExperimentContext.Provider>
  );
};

export const useExperiment = () => useContext(ExperimentContext);

export default ExperimentContext;
