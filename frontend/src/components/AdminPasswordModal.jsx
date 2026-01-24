import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPasswordModal = ({ isOpen, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'r@2614') {
      onConfirm();
      onClose();
    } else {
      toast.error('Wrong Access Key');
      onClose();
    }
    setPassword('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md glass-card p-8 border border-white/10"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse" />
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 relative z-10">
                    <ShieldAlert size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">Secure Terminal</h3>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Root Access Required</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] ml-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Enter Override Key
                </label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                  <input
                    type="password"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-14 pr-6 py-5 bg-black/40 border border-white/10 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-black/60 text-white font-bold tracking-[0.2em] transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.25em] shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] flex items-center justify-center gap-3 group"
              >
                Unlock System <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminPasswordModal;
