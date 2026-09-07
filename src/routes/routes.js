/**
 * Centralized Route Constants for StateLens
 * Ensures all internal links and navigation use verified paths.
 */
export const ROUTES = {
  HOME: '/',
  EXPERIMENT: '/experiment',
  BDH_CQ: '/bdh-cq',
  LIMITATION: '/limitation',
  SOURCES: '/sources',

  // Authentication routes
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',

  // Protected dashboard routes
  DASHBOARD: '/dashboard',
  DASHBOARD_HISTORY: '/dashboard/history',
  DASHBOARD_HISTORY_DETAIL: (id = ':id') => `/dashboard/history/${id}`,
  DASHBOARD_COMPARE: '/dashboard/compare',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  SETTINGS: '/settings',
};

export const NAV_LINKS = [
  { label: 'Explore', path: ROUTES.HOME },
  { label: 'Experiment', path: ROUTES.EXPERIMENT },
  { label: 'BDH-CQ', path: ROUTES.BDH_CQ },
  { label: 'Limitation', path: ROUTES.LIMITATION },
  { label: 'Sources', path: ROUTES.SOURCES },
];

export default ROUTES;
