/**
 * Normalize Firebase Auth error codes into human-friendly messages.
 *
 * @param {Error|{code?: string, message?: string}} error
 * @returns {string} Clean readable error message
 */
export function normalizeAuthError(error) {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'The email or password is incorrect. Please check your credentials.';

    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';

    case 'auth/weak-password':
      return 'Please choose a stronger password (at least 6 characters).';

    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Access has been temporarily restricted. Please try again later or reset your password.';

    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';

    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact support.';

    case 'auth/requires-recent-login':
      return 'This sensitive operation requires a recent sign-in. Please sign in again.';

    case 'auth/popup-closed-by-user':
      return 'The sign-in popup was closed before completing authentication.';

    default:
      if (error.message && !error.message.includes('Firebase:')) {
        return error.message;
      }
      return 'Authentication failed. Please verify your details and try again.';
  }
}
