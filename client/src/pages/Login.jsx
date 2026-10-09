import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, ShieldCheck, Sparkles, Flame, BookOpen, Mail } from 'lucide-react';
import GoogleAuthButton from '../components/GoogleAuthButton';
import ExitItLogo from '../components/ExitItLogo';

const Login = () => {
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1066496819724-5iofv93blinefc2tqhktmnl5a5dm65il.apps.googleusercontent.com';

  // Initialize Google Identity Services if client ID is configured
  useEffect(() => {
    if (googleClientId && window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
      });
    }
  }, [googleClientId]);

  const handleGoogleCredentialResponse = async (response) => {
    if (!response.credential) return;
    setGoogleLoading(true);
    setError('');
    setInfo('');
    try {
      await googleLogin(response.credential);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setError('');
    setInfo('');

    if (!googleClientId) {
      setError('Google Client ID is missing in client/.env');
      return;
    }

    // Modern Google Identity Services OAuth2 Token Popup Flow
    if (window.google?.accounts?.oauth2) {
      setGoogleLoading(true);
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse?.access_token) {
            try {
              await googleLogin(tokenResponse.access_token);
              navigate('/');
            } catch (err) {
              setError(err.response?.data?.message || 'Google sign in failed');
            } finally {
              setGoogleLoading(false);
            }
          } else {
            setGoogleLoading(false);
          }
        },
        error_callback: (err) => {
          setGoogleLoading(false);
          console.error('Google OAuth error:', err);
          setError('Google authentication was cancelled or encountered an error.');
        }
      });
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } else if (window.google?.accounts?.id) {
      setGoogleLoading(true);
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setGoogleLoading(false);
        }
      });
    } else {
      setError('Google Sign-In is initializing. Please try again in a second.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden font-inter">
      
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Link */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-text/60 hover:text-text transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      {/* Centered Auth Card */}
      <div className="max-w-md w-full bg-card rounded-[32px] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-8 sm:p-10 space-y-6 relative z-10">
        
        {/* Brand Logo & Title Header */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <ExitItLogo size={42} />
            <span className="text-2xl font-black font-outfit tracking-tighter text-primary">
              EX-<span className="italic text-accent">IT</span>
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black font-outfit tracking-tight text-text">
            Welcome to EXIT-IT
          </h2>
          <p className="text-xs text-text/60 font-medium max-w-xs">
            Sign in with your Google account to sync your study progress, streak reminders, and mock exam scores.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-2xl text-xs font-bold flex items-start space-x-2 animate-in fade-in duration-200">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Info Alert */}
        {info && (
          <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded-2xl text-xs font-medium flex items-start space-x-2 animate-in fade-in duration-200">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{info}</span>
          </div>
        )}

        {/* Benefits Checklist */}
        <div className="bg-background/80 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-4 space-y-2.5 text-xs text-text/80">
          <div className="flex items-center space-x-2 text-text/90 font-bold">
            <Sparkles size={15} className="text-amber-500 shrink-0" />
            <span>1-Click Seamless Authentication</span>
          </div>
          <ul className="space-y-2 text-text/70 text-[11px] leading-relaxed pl-1">
            <li className="flex items-center space-x-2">
              <Mail size={13} className="text-primary shrink-0" />
              <span>Receive daily streak savers & exam alerts via email</span>
            </li>
            <li className="flex items-center space-x-2">
              <Flame size={13} className="text-amber-500 shrink-0" />
              <span>Instant cloud sync across your devices</span>
            </li>
            <li className="flex items-center space-x-2">
              <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
              <span>Anonymous mode enabled by default for privacy</span>
            </li>
          </ul>
        </div>

        {/* Google Authentication Button */}
        <div className="pt-2">
          <GoogleAuthButton 
            onClick={handleGoogleClick} 
            isLoading={googleLoading}
            text="Continue with Google"
          />
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-xs font-bold text-text/60 pt-1">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-black">
            Sign up now →
          </Link>
        </p>

        {/* Privacy & Terms Note */}
        <p className="text-center text-[11px] text-text/50 font-medium leading-relaxed pt-1">
          By signing in, you agree to our Terms of Service. We only use your verified Google email for platform communications.
        </p>

      </div>
    </div>
  );
};

export default Login;
