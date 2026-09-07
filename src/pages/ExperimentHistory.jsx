import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  XCircle,
  FlaskConical,
  Search,
  ArrowUpDown,
  Download,
  Scale,
  Eye,
  Layers,
  ChevronDown,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { getExperimentsAsync, deleteExperiment, clearExperiments } from '../services/experimentStorage';
import { exportExperimentsToJSON, exportExperimentsToCSV } from '../utils/exportExperiment';
import { ROUTES } from '../routes/routes';

const PAGE_SIZE = 10;

export const ExperimentHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters state
  const [factCountFilter, setFactCountFilter] = useState('ALL');
  const [modelFilter, setModelFilter] = useState('ALL'); // 'ALL' | 'full' | 'linear' | 'both'
  const [resultFilter, setResultFilter] = useState('ALL'); // 'ALL' | 'full_correct' | 'linear_correct' | 'both_correct' | 'neither_correct'
  const [sortBy, setSortBy] = useState('NEWEST'); // 'NEWEST' | 'OLDEST' | 'FACT_ASC' | 'FACT_DESC'

  // Pagination display limit
  const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE);

  // Selected runs for side-by-side comparison
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  // Deletion modals state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadData = useCallback(async () => {
    if (user?.uid) {
      try {
        const list = await getExperimentsAsync(user.uid);
        setExperiments(list);
      } catch (err) {
        console.error('Error loading experiment history:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);



  // Handle Escape key for open modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (deleteTargetId) setDeleteTargetId(null);
        if (showClearConfirm) setShowClearConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteTargetId, showClearConfirm]);

  // Derived filtered & sorted list
  const filteredExperiments = useMemo(() => {
    let list = [...experiments];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((exp) => {
        const queryMatch = exp.query?.toLowerCase().includes(q);
        const factMatch = exp.factCount?.toString().includes(q);
        const expectedMatch = exp.expectedValue?.toString().toLowerCase().includes(q);
        const fullPredMatch = exp.fullAttention?.prediction?.toString().toLowerCase().includes(q);
        const linearPredMatch = exp.linearAttention?.prediction?.toString().toLowerCase().includes(q);
        const dateMatch = new Date(exp.createdAt).toLocaleDateString().toLowerCase().includes(q);
        return queryMatch || factMatch || expectedMatch || fullPredMatch || linearPredMatch || dateMatch;
      });
    }

    // Fact count filter
    if (factCountFilter !== 'ALL') {
      const targetCount = parseInt(factCountFilter, 10);
      list = list.filter((exp) => exp.factCount === targetCount);
    }

    // Model filter
    if (modelFilter === 'full') {
      list = list.filter((exp) => exp.fullAttention && !exp.linearAttention);
    } else if (modelFilter === 'linear') {
      list = list.filter((exp) => exp.linearAttention && !exp.fullAttention);
    } else if (modelFilter === 'both') {
      list = list.filter((exp) => exp.fullAttention && exp.linearAttention);
    }

    // Result filter
    if (resultFilter === 'full_correct') {
      list = list.filter((exp) => exp.fullAttention?.isCorrect === true);
    } else if (resultFilter === 'linear_correct') {
      list = list.filter((exp) => exp.linearAttention?.isCorrect === true);
    } else if (resultFilter === 'both_correct') {
      list = list.filter(
        (exp) => exp.fullAttention?.isCorrect === true && exp.linearAttention?.isCorrect === true
      );
    } else if (resultFilter === 'neither_correct') {
      list = list.filter(
        (exp) =>
          (exp.fullAttention ? exp.fullAttention.isCorrect === false : true) &&
          (exp.linearAttention ? exp.linearAttention.isCorrect === false : true)
      );
    }

    // Sorting (derived without mutating original)
    if (sortBy === 'NEWEST') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'OLDEST') {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'FACT_ASC') {
      list.sort((a, b) => a.factCount - b.factCount);
    } else if (sortBy === 'FACT_DESC') {
      list.sort((a, b) => b.factCount - a.factCount);
    }

    return list;
  }, [experiments, searchQuery, factCountFilter, modelFilter, resultFilter, sortBy]);

  const displayedList = useMemo(() => {
    return filteredExperiments.slice(0, displayLimit);
  }, [filteredExperiments, displayLimit]);

  // Unique fact counts in history for dynamic filter choices
  const availableFactCounts = useMemo(() => {
    return [...new Set(experiments.map((e) => e.factCount))].sort((a, b) => a - b);
  }, [experiments]);

  // Checkbox toggle for comparison
  const handleToggleCompare = (id) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        // Keep newest selection + previous second
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleRunComparison = () => {
    if (selectedForCompare.length === 2) {
      navigate(`${ROUTES.DASHBOARD_COMPARE}?a=${selectedForCompare[0]}&b=${selectedForCompare[1]}`);
    }
  };

  const handleDeleteSingle = async (id) => {
    if (user?.uid && id) {
      await deleteExperiment(user.uid, id);
      setSelectedForCompare((prev) => prev.filter((item) => item !== id));
      setDeleteTargetId(null);
      await loadData();
    }
  };

  const handleClearAll = async () => {
    if (user?.uid) {
      await clearExperiments(user.uid);
      setSelectedForCompare([]);
      setShowClearConfirm(false);
      await loadData();
    }
  };

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 font-mono">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-lab-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-lab-text-muted">
            <Link to={ROUTES.DASHBOARD} className="hover:text-lab-text-primary flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-lab-accent font-semibold">Experiment History</span>
          </div>
          <h1 className="text-2xl font-bold text-lab-text-primary">
            Saved Experiment History
          </h1>
          <p className="text-xs text-lab-text-secondary">
            {experiments.length} total saved experiment run{experiments.length === 1 ? '' : 's'} recorded for this researcher profile.
          </p>
        </div>


        {/* Global Export & Clear Actions */}
        {experiments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => exportExperimentsToCSV(experiments)}
            >
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => exportExperimentsToJSON(experiments)}
            >
              JSON
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={() => setShowClearConfirm(true)}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Compare Floating Action Bar */}
      {selectedForCompare.length > 0 && (
        <div className="p-3.5 rounded-xl bg-lab-secondary border border-lab-accent/50 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2 text-xs">
            <Scale className="w-4 h-4 text-lab-accent" />
            <span className="text-lab-text-primary font-bold">
              {selectedForCompare.length} of 2 runs selected for comparison
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={Scale}
              disabled={selectedForCompare.length !== 2}
              onClick={handleRunComparison}
            >
              Compare Selected Runs
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedForCompare([])}
            >
              Deselect
            </Button>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      {experiments.length > 0 && (
        <div className="p-4 rounded-xl bg-lab-secondary/40 border border-lab-border space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-lab-text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search probe, fact count, prediction, date…"
                className="w-full pl-9 pr-3.5 py-2 bg-lab-secondary border border-lab-border rounded-lg text-xs text-lab-text-primary placeholder:text-lab-text-muted focus:outline-none focus:ring-1 focus:ring-lab-accent"
              />
            </div>

            {/* Fact Count Filter */}
            <div className="md:col-span-2">
              <select
                value={factCountFilter}
                onChange={(e) => setFactCountFilter(e.target.value)}
                className="w-full px-2.5 py-2 bg-lab-secondary border border-lab-border rounded-lg text-xs text-lab-text-primary focus:outline-none focus:ring-1 focus:ring-lab-accent"
              >
                <option value="ALL">All Fact Counts</option>
                {availableFactCounts.map((fc) => (
                  <option key={fc} value={fc}>
                    N = {fc} facts
                  </option>
                ))}
              </select>
            </div>

            {/* Model Filter */}
            <div className="md:col-span-2">
              <select
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                className="w-full px-2.5 py-2 bg-lab-secondary border border-lab-border rounded-lg text-xs text-lab-text-primary focus:outline-none focus:ring-1 focus:ring-lab-accent"
              >
                <option value="ALL">All Models</option>
                <option value="full">Full Attention Only</option>
                <option value="linear">Linear Attention Only</option>
                <option value="both">Both Models</option>
              </select>
            </div>

            {/* Result Filter */}
            <div className="md:col-span-3">
              <select
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
                className="w-full px-2.5 py-2 bg-lab-secondary border border-lab-border rounded-lg text-xs text-lab-text-primary focus:outline-none focus:ring-1 focus:ring-lab-accent"
              >
                <option value="ALL">All Results</option>
                <option value="full_correct">Full Attention Correct</option>
                <option value="linear_correct">Linear Attention Correct</option>
                <option value="both_correct">Both Correct</option>
                <option value="neither_correct">Neither Correct</option>
              </select>
            </div>
          </div>

          {/* Sort bar & Results count */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-lab-border/40 text-[11px] text-lab-text-muted">
            <div className="flex items-center gap-2">
              <span>Showing {displayedList.length} of {filteredExperiments.length} matching experiment{filteredExperiments.length === 1 ? '' : 's'}</span>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-lab-text-muted" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 bg-lab-secondary border border-lab-border rounded text-[11px] text-lab-text-primary focus:outline-none focus:ring-1 focus:ring-lab-accent"
              >
                <option value="NEWEST">Newest First</option>
                <option value="OLDEST">Oldest First</option>
                <option value="FACT_ASC">Fact Count: Low → High</option>
                <option value="FACT_DESC">Fact Count: High → Low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Experiments List */}
      {isLoading ? (
        <Card variant="standard" className="p-12 text-center space-y-3 font-mono">
          <div className="w-7 h-7 border-2 border-lab-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-lab-text-secondary">Loading experiment history…</p>
        </Card>
      ) : displayedList.length > 0 ? (
        <div className="space-y-3">
          {displayedList.map((exp) => {
            const isSelected = selectedForCompare.includes(exp.id);
            return (
              <div
                key={exp.id}
                className={`p-4 rounded-xl border transition-all space-y-3 text-xs ${
                  isSelected
                    ? 'bg-lab-secondary/80 border-lab-accent shadow-md'
                    : 'bg-lab-secondary/40 border-lab-border hover:border-lab-border-light'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lab-border/40 pb-2.5">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleCompare(exp.id)}
                      className="rounded bg-lab-surface border-lab-border text-lab-accent focus:ring-lab-accent"
                      title="Select for comparison"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-lab-accent">
                        Probe: {exp.query}
                      </span>
                      <span className="text-lab-text-muted">→</span>
                      <span className="text-lab-text-primary font-bold">
                        Expected: {exp.expectedValue}
                      </span>
                      <Badge variant="research" size="sm">N = {exp.factCount} facts</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-lab-text-muted">
                      {new Date(exp.createdAt).toLocaleDateString()} {new Date(exp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => setDeleteTargetId(exp.id)}
                      className="p-1 text-lab-text-muted hover:text-lab-danger transition-colors rounded"
                      title="Delete run"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-center">
                  {/* Full Attention result */}
                  <div className="p-2.5 rounded bg-lab-bg/80 border border-lab-border flex items-center justify-between">
                    <span className="text-lab-purple font-semibold flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Full Attention
                    </span>
                    {exp.fullAttention ? (
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>Pred: {exp.fullAttention.prediction}</span>
                        {exp.fullAttention.isCorrect ? (
                          <span className="text-lab-accent inline-flex items-center gap-0.5 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ✓
                          </span>
                        ) : (
                          <span className="text-lab-danger inline-flex items-center gap-0.5 text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> ✕
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-lab-text-muted text-[11px]">Not evaluated</span>
                    )}
                  </div>

                  {/* Linear Attention result */}
                  <div className="p-2.5 rounded bg-lab-bg/80 border border-lab-border flex items-center justify-between">
                    <span className="text-lab-accent font-semibold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Linear Attention
                    </span>
                    {exp.linearAttention ? (
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>Pred: {exp.linearAttention.prediction}</span>
                        {exp.linearAttention.isCorrect ? (
                          <span className="text-lab-accent inline-flex items-center gap-0.5 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ✓
                          </span>
                        ) : (
                          <span className="text-lab-warning inline-flex items-center gap-0.5 text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> ✕
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-lab-text-muted text-[11px]">Not evaluated</span>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="flex justify-end">
                    <Link to={ROUTES.DASHBOARD_HISTORY_DETAIL(exp.id)}>
                      <Button variant="ghost" size="sm">
                        View Detail →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Load More Pagination */}
          {filteredExperiments.length > displayLimit && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                size="sm"
                icon={ChevronDown}
                onClick={() => setDisplayLimit((prev) => prev + PAGE_SIZE)}
              >
                Load {Math.min(PAGE_SIZE, filteredExperiments.length - displayLimit)} More Runs
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card variant="standard" className="p-8 text-center space-y-4">
          <History className="w-8 h-8 text-lab-text-muted mx-auto" />
          <p className="text-xs text-lab-text-secondary">
            {experiments.length === 0
              ? 'No saved experiments in your account yet.'
              : 'No saved experiments match your active search and filter criteria.'}
          </p>
          <Link to={ROUTES.EXPERIMENT}>
            <Button variant="primary" size="sm" icon={FlaskConical}>
              Run a New Experiment
            </Button>
          </Link>
        </Card>
      )}


      {/* Delete Single Run Confirmation Modal */}
      {deleteTargetId && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteTargetId(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-history-record-title"
        >
          <Card
            variant="standard"
            className="p-6 max-w-md w-full space-y-4 border-lab-danger/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="delete-history-record-title" className="text-sm font-bold text-lab-text-primary">
              Delete Experiment Record
            </h3>
            <p className="text-xs text-lab-text-secondary">
              Delete this saved experiment? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setDeleteTargetId(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDeleteSingle(deleteTargetId)}>
                Delete Record
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Clear All History Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowClearConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-history-title"
        >
          <Card
            variant="standard"
            className="p-6 max-w-md w-full space-y-4 border-lab-danger/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="clear-history-title" className="text-sm font-bold text-lab-danger">
              Clear All Saved History?
            </h3>
            <p className="text-xs text-lab-text-secondary leading-relaxed">
              This removes all StateLens experiment records stored for this account in this browser.
              <br />
              <span className="text-lab-text-muted mt-1 block">
                This does not delete your StateLens account.
              </span>
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleClearAll}>
                Yes, Clear All
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExperimentHistory;
