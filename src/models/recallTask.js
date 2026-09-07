/**
 * Recall Task Specification
 *
 * Defines the associative recall benchmark used for the StateLens experiment.
 *
 * @param {Array<{key: string, value: number}>} facts   - Input sequence of KV facts
 * @param {{key: string, value: number}} queryFact      - The probe key to retrieve
 * @returns {{
 *   facts: Array<{key: string, value: number, index: number}>,
 *   queryKey: string,
 *   groundTruth: number,
 *   evaluate: (prediction: number) => { isExact: boolean, error: number }
 * }}
 */
export function createRecallTask(facts, queryFact) {
  const indexedFacts = facts.map((f, i) => ({ ...f, index: i }));

  return {
    facts: indexedFacts,
    queryKey: queryFact.key,
    groundTruth: queryFact.value,
    /**
     * Evaluate a model prediction against ground truth.
     * @param {number} prediction
     */
    evaluate(prediction) {
      if (prediction === null || prediction === undefined) {
        return { isExact: false, error: null, note: 'No prediction produced.' };
      }
      const error = Math.abs(prediction - this.groundTruth);
      return {
        isExact: prediction === this.groundTruth,
        error,
        percentError: this.groundTruth !== 0 ? (error / Math.abs(this.groundTruth)) * 100 : null,
      };
    },
  };
}

export default { createRecallTask };
