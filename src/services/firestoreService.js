/**
 * Cloud Firestore Persistence Service for StateLens Experiments
 * 
 * Manages experiment record persistence in Cloud Firestore under the
 * top-level `experiments` collection, scoped by Firebase User ID (UID).
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase.js';
import { isValidExperimentRecord } from '../utils/experimentValidation.js';

const COLLECTION_NAME = 'experiments';

/**
 * Safely parse a Firestore Timestamp, Date, string, or number to an ISO date string.
 */
function parseTimestamp(val) {
  if (!val) return new Date().toISOString();
  if (typeof val?.toDate === 'function') {
    return val.toDate().toISOString();
  }
  if (typeof val === 'string' && !Number.isNaN(Date.parse(val))) {
    return val;
  }
  if (typeof val === 'number') {
    return new Date(val).toISOString();
  }
  return new Date().toISOString();
}

/**
 * Save a new experiment to Firestore.
 * 
 * @param {object} experiment - Experiment payload
 * @param {string} userId - Authenticated user's Firebase UID
 * @returns {Promise<object>} The saved experiment record with generated doc ID and timestamp
 */
export async function saveExperimentToFirestore(experiment, userId) {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }
  if (!userId) {
    throw new Error('User ID is required to save experiment to Cloud Firestore.');
  }
  if (!experiment) {
    throw new Error('Valid experiment payload is required.');
  }

  const queryKey = experiment.selectedQuery?.key || experiment.query || 'UNKNOWN';
  const expectedVal = experiment.selectedQuery?.value ?? experiment.expectedValue ?? null;

  const docData = {
    userId,
    factCount: typeof experiment.factCount === 'number' ? experiment.factCount : 6,
    selectedModels: experiment.selectedModels || 'both',
    query: queryKey,
    expectedValue: expectedVal,
    selectedQuery: experiment.selectedQuery || { key: queryKey, value: expectedVal },
    facts: Array.isArray(experiment.facts)
      ? experiment.facts.map((f) => ({ key: f.key, value: f.value }))
      : [],
    results: experiment.results
      ? {
          full: experiment.results.full
            ? {
                predictedValue: experiment.results.full.predictedValue,
                isCorrect: experiment.results.full.isCorrect,
                confidence: experiment.results.full.confidence,
                attendedIndex: experiment.results.full.attendedIndex ?? null,
              }
            : null,
          linear: experiment.results.linear
            ? {
                predictedValue: experiment.results.linear.predictedValue,
                isCorrect: experiment.results.linear.isCorrect,
                confidence: experiment.results.linear.confidence,
                attendedIndex: experiment.results.linear.attendedIndex ?? null,
              }
            : null,
        }
      : null,
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
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };


  try {
    const colRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(colRef, docData);

    const nowISO = new Date().toISOString();
    const createdRecord = {
      id: docRef.id,
      userId,
      factCount: docData.factCount,
      selectedModels: docData.selectedModels,
      query: docData.query,
      expectedValue: docData.expectedValue,
      facts: docData.facts,
      fullAttention: docData.fullAttention,
      linearAttention: docData.linearAttention,
      comparison: docData.comparison,
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    return createdRecord;
  } catch (err) {
    console.error('Error saving experiment to Cloud Firestore:', err);
    throw new Error('Unable to save this experiment to Cloud Firestore.');
  }
}

/**
 * Retrieve all saved experiments for a user from Firestore.
 * 
 * @param {string} userId - Authenticated user's Firebase UID
 * @returns {Promise<Array<object>>} List of experiment records (newest first)
 */
export async function getExperimentsFromFirestore(userId) {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }
  if (!userId) return [];

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const records = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        factCount: data.factCount,
        selectedModels: data.selectedModels,
        query: data.query,
        expectedValue: data.expectedValue,
        facts: data.facts || [],
        fullAttention: data.fullAttention || null,
        linearAttention: data.linearAttention || null,
        comparison: data.comparison || null,
        createdAt: parseTimestamp(data.createdAt),
        updatedAt: parseTimestamp(data.updatedAt),
      };
    });

    // Sort by createdAt descending
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return records.filter(isValidExperimentRecord);
  } catch (err) {
    console.error('Error fetching experiments from Cloud Firestore:', err);
    throw new Error('Unable to load experiment history from Cloud Firestore.');
  }
}

/**
 * Retrieve a specific experiment document by ID for a user.
 * 
 * @param {string} experimentId - Document ID
 * @param {string} userId - Authenticated user's Firebase UID
 * @returns {Promise<object|null>} Experiment record or null
 */
export async function getExperimentFromFirestore(experimentId, userId) {
  if (!db || !experimentId || !userId) return null;

  try {
    const docRef = doc(db, COLLECTION_NAME, experimentId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;

    const data = snap.data();
    if (data.userId !== userId) {
      console.warn('Security boundary check: document userId mismatch.');
      return null;
    }

    const record = {
      id: snap.id,
      userId: data.userId,
      factCount: data.factCount,
      selectedModels: data.selectedModels,
      query: data.query,
      expectedValue: data.expectedValue,
      facts: data.facts || [],
      fullAttention: data.fullAttention || null,
      linearAttention: data.linearAttention || null,
      comparison: data.comparison || null,
      createdAt: parseTimestamp(data.createdAt),
      updatedAt: parseTimestamp(data.updatedAt),
    };

    return isValidExperimentRecord(record) ? record : null;
  } catch (err) {
    console.error('Error reading experiment document from Firestore:', err);
    return null;
  }
}

/**
 * Update an existing experiment document in Firestore.
 * 
 * @param {string} experimentId - Document ID
 * @param {object} updateData - Key-values to update
 * @param {string} userId - Authenticated user's Firebase UID
 * @returns {Promise<boolean>} True if updated successfully
 */
export async function updateExperimentInFirestore(experimentId, updateData, userId) {
  if (!db || !experimentId || !userId) return false;

  try {
    const docRef = doc(db, COLLECTION_NAME, experimentId);
    const snap = await getDoc(docRef);

    if (!snap.exists() || snap.data().userId !== userId) {
      throw new Error('Unauthorized or missing document.');
    }

    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (err) {
    console.error('Error updating experiment in Firestore:', err);
    throw new Error('Unable to update experiment in Cloud Firestore.');
  }
}

/**
 * Delete a single experiment document from Firestore.
 * 
 * @param {string} experimentId - Document ID
 * @param {string} userId - Authenticated user's Firebase UID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteExperimentFromFirestore(experimentId, userId) {
  if (!db || !experimentId || !userId) return false;

  try {
    const docRef = doc(db, COLLECTION_NAME, experimentId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return true; // Already deleted

    if (snap.data().userId !== userId) {
      console.warn('Security boundary check: cannot delete document belonging to another user.');
      return false;
    }

    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting experiment from Cloud Firestore:', err);
    throw new Error('Unable to delete experiment from Cloud Firestore.');
  }
}

/**
 * Delete all experiment documents belonging to a user from Firestore.
 * 
 * @param {string} userId - Authenticated user's Firebase UID
 * @returns {Promise<boolean>} True if cleared successfully
 */
export async function deleteAllExperimentsFromFirestore(userId) {
  if (!db || !userId) return false;

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return true;

    const batch = writeBatch(db);
    snapshot.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });

    await batch.commit();
    return true;
  } catch (err) {
    console.error('Error clearing experiments from Cloud Firestore:', err);
    throw new Error('Unable to clear experiment history from Cloud Firestore.');
  }
}
