import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';
import GoogleAuthButton from '../components/GoogleAuthButton';
import ExitItLogo from '../components/ExitItLogo';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, googleRegister } = useContext(AuthContext);
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
      await googleRegister(response.credential);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google registration failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
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
              await googleRegister(tokenResponse.access_token);
              navigate('/');
            } catch (err) {
              setError(err.response?.data?.message || 'Google registration failed');
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
      
      {/* Back to Home Link */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-text/60 hover:text-text transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      {/* Centered Auth Card */}
      <div className="max-w-md w-full bg-card rounded-[32px] border border-text/10 shadow-2xl p-8 sm:p-10 space-y-6 relative z-10">
        
        {/* Brand Logo & Title Header */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <ExitItLogo size={36} />
            <span className="text-2xl font-black font-outfit tracking-tighter text-primary">
              EX-<span className="italic text-accent">IT</span>
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black font-outfit tracking-tight text-text">
            Create Account
          </h2>
          <p className="text-xs text-text/60 font-medium">
            Start mastering your 14 exit exam courses today
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-warning/15 border border-warning/40 text-warning px-4 py-3 rounded-xl text-xs font-bold flex items-start space-x-2">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Info Alert */}
        {info && (
          <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded-xl text-xs font-medium flex items-start space-x-2">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{info}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
              <input 
                type="text" 
                required 
                placeholder="Abebe Bikila"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-text/10 bg-background text-text text-sm placeholder-text/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
              <input 
                type="email" 
                required 
                placeholder="student@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-text/10 bg-background text-text text-sm placeholder-text/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text uppercase tracking-wider">
              Password
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
            />
            <p className="text-[11px] text-text/50 font-medium">At least 6 characters</p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-text text-background py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 group shadow-md active:scale-[0.99] mt-2"
          >
            <span>{isLoading ? 'Creating account...' : 'Create Account'}</span>
            {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center space-x-3 my-4">
          <div className="h-px flex-1 bg-text/10" />
          <span className="text-text/40 text-xs font-bold uppercase tracking-wider">or</span>
          <div className="h-px flex-1 bg-text/10" />
        </div>

        {/* Google Register */}
        <GoogleAuthButton 
          onClick={handleGoogleClick} 
          isLoading={googleLoading}
          text="Sign up with Google"
        />

        {/* Sign In Link */}
        <p className="text-center text-xs font-bold text-text/60 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-black">
            Sign in →
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
