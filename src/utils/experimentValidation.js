/**
 * Experiment Record Validation & Schema Enforcement
 * 
 * Ensures all saved experiment records adhere to expected structures
 * and guards against corrupted JSON or malformed records.
 */

/**
 * Validates whether an object is a well-formed saved experiment record.
 * 
 * @param {any} record - Candidate experiment record
 * @returns {boolean} True if record is valid
 */
export function isValidExperimentRecord(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return false;
  }

  // Mandatory fields
  if (typeof record.id !== 'string' || !record.id.trim()) {
    return false;
  }

  if (typeof record.createdAt !== 'string' || Number.isNaN(Date.parse(record.createdAt))) {
    return false;
  }

  if (typeof record.factCount !== 'number' || record.factCount <= 0 || !Number.isFinite(record.factCount)) {
    return false;
  }

  if (typeof record.query !== 'string' || !record.query.trim()) {
    return false;
  }

  // Model results validation: at least one model or a valid container
  const hasFull = record.fullAttention && typeof record.fullAttention === 'object';
  const hasLinear = record.linearAttention && typeof record.linearAttention === 'object';

  if (!hasFull && !hasLinear) {
    return false;
  }

  if (hasFull) {
    if (typeof record.fullAttention.isCorrect !== 'boolean') {
      return false;
    }
  }

  if (hasLinear) {
    if (typeof record.linearAttention.isCorrect !== 'boolean') {
      return false;
    }
  }

  return true;
}

/**
 * Filter an array of items, retaining only valid experiment records.
 * 
 * @param {Array<any>} rawArray - Candidate records from storage
 * @returns {Array<object>} Sanitized list of valid records
 */
export function sanitizeExperimentList(rawArray) {
  if (!Array.isArray(rawArray)) {
    return [];
  }

  return rawArray.filter(isValidExperimentRecord);
}
