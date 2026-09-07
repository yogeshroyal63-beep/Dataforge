import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Trash2,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Save,
  Download,
  Database,
} from 'lucide-react';

import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { getExperimentsAsync, clearExperiments } from '../services/experimentStorage';
import { exportExperimentsToJSON, exportExperimentsToCSV } from '../utils/exportExperiment';
import { ROUTES } from '../routes/routes';

export const Settings = () => {
  const { user, updateUserProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearMsg, setClearMsg] = useState('');
  const [experimentsCount, setExperimentsCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchCount = async () => {
      if (user?.uid) {
        try {
          const list = await getExperimentsAsync(user.uid);
          if (isMounted) setExperimentsCount(list.length);
        } catch (err) {
          console.error('Error fetching count in settings:', err);
        }
      }
    };

    fetchCount();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMsg('Display name cannot be empty.');
      return;
    }

    setIsUpdating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await updateUserProfile({ displayName: displayName.trim() });
      setSuccessMsg('Profile updated successfully.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportJSON = async () => {
    if (user?.uid) {
      const list = await getExperimentsAsync(user.uid);
      exportExperimentsToJSON(list);
    }
  };

  const handleExportCSV = async () => {
    if (user?.uid) {
      const list = await getExperimentsAsync(user.uid);
      exportExperimentsToCSV(list);
    }
  };

  const handleClearHistory = async () => {
    if (user?.uid) {
      await clearExperiments(user.uid);
      setShowClearConfirm(false);
      setExperimentsCount(0);
      setClearMsg('Experiment history has been permanently cleared from Cloud Firestore and local storage.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.HOME);
  };


  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 font-mono">
      {/* Header */}
      <div className="border-b border-lab-border pb-4">
        <h1 className="text-2xl font-bold text-lab-text-primary">
          Account & Lab Settings
        </h1>
        <p className="text-xs text-lab-text-secondary mt-1">
          Manage your researcher profile, browser storage, exports, and authentication session.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl text-xs">
        {/* Section 1: Profile Management */}
        <Card variant="standard" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-lab-border pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-lab-accent" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
                Researcher Profile
              </h2>
            </div>
            <Badge variant="accent" size="sm">Editable</Badge>
          </div>

          {successMsg && (
            <div className="p-3 rounded-lg bg-lab-success/10 border border-lab-success/30 text-lab-success flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-lab-danger/10 border border-lab-danger/30 text-lab-danger flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="settings-display-name" className="block text-xs font-semibold text-lab-text-primary">
                Display Name
              </label>
              <input
                id="settings-display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Dr. Claude Shannon"
                className="w-full px-3.5 py-2.5 bg-lab-secondary border border-lab-border rounded-lg text-sm text-lab-text-primary focus:outline-none focus:ring-1 focus:ring-lab-accent font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settings-email" className="block text-xs font-semibold text-lab-text-primary">
                Email Address (Managed by Firebase)
              </label>
              <input
                id="settings-email"
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 bg-lab-secondary/50 border border-lab-border rounded-lg text-sm text-lab-text-muted cursor-not-allowed font-mono"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isUpdating}
              disabled={isUpdating}
              icon={Save}
            >
              Save Profile Changes
            </Button>
          </form>
        </Card>

        {/* Section 2: Data Management & Export */}
        <Card variant="standard" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-lab-border pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-lab-accent" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
                Cloud Firestore & History
              </h2>
            </div>
            <Badge variant="research" size="sm">
              {experimentsCount} Record{experimentsCount === 1 ? '' : 's'}
            </Badge>
          </div>

          <p className="text-xs text-lab-text-secondary leading-relaxed">
            Experiment history is persisted to Cloud Firestore and cached locally, namespaced to your researcher profile (UID: {user?.uid}).
          </p>


          {/* Export options */}
          <div className="p-3.5 rounded-lg bg-lab-secondary/40 border border-lab-border space-y-2">
            <span className="text-[11px] font-bold text-lab-text-primary uppercase block">
              Export Personal History
            </span>
            <p className="text-[11px] text-lab-text-muted">
              Download your saved experiment records for offline analysis.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                icon={Download}
                disabled={experimentsCount === 0}
                onClick={handleExportCSV}
              >
                Export as CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Download}
                disabled={experimentsCount === 0}
                onClick={handleExportJSON}
              >
                Export as JSON
              </Button>
            </div>
          </div>

          {clearMsg && (
            <div className="p-3 rounded-lg bg-lab-success/10 border border-lab-success/30 text-lab-success flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{clearMsg}</span>
            </div>
          )}

          {showClearConfirm ? (
            <div className="p-4 rounded-xl bg-lab-danger/10 border border-lab-danger/40 space-y-3">
              <p className="text-xs text-lab-danger font-semibold">
                Clear all experiment history? This removes all StateLens experiment records stored for this account in this browser.
                <br />
                <span className="text-lab-text-muted font-normal mt-1 block">
                  This does not delete your StateLens account.
                </span>
              </p>
              <div className="flex items-center gap-2">
                <Button variant="danger" size="sm" onClick={handleClearHistory}>
                  Yes, Clear Storage
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              icon={Trash2}
              disabled={experimentsCount === 0}
              onClick={() => setShowClearConfirm(true)}
            >
              Clear Saved Experiment History
            </Button>
          )}
        </Card>

        {/* Section 3: Authentication & Sign Out */}
        <Card variant="standard" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-lab-border pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-lab-text-muted" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
                Session Control
              </h2>
            </div>
          </div>

          <p className="text-xs text-lab-text-secondary">
            Sign out of your StateLens researcher account on this device.
          </p>

          <Button variant="danger" size="md" icon={LogOut} onClick={handleSignOut}>
            Sign Out
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
