import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getExperimentsAsync } from '../services/experimentStorage';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardStats from '../components/dashboard/DashboardStats';
import PerformanceOverview from '../components/dashboard/PerformanceOverview';
import SavedAccuracyChart from '../components/dashboard/SavedAccuracyChart';
import FactCountTrend from '../components/dashboard/FactCountTrend';
import ResearchInsights from '../components/dashboard/ResearchInsights';
import RecentExperiments from '../components/dashboard/RecentExperiments';
import ResearchPath from '../components/dashboard/ResearchPath';
import EmptyState from '../components/dashboard/EmptyState';

export const Dashboard = () => {
  const { user } = useAuth();
  const [experiments, setExperiments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadData = useCallback(async () => {
    if (!user?.uid) {
      setExperiments([]);
      setIsLoading(false);
      return;
    }

    try {
      const data = await getExperimentsAsync(user.uid);
      setExperiments(data);
      setLoadError(null);
    } catch (err) {
      console.error('Error loading dashboard experiments:', err);
      setLoadError('Unable to load experiment history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);


  useEffect(() => {
    loadData();

    // Cross-tab synchronization
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('statelens_experiments_')) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadData]);

  const hasData = experiments.length > 0;

  if (isLoading) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center font-mono">
        <div className="w-8 h-8 border-2 border-lab-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-lab-text-secondary">Loading your research workspace…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center font-mono space-y-4">
        <p className="text-xs text-lab-danger">{loadError}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-lg bg-lab-secondary border border-lab-border text-xs text-lab-text-primary hover:bg-lab-surface"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 font-mono">
      {/* Researcher Welcome Header */}
      <DashboardHeader
        displayName={user?.displayName}
        email={user?.email}
        createdAt={user?.createdAt}
      />

      {hasData ? (
        <>
          {/* Key Metric Cards */}
          <DashboardStats experiments={experiments} />

          {/* Aggregate Model Performance Overview */}
          <PerformanceOverview experiments={experiments} />

          {/* Visual Analytics Grid: Accuracy Curve & Sequence Length Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <SavedAccuracyChart experiments={experiments} />
            </div>
            <div className="lg:col-span-5">
              <FactCountTrend experiments={experiments} />
            </div>
          </div>

          {/* Recent Runs & Personal Research Observations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <RecentExperiments experiments={experiments} />
            </div>
            <div className="lg:col-span-5">
              <ResearchInsights experiments={experiments} />
            </div>
          </div>

          {/* Interactive Milestone Progression */}
          <ResearchPath experiments={experiments} />
        </>
      ) : (
        <div className="space-y-8">
          <EmptyState />
          <ResearchPath experiments={experiments} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
