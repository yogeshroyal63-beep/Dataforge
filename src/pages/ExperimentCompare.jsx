import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Scale, Eye, Layers, AlertTriangle, Download } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { getExperimentsAsync } from '../services/experimentStorage';
import { exportExperimentsToJSON } from '../utils/exportExperiment';
import { ROUTES } from '../routes/routes';


export const ExperimentCompare = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [experiments, setExperiments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const idA = searchParams.get('a') || '';
  const idB = searchParams.get('b') || '';

  const [selectedIdA, setSelectedIdA] = useState(idA);
  const [selectedIdB, setSelectedIdB] = useState(idB);

  useEffect(() => {
    let isMounted = true;
    const loadList = async () => {
      if (user?.uid) {
        setIsLoading(true);
        try {
          const list = await getExperimentsAsync(user.uid);
          if (isMounted) {
            setExperiments(list);

            // Auto select first 2 if none selected in URL
            if (!idA && list.length > 0) {
              setSelectedIdA(list[0].id);
            }
            if (!idB && list.length > 1) {
              setSelectedIdB(list[1].id);
            } else if (!idB && list.length === 1) {
              setSelectedIdB(list[0].id);
            }
          }
        } catch (err) {
          console.error('Error loading experiments for compare:', err);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else {
        if (isMounted) setIsLoading(false);
      }
    };

    loadList();
    return () => {
      isMounted = false;
    };
  }, [user, idA, idB]);


  const recordA = useMemo(() => experiments.find((e) => e.id === selectedIdA) || null, [experiments, selectedIdA]);
  const recordB = useMemo(() => experiments.find((e) => e.id === selectedIdB) || null, [experiments, selectedIdB]);

  const comparison = useMemo(() => {
    if (!recordA || !recordB) return null;
    return compareExperiments(recordA, recordB);
  }, [recordA, recordB]);

  const handleSelectA = (e) => {
    const id = e.target.value;
    setSelectedIdA(id);
    setSearchParams({ a: id, b: selectedIdB });
  };

  const handleSelectB = (e) => {
    const id = e.target.value;
    setSelectedIdB(id);
    setSearchParams({ a: selectedIdA, b: id });
  };

  const handleExportBoth = () => {
    if (recordA && recordB) {
      exportExperimentsToJSON([recordA, recordB], `statelens-comparison-${recordA.id}-${recordB.id}.json`);
    }
  };

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 font-mono">
      {/* Header */}
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
            <span className="text-lab-accent font-semibold">Compare Runs</span>
          </div>
          <h1 className="text-2xl font-bold text-lab-text-primary flex items-center gap-2.5">
            <Scale className="w-6 h-6 text-lab-accent" />
            Compare Saved Experiments
          </h1>
          <p className="text-xs text-lab-text-secondary">
            Side-by-side comparative analysis of two saved StateLens experiment runs.
          </p>
        </div>

        {recordA && recordB && (
          <Button variant="secondary" size="sm" icon={Download} onClick={handleExportBoth}>
            Export Both (JSON)
          </Button>
        )}
      </div>

      {/* Selectors Bar */}
      {isLoading ? (
        <Card variant="standard" className="p-8 text-center space-y-3 font-mono">
          <div className="w-6 h-6 border-2 border-lab-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-lab-text-secondary">Loading comparison runs…</p>
        </Card>
      ) : experiments.length >= 2 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="standard" className="p-4 space-y-2">
            <label htmlFor="compare-select-a" className="text-xs font-bold text-lab-purple uppercase flex items-center gap-1.5">
              <span>Run A</span>
              <Badge variant="research" size="sm">Primary</Badge>
            </label>
            <select
              id="compare-select-a"
              value={selectedIdA}
              onChange={handleSelectA}
              className="w-full px-3 py-2 bg-lab-secondary border border-lab-border rounded-lg text-xs text-lab-text-primary focus:outline-none focus:ring-1 focus:ring-lab-purple font-mono"
            >
              {experiments.map((exp) => (
                <option key={`a-${exp.id}`} value={exp.id}>
                  {exp.query} (N={exp.factCount}) • {new Date(exp.createdAt).toLocaleDateString()} {new Date(exp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </option>
              ))}
            </select>
          </Card>

          <Card variant="standard" className="p-4 space-y-2">
            <label htmlFor="compare-select-b" className="text-xs font-bold text-lab-accent uppercase flex items-center gap-1.5">
              <span>Run B</span>
              <Badge variant="accent" size="sm">Comparison</Badge>
            </label>
            <select
              id="compare-select-b"
              value={selectedIdB}
              onChange={handleSelectB}
              className="w-full px-3 py-2 bg-lab-secondary border border-lab-border rounded-lg text-xs text-lab-text-primary focus:outline-none focus:ring-1 focus:ring-lab-accent font-mono"
            >
              {experiments.map((exp) => (
                <option key={`b-${exp.id}`} value={exp.id}>
                  {exp.query} (N={exp.factCount}) • {new Date(exp.createdAt).toLocaleDateString()} {new Date(exp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </option>
              ))}
            </select>
          </Card>
        </div>
      ) : (
        <Card variant="standard" className="p-8 text-center space-y-3">
          <p className="text-xs text-lab-text-secondary">
            You need at least two saved experiments to perform a side-by-side run comparison.
          </p>
          <Link to={ROUTES.EXPERIMENT}>
            <Button variant="primary" size="sm">
              Run & Save Experiments
            </Button>
          </Link>
        </Card>
      )}


      {/* Side-by-Side Comparison Breakdown */}
      {recordA && recordB && (
        <div className="space-y-6">
          {recordA.id === recordB.id && (
            <div className="p-3.5 rounded-xl bg-lab-purple/10 border border-lab-purple/30 text-lab-purple text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Notice: You are comparing the identical experiment run ({recordA.id}) in both slots. Select a different run in either selector for contrast.
              </span>
            </div>
          )}

          {/* High-level comparative table */}
          <Card variant="standard" className="p-5 space-y-4">
            <div className="border-b border-lab-border pb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
                Run Configuration & Outcomes
              </h2>
              <Badge variant="research" size="sm">
                Empirical Saved Data
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-lab-border text-lab-text-muted text-[11px]">
                    <th className="py-2.5 px-3 font-semibold">Parameter / Metric</th>
                    <th className="py-2.5 px-3 font-bold text-lab-purple">Run A ({recordA.query})</th>
                    <th className="py-2.5 px-3 font-bold text-lab-accent">Run B ({recordB.query})</th>
                    <th className="py-2.5 px-3 font-semibold">Comparative Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lab-border/40">
                  <tr>
                    <td className="py-2.5 px-3 text-lab-text-secondary">Sequence Length (N)</td>
                    <td className="py-2.5 px-3 font-bold text-lab-text-primary">{recordA.factCount} facts</td>
                    <td className="py-2.5 px-3 font-bold text-lab-text-primary">{recordB.factCount} facts</td>
                    <td className="py-2.5 px-3 text-lab-text-muted">
                      {recordA.factCount === recordB.factCount ? 'Identical length' : `Δ = ${Math.abs(recordA.factCount - recordB.factCount)} facts`}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 text-lab-text-secondary">Target Probe Key</td>
                    <td className="py-2.5 px-3 font-bold text-lab-accent">{recordA.query}</td>
                    <td className="py-2.5 px-3 font-bold text-lab-accent">{recordB.query}</td>
                    <td className="py-2.5 px-3 text-lab-text-muted">
                      {recordA.query === recordB.query ? 'Same probe key' : 'Distinct probe keys'}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 text-lab-text-secondary">Expected Ground Truth</td>
                    <td className="py-2.5 px-3 font-bold text-lab-text-primary">{recordA.expectedValue}</td>
                    <td className="py-2.5 px-3 font-bold text-lab-text-primary">{recordB.expectedValue}</td>
                    <td className="py-2.5 px-3 text-lab-text-muted">—</td>
                  </tr>

                  {/* Full Attention row */}
                  <tr>
                    <td className="py-2.5 px-3 text-lab-text-secondary">
                      <span className="flex items-center gap-1.5 text-lab-purple font-semibold">
                        <Eye className="w-3.5 h-3.5" />
                        Full Attention
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {recordA.fullAttention ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold">{recordA.fullAttention.prediction}</span>
                          {recordA.fullAttention.isCorrect ? (
                            <span className="text-lab-accent text-[11px] font-semibold">✓ Correct</span>
                          ) : (
                            <span className="text-lab-danger text-[11px] font-semibold">✕ Mismatch</span>
                          )}
                          <span className="text-[10px] text-lab-text-muted">({recordA.fullAttention.confidence}%)</span>
                        </div>
                      ) : (
                        <span className="text-lab-text-muted">Not run</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {recordB.fullAttention ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold">{recordB.fullAttention.prediction}</span>
                          {recordB.fullAttention.isCorrect ? (
                            <span className="text-lab-accent text-[11px] font-semibold">✓ Correct</span>
                          ) : (
                            <span className="text-lab-danger text-[11px] font-semibold">✕ Mismatch</span>
                          )}
                          <span className="text-[10px] text-lab-text-muted">({recordB.fullAttention.confidence}%)</span>
                        </div>
                      ) : (
                        <span className="text-lab-text-muted">Not run</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-lab-text-muted">
                      {recordA.fullAttention && recordB.fullAttention
                        ? recordA.fullAttention.isCorrect === recordB.fullAttention.isCorrect
                          ? 'Consistent verification'
                          : 'Divergent outcome'
                        : '—'}
                    </td>
                  </tr>

                  {/* Linear Attention row */}
                  <tr>
                    <td className="py-2.5 px-3 text-lab-text-secondary">
                      <span className="flex items-center gap-1.5 text-lab-accent font-semibold">
                        <Layers className="w-3.5 h-3.5" />
                        Linear Attention
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {recordA.linearAttention ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold">{recordA.linearAttention.prediction}</span>
                          {recordA.linearAttention.isCorrect ? (
                            <span className="text-lab-accent text-[11px] font-semibold">✓ Correct</span>
                          ) : (
                            <span className="text-lab-warning text-[11px] font-semibold">✕ Interference</span>
                          )}
                          <span className="text-[10px] text-lab-text-muted">({recordA.linearAttention.confidence}%)</span>
                        </div>
                      ) : (
                        <span className="text-lab-text-muted">Not run</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {recordB.linearAttention ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold">{recordB.linearAttention.prediction}</span>
                          {recordB.linearAttention.isCorrect ? (
                            <span className="text-lab-accent text-[11px] font-semibold">✓ Correct</span>
                          ) : (
                            <span className="text-lab-warning text-[11px] font-semibold">✕ Interference</span>
                          )}
                          <span className="text-[10px] text-lab-text-muted">({recordB.linearAttention.confidence}%)</span>
                        </div>
                      ) : (
                        <span className="text-lab-text-muted">Not run</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-lab-text-muted">
                      {recordA.linearAttention && recordB.linearAttention
                        ? recordA.linearAttention.isCorrect === recordB.linearAttention.isCorrect
                          ? 'Consistent verification'
                          : 'Divergent outcome'
                        : '—'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Original Facts Sequences side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Run A Facts */}
            <Card variant="standard" className="p-4 space-y-3 border-lab-purple/30">
              <div className="flex items-center justify-between border-b border-lab-border pb-2">
                <span className="font-bold text-lab-purple uppercase">Run A Input Facts ({recordA.facts?.length || recordA.factCount})</span>
                <Badge variant="research" size="sm">Probe: {recordA.query}</Badge>
              </div>
              {recordA.facts && recordA.facts.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {recordA.facts.map((f, i) => {
                    const isTarget = f.key === recordA.query;
                    return (
                      <span
                        key={`fa-${i}`}
                        className={`px-2 py-1 rounded border text-[11px] font-mono ${
                          isTarget
                            ? 'bg-lab-purple/20 border-lab-purple text-lab-purple font-bold'
                            : 'bg-lab-secondary/60 border-lab-border text-lab-text-secondary'
                        }`}
                      >
                        {f.key} → {f.value}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-lab-text-muted">Original fact list unavailable for this saved run.</p>
              )}
            </Card>

            {/* Run B Facts */}
            <Card variant="standard" className="p-4 space-y-3 border-lab-accent/30">
              <div className="flex items-center justify-between border-b border-lab-border pb-2">
                <span className="font-bold text-lab-accent uppercase">Run B Input Facts ({recordB.facts?.length || recordB.factCount})</span>
                <Badge variant="accent" size="sm">Probe: {recordB.query}</Badge>
              </div>
              {recordB.facts && recordB.facts.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {recordB.facts.map((f, i) => {
                    const isTarget = f.key === recordB.query;
                    return (
                      <span
                        key={`fb-${i}`}
                        className={`px-2 py-1 rounded border text-[11px] font-mono ${
                          isTarget
                            ? 'bg-lab-accent/20 border-lab-accent text-lab-accent font-bold'
                            : 'bg-lab-secondary/60 border-lab-border text-lab-text-secondary'
                        }`}
                      >
                        {f.key} → {f.value}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-lab-text-muted">Original fact list unavailable for this saved run.</p>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentCompare;
