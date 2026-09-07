import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, UserPlus } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/routes';

export const SignUp = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await signUp(email, password, displayName);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create account. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2 font-mono">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-lab-accent/15 border border-lab-accent/40 flex items-center justify-center text-lab-accent font-bold text-base">
              SL
            </div>
            <span className="text-xl font-bold tracking-tight text-lab-text-primary">
              StateLens
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-lab-text-primary">Create an account</h1>
          <p className="text-xs text-lab-text-secondary">
            Save experiments, track multi-condition retention curves, and manage your personal lab state.
          </p>
        </div>

        <Card variant="standard" className="p-6 sm:p-8 space-y-5 font-mono text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-lab-danger/10 border border-lab-danger/30 text-lab-danger flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="block text-xs font-semibold text-lab-text-primary">
                Display Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-lab-text-muted absolute left-3 top-3" />
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Dr. Claude Shannon"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-lab-secondary border border-lab-border rounded-lg text-sm text-lab-text-primary placeholder:text-lab-text-muted/50 focus:outline-none focus:ring-1 focus:ring-lab-accent focus:border-lab-accent"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="block text-xs font-semibold text-lab-text-primary">
                Email Address <span className="text-lab-accent">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-lab-text-muted absolute left-3 top-3" />
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@lab.org"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-lab-secondary border border-lab-border rounded-lg text-sm text-lab-text-primary placeholder:text-lab-text-muted/50 focus:outline-none focus:ring-1 focus:ring-lab-accent focus:border-lab-accent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="block text-xs font-semibold text-lab-text-primary">
                Password (min. 6 characters) <span className="text-lab-accent">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-lab-text-muted absolute left-3 top-3" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-lab-secondary border border-lab-border rounded-lg text-sm text-lab-text-primary placeholder:text-lab-text-muted/50 focus:outline-none focus:ring-1 focus:ring-lab-accent focus:border-lab-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-lab-text-muted hover:text-lab-text-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="signup-confirm-password" className="block text-xs font-semibold text-lab-text-primary">
                Confirm Password <span className="text-lab-accent">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-lab-text-muted absolute left-3 top-3" />
                <input
                  id="signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-lab-secondary border border-lab-border rounded-lg text-sm text-lab-text-primary placeholder:text-lab-text-muted/50 focus:outline-none focus:ring-1 focus:ring-lab-accent focus:border-lab-accent"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              disabled={isLoading}
              icon={UserPlus}
            >
              {isLoading ? 'Creating Account…' : 'Create Account'}
            </Button>
          </form>

          <div className="pt-3 border-t border-lab-border text-center space-y-2">
            <p className="text-[11px] text-lab-text-secondary">
              Already have an account?{' '}
              <Link to={ROUTES.SIGN_IN} className="text-lab-accent font-bold hover:underline">
                Sign in
              </Link>
            </p>

            <Link
              to={ROUTES.EXPERIMENT}
              className="inline-flex items-center gap-1 text-[11px] text-lab-text-muted hover:text-lab-text-secondary transition-colors"
            >
              <span>← Continue exploring without signing in</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
