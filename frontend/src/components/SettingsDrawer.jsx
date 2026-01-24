import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Palette, Sparkles, Moon, Sun, Monitor, Flag, ShieldCheck, ChevronRight, ArrowLeft, Zap, Gem, Warehouse, TreePine } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SettingsDrawer = ({ isOpen, onClose }) => {
  const { currentTheme, setCurrentTheme, themes } = useTheme();

  const getThemeIcon = (id) => {
    switch (id) {
      case 'light': return <Sun size={24} />;
      case 'dark': return <Moon size={24} />;
      case 'midnight': return <Sparkles size={24} />;
      case 'automotive': return <Monitor size={24} />;
      case 'midnight-gold': return <Gem size={24} />;
      case 'electric-neon': return <Zap size={24} />;
      case 'retro-garage': return <Warehouse size={24} />;
      case 'forest-stealth': return <TreePine size={24} />;
      default: return <Palette size={24} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[90%] max-w-2xl bg-bg-secondary rounded-[3rem] relative z-[101] shadow-2xl border border-white/10 p-8 md:p-12 max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Modal Header with Navigation */}
            <div className="flex items-center justify-between mb-10">
              <button
                onClick={onClose}
                className="p-3 bg-bg-primary rounded-2xl text-text-secondary hover:text-brand-primary transition-all active:scale-90"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl md:text-3xl font-black text-text-primary italic tracking-tighter text-center">
                Interface <span className="text-brand-primary font-black">Control</span>
              </h2>
              <button
                onClick={onClose}
                className="p-3 bg-bg-primary rounded-2xl text-text-secondary hover:text-red-500 transition-all active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-12">
              {/* Theme Engine */}
              <div>
                <label className="text-[10px] font-black uppercase text-text-secondary tracking-[0.3em] mb-8 block text-center">Select Visual Environment</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setCurrentTheme(theme.id)}
                      className={`p-6 rounded-[2.5rem] flex flex-col items-start gap-4 border-2 transition-all relative overflow-hidden group ${currentTheme === theme.id ? 'border-brand-primary bg-brand-primary/5 shadow-xl' : 'border-transparent bg-bg-primary/50'}`}
                    >
                      <div className={`p-4 rounded-2xl transition-all ${currentTheme === theme.id ? 'bg-brand-primary text-white shadow-lg' : 'bg-bg-secondary text-text-secondary'}`}>
                        {getThemeIcon(theme.id)}
                      </div>
                      <div className="text-left">
                        <p className="font-black text-sm uppercase tracking-widest text-text-primary">{theme.name}</p>
                        <p className="text-[9px] font-bold text-text-secondary uppercase mt-2 opacity-60 leading-tight tracking-wider">{theme.description}</p>
                      </div>
                      {currentTheme === theme.id && (
                        <motion.div layoutId="settingActive" className="absolute top-6 right-6 text-brand-primary">
                          <div className="p-1.5 bg-brand-primary/20 rounded-full">
                            <Flag size={14} fill="currentColor" />
                          </div>
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* App Settings */}
              <div className="pt-8 border-t border-border-primary/50">
                <label className="text-[10px] font-black uppercase text-text-secondary tracking-[0.3em] mb-6 block text-center italic">Advanced Preferences</label>
                <div className="space-y-4">
                  <SettingLink icon={<ShieldCheck size={20} />} label="Security Protocols" />
                  <SettingLink icon={<Monitor size={20} />} label="Fluid Rendering" toggle active={true} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SettingLink = ({ icon, label, toggle, active }) => (
  <button className="w-full flex items-center justify-between p-6 bg-bg-primary rounded-[2rem] group active:scale-[0.98] transition-all border border-transparent hover:border-brand-primary/20 hover:bg-bg-secondary hover:shadow-lg">
    <div className="flex items-center gap-5">
      <div className="text-brand-primary p-3 bg-bg-secondary rounded-xl group-hover:scale-110 transition-transform shadow-sm">{icon}</div>
      <span className="font-black text-xs uppercase tracking-widest text-text-primary">{label}</span>
    </div>
    {toggle ? (
      <div className={`w-14 h-8 rounded-full relative transition-all duration-300 ${active ? 'bg-brand-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-border-primary'}`}>
        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${active ? 'left-7' : 'left-1'}`} />
      </div>
    ) : (
      <div className="p-2 bg-bg-secondary rounded-xl group-hover:translate-x-1 transition-all"><ChevronRight size={18} className="text-text-secondary" /></div>
    )}
  </button>
);

export default SettingsDrawer;
