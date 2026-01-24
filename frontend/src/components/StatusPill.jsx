import React from 'react';
import { motion } from 'framer-motion';

const StatusPill = ({ status, onClick, className = '' }) => {
  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-amber-500/20';
      case 'accepted':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30 shadow-blue-500/20';
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-emerald-500/20';
      case 'declined':
        return 'bg-red-500/10 text-red-500 border-red-500/30 shadow-red-500/20';
      default:
        return 'bg-brand-primary/10 text-brand-primary border-brand-primary/30 shadow-brand-primary/20';
    }
  };

  const getStatusLabel = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Ready';
      case 'completed':
        return 'Completed';
      case 'declined':
        return 'Declined';
      default:
        return status || 'Unknown';
    }
  };

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-lg glow-effect ${getStatusStyle()} ${onClick ? 'cursor-pointer' : ''
        } ${className}`}
    >
      {getStatusLabel()}
    </motion.div>
  );
};

export default StatusPill;
