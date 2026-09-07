import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Settings, LogOut, Cpu, ArrowLeft, Menu, X, Scale } from 'lucide-react';
import { ROUTES } from '../routes/routes';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

/**
 * AppLayout — Authenticated workspace shell for dashboard, history, and settings.
 */
export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Saved History', path: ROUTES.DASHBOARD_HISTORY, icon: History },
    { label: 'Compare Runs', path: ROUTES.DASHBOARD_COMPARE, icon: Scale },
    { label: 'Settings', path: ROUTES.DASHBOARD_SETTINGS, icon: Settings },
  ];

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen flex bg-lab-bg text-lab-text-primary font-mono">
      {/* Skip to Main Content Link for Keyboard / Screen Reader Users */}
      <a
        href="#workspace-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-lab-accent focus:text-lab-bg focus:rounded-lg focus:font-mono focus:text-xs focus:font-bold focus:shadow-lg focus:outline-none"
      >
        Skip to workspace content
      </a>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        aria-label="Workspace navigation"
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-lab-surface border-r border-lab-border flex flex-col
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-lab-border flex items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-lab-accent to-lab-purple flex items-center justify-center text-lab-bg">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-lab-text-primary">
              State<span className="text-lab-accent">Lens</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-lab-text-secondary hover:text-lab-text-primary p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-4 mx-4 my-3 bg-lab-secondary/60 rounded-xl border border-lab-border/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-lab-accent/20 border border-lab-accent/40 flex items-center justify-center text-lab-accent font-bold text-xs">
            {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-lab-text-primary truncate">
              {user?.displayName || 'Researcher'}
            </p>
            <p className="text-[10px] text-lab-text-muted truncate">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ROUTES.DASHBOARD}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors
                  ${isActive
                    ? 'bg-lab-accent/15 text-lab-accent border border-lab-accent/30 font-bold'
                    : 'text-lab-text-secondary hover:text-lab-text-primary hover:bg-lab-secondary'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-lab-border space-y-1.5">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-lab-text-secondary hover:text-lab-text-primary hover:bg-lab-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-lab-danger hover:bg-lab-danger/10 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 px-4 sm:px-6 border-b border-lab-border bg-lab-surface/50 backdrop-blur-sm flex items-center justify-between md:justify-end">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-lab-text-secondary hover:text-lab-text-primary hover:bg-lab-surface"
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.EXPERIMENT}
              className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg bg-lab-accent/10 border border-lab-accent/30 text-lab-accent hover:bg-lab-accent/20 transition-colors"
            >
              Open Live Lab →
            </Link>
          </div>
        </header>

        <main id="workspace-main-content" tabIndex="-1" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-content w-full mx-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
