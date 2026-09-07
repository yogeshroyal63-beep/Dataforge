/**
 * StateLens Experiment Export Utilities
 * 
 * Provides client-side JSON and CSV downloads using native Blob objects.
 * No external dependencies or server requirements.
 */

import { sanitizeExperimentList } from './experimentValidation.js';

/**
 * Trigger browser file download from a Blob.
 * 
 * @param {Blob} blob 
 * @param {string} filename 
 */
function downloadBlob(blob, filename) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Export download is only available in browser environments.');
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Export a collection of experiment records to a JSON file.
 * 
 * @param {Array<object>} experiments 
 * @param {string} filename 
 * @returns {boolean} True if export completed successfully
 */
export function exportExperimentsToJSON(experiments, filename = 'statelens-experiment-history.json') {
  try {
    const valid = sanitizeExperimentList(experiments || []);
    if (valid.length === 0) {
      console.warn('No valid experiment records to export.');
      return false;
    }

    const payload = {
      exportDate: new Date().toISOString(),
      source: 'StateLens Research Workspace',
      version: 1,
      totalRecords: valid.length,
      experiments: valid,
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadBlob(blob, filename);
    return true;
  } catch (err) {
    console.error('Failed to export experiments to JSON:', err);
    return false;
  }
}

/**
 * Export a single experiment record to JSON.
 * 
 * @param {object} record 
 * @param {string} filename 
 * @returns {boolean} True if export completed successfully
 */
export function exportSingleExperimentToJSON(record, filename) {
  if (!record) return false;
  try {
    const targetFilename = filename || `statelens-run-${record.id || 'export'}.json`;
    const jsonString = JSON.stringify(record, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadBlob(blob, targetFilename);
    return true;
  } catch (err) {
    console.error('Failed to export single experiment to JSON:', err);
    return false;
  }
}

/**
 * Export a collection of experiment records to a CSV file.
 * 
 * @param {Array<object>} experiments 
 * @param {string} filename 
 * @returns {boolean} True if export completed successfully
 */
export function exportExperimentsToCSV(experiments, filename = 'statelens-experiment-history.csv') {
  try {
    const valid = sanitizeExperimentList(experiments || []);
    if (valid.length === 0) {
      console.warn('No valid experiment records to export.');
      return false;
    }

    const headers = [
      'ID',
      'Date',
      'Fact Count',
      'Query',
      'Expected Value',
      'Full Attention Prediction',
      'Full Attention Correct',
      'Full Attention Confidence %',
      'Linear Attention Prediction',
      'Linear Attention Correct',
      'Linear Attention Confidence %',
    ];

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = valid.map((exp) => [
      escapeCSV(exp.id),
      escapeCSV(exp.createdAt),
      escapeCSV(exp.factCount),
      escapeCSV(exp.query),
      escapeCSV(exp.expectedValue),
      escapeCSV(exp.fullAttention?.prediction ?? 'N/A'),
      escapeCSV(exp.fullAttention?.isCorrect !== undefined ? (exp.fullAttention.isCorrect ? 'TRUE' : 'FALSE') : 'N/A'),
      escapeCSV(exp.fullAttention?.confidence ?? 'N/A'),
      escapeCSV(exp.linearAttention?.prediction ?? 'N/A'),
      escapeCSV(exp.linearAttention?.isCorrect !== undefined ? (exp.linearAttention.isCorrect ? 'TRUE' : 'FALSE') : 'N/A'),
      escapeCSV(exp.linearAttention?.confidence ?? 'N/A'),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
    return true;
  } catch (err) {
    console.error('Failed to export experiments to CSV:', err);
    return false;
  }
}
