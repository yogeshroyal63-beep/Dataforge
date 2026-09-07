/**
 * Hybrid Persistence Service for StateLens Experiments
 * 
 * Cloud Firestore primary persistence for authenticated users,
 * with browser LocalStorage caching/fallback and automatic migration.
 */

import { isFirebaseConfigured, db } from './firebase.js';
import {
  saveExperimentToFirestore,
  getExperimentsFromFirestore,
  getExperimentFromFirestore,
  deleteExperimentFromFirestore,
  deleteAllExperimentsFromFirestore,
} from './firestoreService.js';
import { sanitizeExperimentList, isValidExperimentRecord } from '../utils/experimentValidation.js';

const STORAGE_PREFIX = 'statelens_experiments_';
const MIGRATION_PREFIX = 'statelens_migrated_';
const CURRENT_SCHEMA_VERSION = 1;

/**
 * Check if browser localStorage is available and writable.
 */
export function isLocalStorageAvailable() {
  try {
    const testKey = '__statelens_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function getStorageKey(uid) {
  const safeUid = uid || 'anonymous';
  return `${STORAGE_PREFIX}${safeUid}`;
}

function getMigrationKey(uid) {
  return `${MIGRATION_PREFIX}${uid}`;
}

/**
 * Save experiments list to local storage cache.
 */
function setLocalStorageCache(uid, experiments) {
  if (!uid || !isLocalStorageAvailable()) return;
  try {
    const storagePayload = {
      version: CURRENT_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      experiments,
    };
    localStorage.setItem(getStorageKey(uid), JSON.stringify(storagePayload));
  } catch (err) {
    console.warn('Error updating LocalStorage cache:', err);
  }
}

/**
 * Retrieve all saved experiments from LocalStorage cache (Synchronous).
 * 
 * @param {string} uid - User ID
 * @returns {Array<object>} Sanitized list of saved experiment objects (newest first)
 */
export function getExperiments(uid) {
  if (!uid) return [];

  try {
    if (!isLocalStorageAvailable()) return [];

    const raw = window.localStorage.getItem(getStorageKey(uid));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    let rawList = [];
    if (Array.isArray(parsed)) {
      rawList = parsed;
    } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.experiments)) {
      rawList = parsed.experiments;
    } else {
      return [];
    }

    return sanitizeExperimentList(rawList);
  } catch (err) {
    console.error('Error reading saved experiments from localStorage:', err);
    return [];
  }
}

/**
 * Retrieve all saved experiments from Firestore with LocalStorage cache fallback (Async).
 * Also performs one-time safe migration of LocalStorage items to Firestore if needed.
 * 
 * @param {string} uid - User ID
 * @returns {Promise<Array<object>>} Sanitized list of saved experiment objects (newest first)
 */
export async function getExperimentsAsync(uid) {
  if (!uid) return [];

  const localList = getExperiments(uid);

  if (isFirebaseConfigured && db) {
    try {
      // Run automatic LocalStorage -> Firestore migration once per user
      await migrateLocalStorageToFirestore(uid);

      const firestoreList = await getExperimentsFromFirestore(uid);
      setLocalStorageCache(uid, firestoreList);
      return firestoreList;
    } catch (err) {
      console.warn('Firestore fetch failed, returning LocalStorage fallback:', err);
      return localList;
    }
  }

  return localList;
}

/**
 * Save a new completed experiment (Async with Cloud Firestore primary + LocalStorage fallback).
 * 
 * @param {string} uid - User ID
 * @param {object} experiment - Experiment payload
 * @returns {Promise<object>} The saved experiment record
 */
export async function saveExperiment(uid, experiment) {
  if (!uid || !experiment) {
    throw new Error('User ID and valid experiment payload are required to save.');
  }

  let savedRecord = null;
  let saveErr = null;

  // 1. Primary storage: Cloud Firestore
  if (isFirebaseConfigured && db) {
    try {
      savedRecord = await saveExperimentToFirestore(experiment, uid);
    } catch (err) {
      console.warn('Cloud Firestore save failed; falling back to LocalStorage:', err);
      saveErr = err;
    }
  }

  // 2. LocalStorage Fallback / Cache update
  if (!savedRecord) {
    const newId = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowISO = new Date().toISOString();

    const queryKey = experiment.selectedQuery?.key || experiment.query || 'UNKNOWN';
    const expectedVal = experiment.selectedQuery?.value ?? experiment.expectedValue ?? null;

    savedRecord = {
      id: newId,
      userId: uid,
      createdAt: nowISO,
      updatedAt: nowISO,
      factCount: typeof experiment.factCount === 'number' ? experiment.factCount : 6,
      selectedModels: experiment.selectedModels || 'both',
      query: queryKey,
      expectedValue: expectedVal,
      selectedQuery: experiment.selectedQuery || { key: queryKey, value: expectedVal },
      facts: Array.isArray(experiment.facts)
        ? experiment.facts.map((f) => ({ key: f.key, value: f.value }))
        : [],
      results: experiment.results || null,
      fullAttention: experiment.results?.full
        ? {
            prediction: experiment.results.full.predictedValue,
            isCorrect: experiment.results.full.isCorrect,
            confidence: experiment.results.full.confidence,
            attendedIndex: experiment.results.full.attendedIndex ?? null,
          }
        : experiment.fullAttention || null,
      linearAttention: experiment.results?.linear
        ? {
            prediction: experiment.results.linear.predictedValue,
            isCorrect: experiment.results.linear.isCorrect,
            confidence: experiment.results.linear.confidence,
            attendedIndex: experiment.results.linear.attendedIndex ?? null,
          }
        : experiment.linearAttention || null,
      comparison: experiment.comparison || null,
    };

  }

  if (!isValidExperimentRecord(savedRecord)) {
    throw new Error('Formed experiment record did not pass schema validation.');
  }

  // Update local cache
  try {
    const existing = getExperiments(uid);
    // Deduplicate by ID
    const updated = [savedRecord, ...existing.filter((item) => item.id !== savedRecord.id)];
    setLocalStorageCache(uid, updated);
  } catch (err) {
    console.error('Error updating local storage cache:', err);
    if (!isFirebaseConfigured && saveErr) {
      throw saveErr;
    }
  }

  return savedRecord;
}

/**
 * Retrieve a specific experiment by ID (Async).
 * 
 * @param {string} uid - User ID
 * @param {string} id - Experiment record ID
 * @returns {Promise<object|null>} Experiment record or null if not found
 */
export async function getExperimentById(uid, id) {
  if (!uid || !id) return null;

  // Check local cache first
  const localList = getExperiments(uid);
  const foundLocal = localList.find((item) => item.id === id);

  if (isFirebaseConfigured && db) {
    try {
      const fromFirestore = await getExperimentFromFirestore(id, uid);
      if (fromFirestore) return fromFirestore;
    } catch (err) {
      console.warn('Error fetching experiment detail from Firestore:', err);
    }
  }

  return foundLocal || null;
}

/**
 * Delete a specific experiment by ID (Async).
 * 
 * @param {string} uid - User ID
 * @param {string} id - Experiment record ID
 * @returns {Promise<boolean>} True if deleted, false otherwise
 */
export async function deleteExperiment(uid, id) {
  if (!uid || !id) return false;

  let fsSuccess = false;

  if (isFirebaseConfigured && db) {
    try {
      fsSuccess = await deleteExperimentFromFirestore(id, uid);
    } catch (err) {
      console.warn('Error deleting experiment from Firestore:', err);
    }
  }

  // Always sync local cache
  try {
    const existing = getExperiments(uid);
    const filtered = existing.filter((item) => item.id !== id);
    setLocalStorageCache(uid, filtered);
    return true;
  } catch (err) {
    console.error('Error updating local storage after deletion:', err);
    return fsSuccess;
  }
}

/**
 * Clear all saved experiments for a user (Async).
 * 
 * @param {string} uid - User ID
 * @returns {Promise<boolean>} True if cleared
 */
export async function clearExperiments(uid) {
  if (!uid) return false;

  if (isFirebaseConfigured && db) {
    try {
      await deleteAllExperimentsFromFirestore(uid);
    } catch (err) {
      console.warn('Error clearing experiments from Firestore:', err);
    }
  }

  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(getStorageKey(uid));
    }
    return true;
  } catch (err) {
    console.error('Error clearing local storage:', err);
    return false;
  }
}

/**
 * One-time idempotent migration helper to copy legacy LocalStorage experiments to Firestore.
 * 
 * @param {string} uid - Authenticated User ID
 */
export async function migrateLocalStorageToFirestore(uid) {
  if (!uid || !isFirebaseConfigured || !db || !isLocalStorageAvailable()) return;

  const migrationKey = getMigrationKey(uid);
  if (localStorage.getItem(migrationKey) === 'true') {
    return; // Migration already performed for this account
  }

  try {
    const localList = getExperiments(uid);
    if (localList.length === 0) {
      localStorage.setItem(migrationKey, 'true');
      return;
    }

    const firestoreList = await getExperimentsFromFirestore(uid);
    const existingQueriesAndDates = new Set(
      firestoreList.map((e) => `${e.query}_${e.factCount}_${e.createdAt}`)
    );

    for (const exp of localList) {
      const key = `${exp.query}_${exp.factCount}_${exp.createdAt}`;
      if (!existingQueriesAndDates.has(key)) {
        await saveExperimentToFirestore(exp, uid);
      }
    }

    localStorage.setItem(migrationKey, 'true');
  } catch (err) {
    console.warn('LocalStorage to Firestore migration encountered non-fatal error:', err);
  }
}
