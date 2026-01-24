import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, LogIn, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GuestRestrictionModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-bg-secondary rounded-[3rem] relative z-[210] shadow-2xl border border-brand-primary/20 p-10 text-center overflow-hidden"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

            <div className="flex justify-end absolute top-6 right-6">
              <button
                onClick={onClose}
                className="p-2 bg-bg-primary rounded-full text-text-secondary hover:text-red-500 transition-all border border-white/5 shadow-inner"
              >
                <X size={18} />
              </button>
            </div>

            <div className="w-24 h-24 bg-brand-primary/10 text-brand-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner ring-4 ring-brand-primary/5">
              <ShieldAlert size={48} />
            </div>

            <h2 className="text-3xl font-black text-text-primary italic mb-3 uppercase tracking-tighter">
              Access <span className="text-brand-primary">Denied</span>
            </h2>
            <p className="text-sm font-black text-text-secondary uppercase tracking-widest text-[10px] opacity-60 mb-10 leading-relaxed italic">
              Guest transmissions are limited. Please authenticate your identity to access high-level intelligence and raise requests.
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  onClose();
                  navigate('/login');
                }}
                className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black tracking-widest uppercase text-xs shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                INITIALIZE LOGIN <LogIn size={18} strokeWidth={3} />
              </button>
              <button
                onClick={onClose}
                className="w-full py-5 bg-bg-primary text-text-secondary border border-border-primary rounded-2xl font-black tracking-widest uppercase text-xs hover:bg-bg-secondary transition-all flex items-center justify-center gap-3"
              >
                STAY AS GUEST <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GuestRestrictionModal;
