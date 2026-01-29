import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight,
  UserCheck,
  Zap,
  LayoutDashboard,
  Loader2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { formatCount, generateChartData } from '../utils/analytics';

const BusinessInsightsModal = ({ isOpen, onClose, shopData }) => {
  const [timeFilter, setTimeFilter] = useState('week'); // 'today', 'week', 'month'
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (filter) => {
    setIsLoading(true);
    setTimeFilter(filter);
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const chartData = useMemo(() => {
    return generateChartData(shopData?.visitHistory || [], timeFilter);
  }, [shopData, timeFilter]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden glass border border-border-primary rounded-[3rem] shadow-2xl flex flex-col bg-bg-secondary"
        >
          {/* Header */}
          <div className="px-8 py-6 flex items-center justify-between border-b border-border-primary bg-bg-secondary/50 backdrop-blur-3xl shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary shadow-lg shadow-brand-primary/10">
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-text-primary italic uppercase tracking-tight">Business <span className="text-brand-primary">Insights</span></h2>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{shopData?.name} • Live Traffic Analysis</p>
              </div>
            </div>

            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-12 h-12 bg-bg-primary/50 hover:bg-bg-primary text-text-secondary hover:text-text-primary rounded-2xl flex items-center justify-center transition-all border border-border-primary"
            >
              <X size={24} />
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-8 md:p-12 space-y-12 relative">
            {/* Loading Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex items-center justify-center bg-bg-primary/20 backdrop-blur-sm"
                >
                  <div className="glass p-8 rounded-[2rem] flex flex-col items-center gap-4 border border-border-primary">
                    <Loader2 className="animate-spin text-brand-primary" size={40} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">Syncing Data...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-8 relative overflow-hidden group border border-border-primary"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/5 blur-[60px] group-hover:bg-brand-primary/10 transition-all rounded-full" />
                <Users className="text-brand-primary mb-6 opacity-50" size={32} />
                <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Total Shop Visits</p>
                <h3 className="text-5xl font-black text-text-primary tracking-tighter italic mb-4">
                  {formatCount(shopData?.shopVisits || 0)}
                </h3>
                <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                  <ArrowUpRight size={14} /> +12% growth
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-8 relative overflow-hidden group border border-border-primary"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/5 blur-[60px] group-hover:bg-brand-primary/10 transition-all rounded-full" />
                <UserCheck className="text-brand-primary mb-6 opacity-50" size={32} />
                <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Unique Visitors</p>
                <h3 className="text-5xl font-black text-text-primary tracking-tighter italic mb-4">
                  {formatCount(Math.floor((shopData?.shopVisits || 0) * 0.7))}
                </h3>
                <div className="flex items-center gap-2 text-brand-primary font-black text-[10px] uppercase tracking-widest">
                  <Zap size={14} /> 70% Retension
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-8 relative overflow-hidden group border border-border-primary"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/5 blur-[60px] group-hover:bg-brand-primary/10 transition-all rounded-full" />
                <LayoutDashboard className="text-brand-primary mb-6 opacity-50" size={32} />
                <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Peak Visits</p>
                <h3 className="text-5xl font-black text-text-primary tracking-tighter italic mb-4">
                  {formatCount(Math.max(...chartData.map(d => d.visits), 0))}
                </h3>
                <div className="flex items-center gap-2 text-text-secondary font-black text-[10px] uppercase tracking-widest">
                  <Calendar size={14} /> Max Capacity
                </div>
              </motion.div>
            </div>

            {/* Chart Section */}
            <div className="glass-card p-8 md:p-12 border border-border-primary">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h4 className="text-2xl font-black text-text-primary uppercase italic tracking-tight mb-2">Traffic <span className="text-brand-primary">Growth</span></h4>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Engagement flow across selected timeframe</p>
                </div>

                <div className="flex bg-bg-primary/50 p-1.5 rounded-2xl border border-border-primary">
                  {['today', 'week', 'month'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterChange(filter)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeFilter === filter ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[400px] w-full min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="var(--text-secondary)"
                      fontSize={10}
                      fontWeight="bold"
                      tickFormatter={(value) => value.split('/')[0] + '/' + value.split('/')[1]}
                    />
                    <YAxis
                      stroke="var(--text-secondary)"
                      fontSize={10}
                      fontWeight="bold"
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'var(--text-primary)',
                        textTransform: 'uppercase'
                      }}
                      itemStyle={{ color: 'var(--brand-primary)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visits"
                      stroke="var(--brand-primary)"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorVisits)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Engagement Message */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-brand-primary/5 p-8 rounded-[2.5rem] border border-brand-primary/10">
              <div className="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary shrink-0">
                <Zap size={32} />
              </div>
              <div className="text-center md:text-left text-bold">
                <h5 className="text-xl font-black text-text-primary uppercase italic tracking-tight mb-1">Boost Your Visibility</h5>
                <p className="text-text-secondary text-xs font-bold leading-relaxed max-w-2xl opacity-70">
                  Based on your traffic data, users are most active during the weekend. Consider uploading new inventory or running promotions on Fridays to maximize your reach.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="md:ml-auto px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold italic text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/20"
              >
                Promote Shop
              </motion.button>
            </div>
          </div>

          <div className="p-8 text-center text-text-secondary text-[10px] font-bold uppercase tracking-widest border-t border-border-primary shrink-0 opacity-40">
            SpareHub Advanced Analytics Engine v2.0 • Data refreshed in real-time
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BusinessInsightsModal;
