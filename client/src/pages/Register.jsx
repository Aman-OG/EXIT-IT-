import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-xl shadow-md p-8 border border-neutral-200 dark:border-neutral-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">EXIT<span className="text-accent">-IT</span></h2>
          <p className="text-text/70 mt-2">Create an account to begin your journey.</p>
        </div>
        
        {error && <div className="bg-warning/20 text-warning p-3 rounded-md mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input 
              type="text" 
              required 
              className="w-full px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-background text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-background text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-background text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary text-white py-2 rounded-md hover:opacity-90 transition font-medium mt-2"
          >
            Register
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-text/70">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
