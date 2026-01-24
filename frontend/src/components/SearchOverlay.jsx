import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, ArrowRight, Car, Bike, Zap, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const SearchOverlay = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { query, setQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState(query);

  const trending = [
    { name: 'Thar Front Grille', icon: <Car size={16} /> },
    { name: 'RE Brake Pads', icon: <Bike size={16} /> },
    { name: 'LED Headlights', icon: <Zap size={16} /> },
    { name: 'Alloy Wheels', icon: <Package size={16} /> },
  ];

  const recent = ['Innova Filters', 'Swift Mirror', 'Nexon Charger'];

  const handleSearch = (q) => {
    const finalQuery = q || localQuery;
    setQuery(finalQuery);
    onClose();
    navigate('/customer/home');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="fixed inset-0 bg-bg-primary z-[200] p-6 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-primary" size={24} />
              <input
                autoFocus
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Find specific spares..."
                className="w-full pl-16 pr-6 py-6 bg-bg-secondary rounded-[2.5rem] border-2 border-brand-primary/20 outline-none text-xl font-black italic text-text-primary shadow-xl"
              />
            </div>
            <button
              onClick={onClose}
              className="p-5 bg-bg-secondary rounded-full text-text-secondary hover:text-red-500 transition-all border border-border-primary"
            >
              <X size={28} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-12">
            {/* Trending */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp size={20} className="text-brand-primary" />
                <h3 className="text-[10px] font-black uppercase text-text-secondary tracking-[0.3em]">Trending Categories</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {trending.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(item.name)}
                    className="flex justify-between items-center p-5 bg-bg-secondary rounded-3xl border border-border-primary hover:border-brand-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary">{item.icon}</div>
                      <span className="font-black text-xs uppercase tracking-widest text-text-primary">{item.name}</span>
                    </div>
                    <ArrowRight size={16} className="text-text-secondary" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Clock size={20} className="text-brand-primary" />
                <h3 className="text-[10px] font-black uppercase text-text-secondary tracking-[0.3em]">Recent Decryption</h3>
              </div>
              <div className="space-y-3">
                {recent.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(q)}
                    className="w-full flex items-center justify-between p-6 bg-bg-primary border border-border-primary rounded-[2rem] hover:bg-bg-secondary transition-all"
                  >
                    <span className="font-black text-sm italic text-text-primary">{q}</span>
                    <button className="p-2 text-text-secondary hover:text-red-500"><X size={14} /></button>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-8 border-t border-border-primary/50">
              <button className="w-full py-6 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-[2rem] font-black italic text-xl shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3">
                EXECUTE SEARCH <Search size={24} strokeWidth={3} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
