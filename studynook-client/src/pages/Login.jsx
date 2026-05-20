import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Library, Sparkles } from 'lucide-react';

const Login = () => {
  const { login, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Intended path to redirect back to
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    document.title = 'StudyNook – Login';
    // If already logged in, redirect directly
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter all fields');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result?.success) {
      navigate(from, { replace: true });
    }
  };

  const handleGoogleLogin = () => {
    const base = import.meta.env.VITE_API_URL || '/api';
    const googleUrl = base.startsWith('http')
      ? `${base}/auth/google`
      : `${window.location.origin}${base}/auth/google`;
    window.location.href = googleUrl;
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans px-4">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-slate-100"
      >
        <div className="text-center space-y-2.5 mb-8">
          <div className="inline-flex p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/10">
            <Library className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight mt-3">Welcome Back</h2>
          <p className="text-xs text-slate-400">Securely sign in to your study room dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g., student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
              />
              <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
              />
              <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 py-3.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <LogIn className="w-4.5 h-4.5" />
            <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
          </button>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-colors flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/50 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
