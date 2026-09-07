import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/routes';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2 font-mono">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-lab-accent/15 border border-lab-accent/40 flex items-center justify-center text-lab-accent font-bold text-base">
              SL
            </div>
            <span className="text-xl font-bold tracking-tight text-lab-text-primary">
              StateLens
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-lab-text-primary">Reset password</h1>
          <p className="text-xs text-lab-text-secondary">
            Enter your email address and we&rsquo;ll send you a link to reset your account password.
          </p>
        </div>

        <Card variant="standard" className="p-6 sm:p-8 space-y-5 font-mono text-xs">
          {isSubmitted ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-lab-success/15 border border-lab-success/30 flex items-center justify-center text-lab-success mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-lab-text-primary">
                  Check your inbox
                </h3>
                <p className="text-xs text-lab-text-secondary leading-relaxed">
                  If an account exists for <span className="text-lab-accent font-bold">{email}</span>, a password reset email has been sent.
                </p>
              </div>

              <div className="pt-2">
                <Link to={ROUTES.SIGN_IN}>
                  <Button variant="primary" size="md" className="w-full">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3.5 rounded-xl bg-lab-danger/10 border border-lab-danger/30 text-lab-danger flex items-start gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="reset-email" className="block text-xs font-semibold text-lab-text-primary">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-lab-text-muted absolute left-3 top-3" />
                    <input
                      id="reset-email"
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

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  isLoading={isLoading}
                  disabled={isLoading}
                  icon={KeyRound}
                >
                  {isLoading ? 'Sending Reset Email…' : 'Send Reset Link'}
                </Button>
              </form>

              <div className="pt-3 border-t border-lab-border text-center">
                <Link
                  to={ROUTES.SIGN_IN}
                  className="inline-flex items-center gap-1.5 text-xs text-lab-accent hover:underline font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
