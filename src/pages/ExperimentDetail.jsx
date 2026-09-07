import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Trash2,
  Download,
  Scale,
  Clock,
  Info,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ModelComparisonCard from '../components/dashboard/ModelComparisonCard';
import { useAuth } from '../context/AuthContext';
import { getExperimentById, deleteExperiment } from '../services/experimentStorage';
import { exportSingleExperimentToJSON } from '../utils/exportExperiment';
import { ROUTES } from '../routes/routes';


export const ExperimentDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadRecord = async () => {
      if (user?.uid && id) {
        setIsLoading(true);
        try {
          const found = await getExperimentById(user.uid, id);
          if (isMounted) setRecord(found);
        } catch (err) {
          console.error('Error fetching experiment record:', err);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else {
        if (isMounted) setIsLoading(false);
      }
    };

    loadRecord();
    return () => {
      isMounted = false;
    };
  }, [user, id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showDeleteConfirm) {
        setShowDeleteConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDeleteConfirm]);

  const handleDelete = async () => {
    if (user?.uid && id) {
      await deleteExperiment(user.uid, id);
      navigate(ROUTES.DASHBOARD_HISTORY);
    }
  };

  const handleExportJSON = () => {
    if (record) {
      exportSingleExperimentToJSON(record);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-content mx-auto px-4 py-16 text-center space-y-3 font-mono">
        <div className="w-7 h-7 border-2 border-lab-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-lab-text-secondary">Loading experiment details…</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-content mx-auto px-4 py-16 text-center space-y-4 font-mono">
        <p className="text-xs text-lab-text-secondary">Saved experiment record not found in your research history.</p>
        <Link to={ROUTES.DASHBOARD_HISTORY}>
          <Button variant="secondary" size="sm" icon={ArrowLeft}>
            Back to History
          </Button>
        </Link>
      </div>
    );
  }

  const factsList = record.facts || [];


  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 font-mono">
      {/* Top Breadcrumbs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-lab-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-lab-text-muted">
            <Link to={ROUTES.DASHBOARD} className="hover:text-lab-text-primary">
              Dashboard
            </Link>
            <span>/</span>
            <Link to={ROUTES.DASHBOARD_HISTORY} className="hover:text-lab-text-primary">
              History
            </Link>
            <span>/</span>
            <span className="text-lab-accent font-semibold">{record.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-lab-text-primary">
            Saved Run: {record.query} (N = {record.factCount})
          </h1>
          <p className="text-xs text-lab-text-secondary flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-lab-text-muted" />
            <span>
              Recorded {new Date(record.createdAt).toLocaleDateString()} at{' '}
              {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`${ROUTES.DASHBOARD_COMPARE}?a=${record.id}`}>
            <Button variant="outline" size="sm" icon={Scale}>
              Compare Run
            </Button>
          </Link>
          <Button variant="outline" size="sm" icon={Download} onClick={handleExportJSON}>
            Export JSON
          </Button>
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => setShowDeleteConfirm(true)}>
            Delete
          </Button>
        </div>
      </div>

      {/* Target Probe & Expected Value Summary */}
      <Card variant="standard" className="p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-lab-border pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
            Probe Target & Sequence Parameters
          </h2>
          <Badge variant="research" size="sm">
            Saved Toy Experiment
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-lab-secondary/60 border border-lab-border space-y-1">
            <span className="text-[10px] text-lab-text-muted uppercase block">Target Probe Key</span>
            <span className="text-xl font-bold text-lab-accent block">{record.query}</span>
          </div>

          <div className="p-3 rounded-lg bg-lab-secondary/60 border border-lab-border space-y-1">
            <span className="text-[10px] text-lab-text-muted uppercase block">Expected Ground Truth</span>
            <span className="text-xl font-bold text-lab-text-primary block">{record.expectedValue ?? '—'}</span>
          </div>

          <div className="p-3 rounded-lg bg-lab-secondary/60 border border-lab-border space-y-1">
            <span className="text-[10px] text-lab-text-muted uppercase block">Sequence Length (N)</span>
            <span className="text-xl font-bold text-lab-purple block">{record.factCount} facts</span>
          </div>
        </div>
      </Card>

      {/* Original Input Facts Sequence */}
      <Card variant="standard" className="p-5 space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-lab-border pb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
            Original Input Facts Sequence
          </h3>
          <Badge variant="default" size="sm">
            {factsList.length > 0 ? `${factsList.length} Facts` : 'Unavailable'}
          </Badge>
        </div>

        {factsList.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[11px] text-lab-text-muted">
              Input facts stored during this experiment run. The probed query key is highlighted in cyan.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {factsList.map((f, i) => {
                const isTarget = f.key === record.query;
                return (
                  <div
                    key={`fact-${i}`}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                      isTarget
                        ? 'bg-lab-accent/15 border-lab-accent text-lab-accent font-bold ring-1 ring-lab-accent/40 shadow-sm'
                        : 'bg-lab-secondary/70 border-lab-border text-lab-text-secondary'
                    }`}
                  >
                    <span>{f.key}</span>
                    <span className="text-lab-text-muted mx-1.5">→</span>
                    <span className={isTarget ? 'text-lab-text-primary font-bold' : 'text-lab-text-muted'}>
                      {f.value}
                    </span>
                    {isTarget && (
                      <span className="ml-2 text-[10px] bg-lab-accent/20 text-lab-accent px-1.5 py-0.5 rounded font-semibold">
                        Probe
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-lab-text-muted py-2">
            Original fact list unavailable for this saved run (saved in an earlier schema version).
          </p>
        )}
      </Card>

      {/* Side-by-Side Model Comparison Card */}
      <ModelComparisonCard
        fullAttention={record.fullAttention}
        linearAttention={record.linearAttention}
        expectedValue={record.expectedValue}
      />

      {/* Scientific Honesty Notice */}
      <div className="p-4 rounded-xl bg-lab-secondary/40 border border-lab-border text-[11px] text-lab-text-muted flex items-start gap-2.5">
        <Info className="w-4 h-4 text-lab-accent shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-lab-text-secondary">Scientific Honesty Note</span>
          <p>
            This record reflects an educational toy-model experiment conducted locally in this browser. It is not a production-model benchmark and should not be compared directly with published BDH-CQ results.
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-detail-title"
        >
          <Card
            variant="standard"
            className="p-6 max-w-md w-full space-y-4 border-lab-danger/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="delete-detail-title" className="text-sm font-bold text-lab-text-primary">
              Delete Saved Run?
            </h3>
            <p className="text-xs text-lab-text-secondary">
              Are you sure you want to delete this saved experiment record? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                Delete Record
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExperimentDetail;
