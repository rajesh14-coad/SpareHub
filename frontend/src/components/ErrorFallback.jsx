import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorFallback = ({ error, resetErrorBoundary, title = "Something went wrong" }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>

        <h2 className="text-2xl font-black text-text-primary uppercase italic mb-3">
          {title}
        </h2>

        <p className="text-sm text-text-secondary opacity-70 mb-8 leading-relaxed">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>

        {resetErrorBoundary && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={resetErrorBoundary}
            className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-3 mx-auto glow-effect"
          >
            <RefreshCw size={18} />
            Try Again
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default ErrorFallback;
