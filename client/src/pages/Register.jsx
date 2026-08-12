import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';
import GoogleAuthButton from '../components/GoogleAuthButton';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setGoogleLoading(true);
    setTimeout(() => setGoogleLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      
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
        
        {/* Header */}
        <div className="text-center pt-2">
          <h2 className="text-3xl font-black font-outfit tracking-tight">Sign Up</h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-warning/15 border border-warning/40 text-warning px-4 py-3 rounded-xl text-xs font-bold flex items-start space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40" />
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
          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40" />
              <input 
                type="email" 
                required 
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-text/10 bg-background text-text text-sm placeholder-text/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              Password
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
            />
            <p className="text-[11px] text-text/50 font-medium mt-1">At least 8 characters recommended</p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-text text-background py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 group shadow-md mt-2"
          >
            <span>{isLoading ? 'Creating account...' : 'Create Account'}</span>
            {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center space-x-3 my-4">
          <div className="h-px flex-1 bg-text/10" />
          <span className="text-text/40 text-xs font-bold uppercase">or</span>
          <div className="h-px flex-1 bg-text/10" />
        </div>

        {/* Google Register */}
        <GoogleAuthButton 
          onClick={handleGoogleRegister} 
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
