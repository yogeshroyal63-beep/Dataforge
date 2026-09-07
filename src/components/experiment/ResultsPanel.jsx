import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Layers, Info, CheckCircle2, XCircle, AlertTriangle, BookmarkPlus, Check, LogIn } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useExperiment } from '../../context/ExperimentContext';
import { useAuth } from '../../context/AuthContext';
import { saveExperiment } from '../../services/experimentStorage';
import { ROUTES } from '../../routes/routes';

/**
 * ResultsPanel — Side-by-side comparison of real computed results from
 * Full Attention and Linear Attention, with prominent Cloud Firestore persistence.
 */
export const ResultsPanel = () => {
  const {
    facts,
    results,
    comparison,
    selectedQuery,
    selectedModels,
    factCount,
    experimentStatus,
    error,
    runExperiment,
  } = useExperiment();

  const { user, isAuthenticated } = useAuth();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const isFullSelected = selectedModels === 'both' || selectedModels === 'full';
  const isLinearSelected = selectedModels === 'both' || selectedModels === 'linear';

  const fullResult = results?.full;
  const linearResult = results?.linear;
  const hasResults = Boolean(fullResult || linearResult);
  const isCompleted = experimentStatus === 'completed' || hasResults;

  // Reset save state when probe parameters or fact sequence changes
  useEffect(() => {
    setSavedSuccess(false);
    setSaveError(null);
  }, [selectedQuery?.key, factCount, facts]);

  const handleSave = async () => {
    if (!isAuthenticated || !user?.uid) return;
    if (isSaving || savedSuccess) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await saveExperiment(user.uid, {
        factCount,
        facts,
        selectedModels,
        selectedQuery,
        results,
        comparison,
      });
      setSavedSuccess(true);
    } catch (err) {
      console.error('Save experiment error:', err);
      setSaveError(err.message || 'Unable to save experiment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card variant="standard" className="p-5 space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-lab-border pb-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
          Model Comparison & Predictions
        </h2>
        <Badge
          variant={error ? 'danger' : isCompleted ? 'success' : 'default'}
          size="sm"
          dot
        >
          {error ? 'Error' : isCompleted ? 'Both Computed' : 'Awaiting Run'}
        </Badge>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-3.5 rounded-xl bg-lab-danger/10 border border-lab-danger/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-lab-danger">
            <AlertTriangle className="w-4 h-4" />
            <span>Experiment Error</span>
          </div>
          <p className="text-xs text-lab-text-secondary">{error}</p>
          <Button variant="outline" size="sm" onClick={runExperiment}>
            Try Again
          </Button>
        </div>
      )}

      {/* Storage save error */}
      {saveError && (
        <div className="p-3 rounded-lg bg-lab-danger/10 border border-lab-danger/30 text-xs text-lab-danger flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Probe Query Reference */}
      {selectedQuery && (
        <div className="p-3 rounded-lg bg-lab-surface/80 border border-lab-border flex items-center justify-between text-xs">
          <span className="text-lab-text-secondary">Probe Query:</span>
          <div className="flex items-center gap-3">
            <span className="font-bold text-lab-accent">{selectedQuery.key}</span>
            <span className="text-lab-text-muted">Expected Ground Truth:</span>
            <span className="font-bold text-lab-text-primary bg-lab-secondary px-2 py-0.5 rounded border border-lab-border">
              {selectedQuery.value}
            </span>
          </div>
        </div>
      )}

      {/* Model Result Comparison Blocks */}
      <div className="space-y-3">
        {/* Full Attention Block */}
        {isFullSelected && (
          <div className="p-4 rounded-xl bg-lab-secondary/50 border border-lab-purple/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-lab-purple" />
                <h4 className="text-xs font-bold uppercase text-lab-purple">
                  Full Attention
                </h4>
              </div>
              {fullResult ? (
                <div className="flex items-center gap-1.5">
                  {fullResult.isCorrect ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-lab-accent/15 text-lab-accent border border-lab-accent/30 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Correct Recall
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-lab-danger/15 text-lab-danger border border-lab-danger/30 font-semibold">
                      <XCircle className="w-3 h-3" />
                      Recall Mismatch
                    </span>
                  )}
                </div>
              ) : (
                <Badge variant="research" size="sm">Awaiting Run</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded bg-lab-surface border border-lab-border">
                <span className="block text-[10px] text-lab-text-muted uppercase">Prediction</span>
                <span className="text-lab-text-primary font-bold text-base mt-0.5">
                  {fullResult?.predictedValue !== undefined && fullResult?.predictedValue !== null
                    ? fullResult.predictedValue
                    : '—'}
                </span>
              </div>
              <div className="p-2 rounded bg-lab-surface border border-lab-border">
                <span className="block text-[10px] text-lab-text-muted uppercase">Expected</span>
                <span className="text-lab-text-primary font-bold text-base mt-0.5">
                  {selectedQuery?.value !== undefined ? selectedQuery.value : '—'}
                </span>
              </div>
              <div className="p-2 rounded bg-lab-surface border border-lab-border col-span-2 sm:col-span-1">
                <span className="block text-[10px] text-lab-text-muted uppercase">Confidence</span>
                <span className="text-lab-purple font-bold text-base mt-0.5">
                  {fullResult?.confidence !== undefined ? `${fullResult.confidence}%` : '—'}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-lab-text-muted">
              Computes query-key interactions directly across all stored tokens.
            </p>
          </div>
        )}

        {/* Linear Attention Block */}
        {isLinearSelected && (
          <div className="p-4 rounded-xl bg-lab-secondary/50 border border-lab-accent/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-lab-accent" />
                <h4 className="text-xs font-bold uppercase text-lab-accent">
                  Linear Attention
                </h4>
              </div>
              {linearResult ? (
                <div className="flex items-center gap-1.5">
                  {linearResult.isCorrect ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-lab-accent/15 text-lab-accent border border-lab-accent/30 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Correct Recall
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-lab-warning/15 text-lab-warning border border-lab-warning/30 font-semibold">
                      <AlertTriangle className="w-3 h-3" />
                      Interference / Mismatch
                    </span>
                  )}
                </div>
              ) : (
                <Badge variant="accent" size="sm">Awaiting Run</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded bg-lab-surface border border-lab-border">
                <span className="block text-[10px] text-lab-text-muted uppercase">Prediction</span>
                <span className="text-lab-text-primary font-bold text-base mt-0.5">
                  {linearResult?.predictedValue !== undefined && linearResult?.predictedValue !== null
                    ? linearResult.predictedValue
                    : '—'}
                </span>
              </div>
              <div className="p-2 rounded bg-lab-surface border border-lab-border">
                <span className="block text-[10px] text-lab-text-muted uppercase">Expected</span>
                <span className="text-lab-text-primary font-bold text-base mt-0.5">
                  {selectedQuery?.value !== undefined ? selectedQuery.value : '—'}
                </span>
              </div>
              <div className="p-2 rounded bg-lab-surface border border-lab-border col-span-2 sm:col-span-1">
                <span className="block text-[10px] text-lab-text-muted uppercase">Confidence</span>
                <span className="text-lab-accent font-bold text-base mt-0.5">
                  {linearResult?.confidence !== undefined ? `${linearResult.confidence}%` : '—'}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-lab-text-muted">
              Accumulates key-value outer products into a fixed-size running state matrix.
            </p>
          </div>
        )}
      </div>

      {/* Comparison Summary */}
      {comparison && (
        <div className="p-3 rounded-lg bg-lab-secondary/70 border border-lab-border text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-lab-text-secondary font-semibold">Model Output Parity:</span>
            <span className={comparison.match ? 'text-lab-accent font-bold' : 'text-lab-warning font-bold'}>
              {comparison.match ? 'Exact Agreement' : 'Divergent Output'}
            </span>
          </div>
        </div>
      )}

      {/* Prominent Save Experiment Section */}
      {isCompleted && hasResults && (
        <div className="p-4 rounded-xl bg-lab-secondary/80 border border-lab-accent/40 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-lab-border/60 pb-2">
            <div className="flex items-center gap-2">
              <BookmarkPlus className="w-4 h-4 text-lab-accent" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
                Save Experiment Record
              </h3>
            </div>
            <Badge variant={savedSuccess ? 'success' : 'accent'} size="sm">
              {savedSuccess ? 'Persisted' : 'Cloud Sync'}
            </Badge>
          </div>

          {isAuthenticated ? (
            <div className="space-y-3">
              <p className="text-[11px] text-lab-text-secondary leading-relaxed">
                Save this experiment run (N = {factCount} facts, probe: <span className="text-lab-accent font-bold">{selectedQuery?.key}</span>) to your Cloud Firestore research history.
              </p>

              {savedSuccess && (
                <div className="p-2.5 rounded-lg bg-lab-accent/15 border border-lab-accent/30 text-xs text-lab-accent font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-lab-accent" />
                  <span>✓ Experiment saved to Cloud Firestore & history!</span>
                </div>
              )}

              <Button
                variant={savedSuccess ? 'outline' : 'primary'}
                size="md"
                className="w-full justify-center text-xs font-bold py-2.5"
                icon={savedSuccess ? Check : BookmarkPlus}
                onClick={handleSave}
                isLoading={isSaving}
                disabled={savedSuccess || isSaving}
              >
                {savedSuccess ? '✓ Experiment Saved' : isSaving ? 'Saving…' : 'Save Experiment'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-lab-text-secondary leading-relaxed">
                Sign in to save your experiment history and track runs across devices.
              </p>
              <Link to={ROUTES.SIGN_IN} className="block w-full">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center text-xs font-bold py-2.5"
                  icon={LogIn}
                >
                  Sign in to save experiment
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Honesty Note */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-lab-secondary/40 border border-lab-border text-[11px] text-lab-text-muted">
        <Info className="w-4 h-4 text-lab-accent shrink-0 mt-px" />
        <span>
          Both models receive identical token embeddings, identical toy values, and ground truth.
        </span>
      </div>
    </Card>
  );
};

export default ResultsPanel;

