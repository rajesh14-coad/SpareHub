import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';

const NetworkError = ({ onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
    >
      <div className="glass-card p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff size={40} className="text-orange-500" />
        </div>

        <h2 className="text-2xl font-black text-text-primary uppercase italic mb-3">
          Connection Lost
        </h2>

        <p className="text-sm text-text-secondary opacity-70 mb-8 leading-relaxed">
          Please check your internet connection and try again.
        </p>

        {onRetry && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-3 mx-auto glow-effect"
          >
            <RefreshCw size={18} />
            Retry Connection
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default NetworkError;
