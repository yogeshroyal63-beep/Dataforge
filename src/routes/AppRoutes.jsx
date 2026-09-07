import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AppLayout from '../layouts/AppLayout';

// Protected Route Guard
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Landing from '../pages/Landing';
import Experiment from '../pages/Experiment';
import BDHCQ from '../pages/BDHCQ';
import Limitation from '../pages/Limitation';
import Sources from '../pages/Sources';

// Auth Pages
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';

// Workspace / Dashboard Pages
import Dashboard from '../pages/Dashboard';
import ExperimentHistory from '../pages/ExperimentHistory';
import ExperimentDetail from '../pages/ExperimentDetail';
import ExperimentCompare from '../pages/ExperimentCompare';
import Settings from '../pages/Settings';

// Fallback
import NotFound from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages with Main Header & Footer */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route path={ROUTES.EXPERIMENT} element={<Experiment />} />
        <Route path={ROUTES.BDH_CQ} element={<BDHCQ />} />
        <Route path={ROUTES.LIMITATION} element={<Limitation />} />
        <Route path={ROUTES.SOURCES} element={<Sources />} />

        {/* Authentication Pages under Public Layout */}
        <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

        {/* 404 Route under Public Layout */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Protected Workspace & Dashboard Pages */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.DASHBOARD_HISTORY} element={<ExperimentHistory />} />
        <Route path="/dashboard/history/:id" element={<ExperimentDetail />} />
        <Route path={ROUTES.DASHBOARD_COMPARE} element={<ExperimentCompare />} />
        <Route path="/dashboard/history/compare" element={<ExperimentCompare />} />
        <Route path={ROUTES.DASHBOARD_SETTINGS} element={<Settings />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
        <Route path="/experiments" element={<ExperimentHistory />} />
        <Route path="/experiments/:id" element={<ExperimentDetail />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
