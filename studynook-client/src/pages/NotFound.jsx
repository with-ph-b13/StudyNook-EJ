import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, HelpCircle } from 'lucide-react';

const NotFound = () => {
  useEffect(() => {
    document.title = 'StudyNook – Page Not Found';
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans px-4 py-8 text-slate-800 dark:text-slate-100">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Visual 404 header */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-600/10 rounded-full filter blur-xl animate-pulse" />
          <h1 className="text-9xl font-black font-display tracking-widest text-indigo-600 dark:text-indigo-400 select-none">
            404
          </h1>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display tracking-tight flex items-center justify-center space-x-2">
            <HelpCircle className="w-6 h-6 text-indigo-500" />
            <span>Nook Not Found</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Oops! The library aisle or room booking page you are searching for does not exist or has been shifted.
          </p>
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/15 font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
