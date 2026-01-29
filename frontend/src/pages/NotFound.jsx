import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <div className="w-32 h-32 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertTriangle size={64} className="text-brand-primary" />
        </div>

        <h1 className="text-8xl md:text-9xl font-black text-brand-primary mb-4 italic tracking-tighter">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-black text-text-primary uppercase italic mb-4">
          Page Not Found
        </h2>

        <p className="text-base text-text-secondary opacity-70 mb-12 leading-relaxed max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-bg-secondary border border-border-primary text-text-primary rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 glow-effect"
          >
            <ArrowLeft size={18} />
            Go Back
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-3 glow-effect"
          >
            <Home size={18} />
            Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
