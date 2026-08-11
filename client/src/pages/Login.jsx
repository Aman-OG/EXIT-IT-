import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ChevronRight, Shield, GraduationCap, Sparkles } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';
import GoogleAuthButton from '../components/GoogleAuthButton';
import ExitItLogo from '../components/ExitItLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setIsLoading(true);
    try {
      await login(demoEmail, demoPassword);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Google OAuth implementation would go here
    setTimeout(() => setGoogleLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30" />

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ExitItLogo size={60} />
          </div>
          <h1 className="text-4xl font-bold text-text mb-2">Welcome Back</h1>
          <p className="text-text/60 text-lg">Continue your exam preparation journey</p>
        </div>

        {/* Demo Accounts Quick Login */}
        <div className="bg-card/70 border border-primary/20 dark:border-primary/30 p-4 rounded-2xl mb-6 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Sparkles size={14} className="text-primary animate-pulse" />
              Quick Demo Access
            </span>
            <span className="text-[11px] text-text/50 font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
              pass: password123
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@demo.com', 'password123')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary transition-all group font-semibold text-xs sm:text-sm active:scale-95 disabled:opacity-50 shadow-sm"
              title="Sign in as Admin (admin@demo.com)"
            >
              <Shield size={16} className="text-primary group-hover:scale-110 transition-transform" />
              <span>Demo Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('student@demo.com', 'password123')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent transition-all group font-semibold text-xs sm:text-sm active:scale-95 disabled:opacity-50 shadow-sm"
              title="Sign in as Student (student@demo.com)"
            >
              <GraduationCap size={16} className="text-accent group-hover:scale-110 transition-transform" />
              <span>Demo Student</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-warning/15 border border-warning/40 text-warning px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-start space-x-2">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mb-6">
          {/* Email Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-text mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40" />
              <input 
                type="email" 
                required 
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-card text-text placeholder-text/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-text mb-2">Password</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
              Forgot password?
            </Link>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
          >
            <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            {!isLoading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
          <span className="text-text/50 text-sm font-medium">or</span>
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
        </div>

        {/* Google Login */}
        <GoogleAuthButton 
          onClick={handleGoogleLogin} 
          isLoading={googleLoading}
          text="Continue with Google"
        />

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-text/70">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
