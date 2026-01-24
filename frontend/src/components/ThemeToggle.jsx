import React, { useState } from 'react';
import { Sun, Moon, Palette, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const { currentTheme, setCurrentTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const activeTheme = themes.find(t => t.id === currentTheme);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-bg-secondary border border-border-primary text-text-primary shadow-sm flex items-center gap-2"
      >
        <Palette size={18} className="text-brand-primary" />
        <span className="text-xs font-semibold hidden lg:block">{activeTheme.name}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border-primary rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2 grid gap-1">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setCurrentTheme(theme.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-all ${currentTheme === theme.id
                        ? 'bg-brand-primary/10 text-brand-primary'
                        : 'hover:bg-bg-primary text-text-secondary'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.color }}
                      />
                      <span className="text-sm font-medium">{theme.name}</span>
                    </div>
                    {currentTheme === theme.id && <Check size={16} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
