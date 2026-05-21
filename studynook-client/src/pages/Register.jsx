import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, Image, Lock, UserPlus, Sparkles, Check, X } from 'lucide-react';

const Register = () => {
  const { register, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Dynamic Validation States
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isAtLeast6Chars = password.length >= 6;

  useEffect(() => {
    document.title = 'StudyNook – Register';
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check validation criteria before submitting
    if (!name || !email || !photoUrl || !password) {
      toast.error('Please enter all required fields');
      return;
    }

    if (!isAtLeast6Chars || !hasUppercase || !hasLowercase) {
      toast.error('Please satisfy all password strength rules');
      return;
    }

    setSubmitting(true);
    const result = await register(name, email, photoUrl, password);
    setSubmitting(false);

    if (result?.success) {
      navigate('/login');
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
    <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans px-4 py-12">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg glass-panel p-8 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-slate-100"
      >
        <div className="text-center space-y-2.5 mb-8">
          <div className="inline-flex p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/10">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight mt-3">Create Account</h2>
          <p className="text-xs text-slate-400">Join StudyNook to manage and book premium study cabins</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g., Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
              />
              <User className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g., alex@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
              />
              <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Photo URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Photo URL</label>
            <div className="relative">
              <input
                type="url"
                required
                placeholder="e.g., https://images.unsplash.com/..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
              />
              <Image className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
              />
              <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
            </div>

            {/* Dynamic Password Validation Rules Panel */}
            {password.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 space-y-1.5 mt-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Password Strength Checks</p>
                <div className="flex items-center space-x-2 text-xs font-medium">
                  {isAtLeast6Chars ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-rose-500" />
                  )}
                  <span className={isAtLeast6Chars ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-450'}>
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-medium">
                  {hasUppercase ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-rose-500" />
                  )}
                  <span className={hasUppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-450'}>
                    At least one uppercase letter (A-Z)
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-medium">
                  {hasLowercase ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-rose-500" />
                  )}
                  <span className={hasLowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-450'}>
                    At least one lowercase letter (a-z)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 py-3.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <UserPlus className="w-4.5 h-4.5" />
            <span>{submitting ? 'Registering...' : 'Register'}</span>
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
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
