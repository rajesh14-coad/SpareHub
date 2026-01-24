import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Palette, Sparkles, Sun, Moon, Zap, Gem, Terminal, ZapOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeModal = ({ isOpen, onClose }) => {
  const { currentTheme, setCurrentTheme, themes } = useTheme();

  const getThemeIcon = (id) => {
    switch (id) {
      case 'light': return <Sun size={20} />;
      case 'dark': return <Moon size={20} />;
      case 'onyx': return <Terminal size={20} />;
      case 'midnight-gold': return <Gem size={20} />;
      case 'pure': return <Check size={20} />;
      case 'electric-neon': return <Zap size={20} />;
      case 'automotive': return <Sparkles size={20} />;
      case 'retro-garage': return <ZapOff size={20} />;
      default: return <Palette size={20} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[150] p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl glass-card relative p-8 max-h-[90vh] overflow-y-auto no-scrollbar border border-border-primary/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border-primary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl">
                  <Palette size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary tracking-tight">Appearance</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">Personalize your terminal</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-bg-primary rounded-lg text-text-secondary transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((theme) => (
                <motion.button
                  key={theme.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentTheme(theme.id);
                  }}
                  className={`flex items-start gap-4 p-5 rounded-2xl transition-all border text-left relative overflow-hidden group ${currentTheme === theme.id
                      ? 'bg-brand-primary/10 border-brand-primary shadow-xl shadow-brand-primary/10'
                      : 'bg-bg-primary/30 border-border-primary/50 hover:border-brand-primary/30'
                    }`}
                >
                  <div className={`p-3 rounded-xl transition-colors ${currentTheme === theme.id
                      ? 'bg-brand-primary text-white'
                      : 'bg-bg-primary text-text-secondary group-hover:text-brand-primary'
                    }`}>
                    {getThemeIcon(theme.id)}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-text-primary mb-1">{theme.name}</h3>
                    <p className="text-[10px] font-medium text-text-secondary opacity-60 leading-relaxed uppercase tracking-wider">{theme.description}</p>
                  </div>

                  {currentTheme === theme.id && (
                    <motion.div
                      layoutId="themeCheck"
                      className="absolute top-4 right-4 text-brand-primary"
                    >
                      <Check size={16} strokeWidth={3} />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full mt-10 py-4 bg-brand-primary text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 glow-effect"
            >
              Set Atmosphere
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ThemeModal;
