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
  Loader2,
  Eye,
  Heart,
  Clock,
  Download,
  BarChart3,
  LineChart,
  Package,
  Star,
  Activity
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
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Legend
} from 'recharts';
import { formatCount, generateChartData } from '../utils/analytics';
import { useAuth } from '../context/AuthContext';

const BusinessInsightsModal = ({ isOpen, onClose, shopData }) => {
  const [mode, setMode] = useState('normal'); // 'normal' or 'technical'
  const [timeFilter, setTimeFilter] = useState('week');
  const [isLoading, setIsLoading] = useState(false);
  const { products } = useAuth();

  const handleFilterChange = (filter) => {
    setIsLoading(true);
    setTimeFilter(filter);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const chartData = useMemo(() => {
    return generateChartData(shopData?.visitHistory || [], timeFilter);
  }, [shopData, timeFilter]);

  // Get shop's products
  const shopProducts = useMemo(() => {
    return products.filter(p => {
      // Mock logic - in real app, filter by shop owner
      return p.id <= 3;
    }).map(p => ({
      ...p,
      views: p.viewCount || Math.floor(Math.random() * 500) + 100,
      favorites: Math.floor(Math.random() * 50) + 10,
      avgTime: `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 60)}s`,
      conversionScore: Math.floor(Math.random() * 40) + 60
    }));
  }, [products]);

  // Calculate insights
  const insights = useMemo(() => {
    const totalViews = shopProducts.reduce((sum, p) => sum + p.views, 0);
    const totalFavorites = shopProducts.reduce((sum, p) => sum + p.favorites, 0);
    const mostPopular = shopProducts.reduce((max, p) => p.views > (max?.views || 0) ? p : max, shopProducts[0]);

    const todayVisits = chartData[chartData.length - 1]?.visits || 0;
    const yesterdayVisits = chartData[chartData.length - 2]?.visits || 0;
    const growthPercent = yesterdayVisits > 0
      ? (((todayVisits - yesterdayVisits) / yesterdayVisits) * 100).toFixed(1)
      : 0;

    return {
      totalCustomersToday: todayVisits,
      mostPopularPart: mostPopular?.name || 'N/A',
      growthPercent: growthPercent,
      totalViews,
      totalFavorites
    };
  }, [chartData, shopProducts]);

  // Peak hours data
  const peakHoursData = useMemo(() => {
    return [
      { hour: '6 AM', visits: 12 },
      { hour: '9 AM', visits: 45 },
      { hour: '12 PM', visits: 78 },
      { hour: '3 PM', visits: 92 },
      { hour: '6 PM', visits: 156 },
      { hour: '9 PM', visits: 134 },
      { hour: '12 AM', visits: 34 }
    ];
  }, []);

  // Visitor type data for technical mode
  const visitorTypeData = useMemo(() => {
    return chartData.map(d => ({
      ...d,
      unique: Math.floor(d.visits * 0.7),
      repeat: Math.floor(d.visits * 0.3)
    }));
  }, [chartData]);

  const exportData = (format) => {
    const data = shopProducts.map(p => ({
      Product: p.name,
      Views: p.views,
      Favorites: p.favorites,
      'Avg Time': p.avgTime,
      'Conversion Score': p.conversionScore + '%'
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shop-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

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
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{shopData?.name} • Live Analytics</p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex bg-bg-primary/50 p-1.5 rounded-2xl border border-border-primary">
                <button
                  onClick={() => setMode('normal')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'normal' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setMode('technical')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'technical' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Technical
                </button>
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

            {/* NORMAL MODE */}
            {mode === 'normal' && (
              <>
                {/* Simplified Key Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 relative overflow-hidden group border border-border-primary"
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/5 blur-[60px] group-hover:bg-brand-primary/10 transition-all rounded-full" />
                    <Users className="text-brand-primary mb-6 opacity-50" size={40} />
                    <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Customers Today</p>
                    <h3 className="text-6xl font-black text-text-primary tracking-tighter italic">
                      {insights.totalCustomersToday}
                    </h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-8 relative overflow-hidden group border border-border-primary"
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/5 blur-[60px] group-hover:bg-brand-primary/10 transition-all rounded-full" />
                    <Package className="text-brand-primary mb-6 opacity-50" size={40} />
                    <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Most Popular Part</p>
                    <h3 className="text-xl font-black text-text-primary tracking-tight line-clamp-2">
                      {insights.mostPopularPart}
                    </h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8 relative overflow-hidden group border border-border-primary"
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/5 blur-[60px] group-hover:bg-brand-primary/10 transition-all rounded-full" />
                    <TrendingUp className="text-brand-primary mb-6 opacity-50" size={40} />
                    <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Overall Growth</p>
                    <h3 className="text-6xl font-black text-text-primary tracking-tighter italic">
                      {insights.growthPercent}%
                    </h3>
                  </motion.div>
                </div>

                {/* Simplified Chart */}
                <div className="glass-card p-8 md:p-12 border border-border-primary relative overflow-hidden group">
                  {/* Subtle RGB Glow Container */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-cyan-400/10 to-indigo-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                      <div>
                        <h4 className="text-2xl font-black text-text-primary uppercase italic tracking-tight mb-2">
                          Customer <span className="text-brand-primary glow-text">Traffic</span>
                        </h4>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Growth flow across selected timeframe</p>
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

                    {/* Fallback for empty data */}
                    {(!chartData || chartData.length === 0) ? (
                      <div className="h-[400px] flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 size={48} className="text-text-secondary opacity-20 mx-auto mb-4" />
                          <p className="text-sm font-bold text-text-secondary opacity-60">No data available</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-[400px] w-full min-h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              {/* Premium Gradient: Indigo to Cyan */}
                              <linearGradient id="colorVisitsPro" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                                <stop offset="50%" stopColor="#22d3ee" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                              </linearGradient>
                              {/* Subtle Glow Effect */}
                              <filter id="proGlow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                  <feMergeNode in="coloredBlur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                            </defs>

                            {/* Simple Grid */}
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="var(--border-primary)"
                              vertical={false}
                              opacity={0.2}
                            />

                            {/* X Axis - Dates */}
                            <XAxis
                              dataKey="date"
                              stroke="var(--text-secondary)"
                              fontSize={11}
                              fontWeight="bold"
                              tickFormatter={(value) => value.split('/')[0] + '/' + value.split('/')[1]}
                              axisLine={false}
                              tickLine={false}
                              dy={10}
                            />

                            {/* Y Axis - Visit Count */}
                            <YAxis
                              stroke="var(--text-secondary)"
                              fontSize={11}
                              fontWeight="bold"
                              axisLine={false}
                              tickLine={false}
                              dx={-10}
                            />

                            {/* Glassmorphism Tooltip */}
                            <Tooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="glass p-4 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl">
                                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-1">
                                        {label}
                                      </p>
                                      <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">
                                        {payload[0].value}
                                      </p>
                                      <p className="text-[10px] font-bold text-text-secondary uppercase mt-1">
                                        Total Visits
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />

                            {/* Premium Area with Smooth Curve */}
                            <Area
                              type="monotone"
                              dataKey="visits"
                              stroke="#6366f1"
                              strokeWidth={4}
                              fillOpacity={1}
                              fill="url(#colorVisitsPro)"
                              filter="url(#proGlow)"
                              animationDuration={1500}
                              animationEasing="ease-in-out"
                              dot={{
                                r: 5,
                                fill: '#6366f1',
                                strokeWidth: 2,
                                stroke: '#fff'
                              }}
                              activeDot={{
                                r: 8,
                                fill: '#22d3ee',
                                strokeWidth: 3,
                                stroke: '#fff',
                                filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))'
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* TECHNICAL MODE */}
            {mode === 'technical' && (
              <>
                {/* Advanced Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 border border-border-primary"
                  >
                    <Eye className="text-brand-primary mb-4" size={24} />
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2">Total Views</p>
                    <h3 className="text-3xl font-black text-text-primary tracking-tight">{formatCount(insights.totalViews)}</h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="glass-card p-6 border border-border-primary"
                  >
                    <Heart className="text-brand-primary mb-4" size={24} />
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2">Total Favorites</p>
                    <h3 className="text-3xl font-black text-text-primary tracking-tight">{insights.totalFavorites}</h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 border border-border-primary"
                  >
                    <UserCheck className="text-brand-primary mb-4" size={24} />
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2">Unique Visitors</p>
                    <h3 className="text-3xl font-black text-text-primary tracking-tight">{formatCount(Math.floor((shopData?.shopVisits || 0) * 0.7))}</h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="glass-card p-6 border border-border-primary"
                  >
                    <Activity className="text-brand-primary mb-4" size={24} />
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2">Repeat Visitors</p>
                    <h3 className="text-3xl font-black text-text-primary tracking-tight">{formatCount(Math.floor((shopData?.shopVisits || 0) * 0.3))}</h3>
                  </motion.div>
                </div>

                {/* Visitor Type Chart */}
                <div className="glass-card p-8 md:p-12 border border-border-primary">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                      <h4 className="text-2xl font-black text-text-primary uppercase italic tracking-tight mb-2">Visitor <span className="text-brand-primary">Analysis</span></h4>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Unique vs Repeat Visitors</p>
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
                      <RechartsLineChart data={visitorTypeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} opacity={0.3} />
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
                        />
                        <Legend
                          wrapperStyle={{
                            fontSize: '10px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="unique"
                          stroke="#6366f1"
                          strokeWidth={3}
                          dot={{ fill: '#6366f1', r: 4 }}
                          name="Unique Visitors"
                        />
                        <Line
                          type="monotone"
                          dataKey="repeat"
                          stroke="#22d3ee"
                          strokeWidth={3}
                          dot={{ fill: '#22d3ee', r: 4 }}
                          name="Repeat Visitors"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Product Leaderboard */}
                <div className="glass-card p-8 md:p-12 border border-border-primary">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="text-2xl font-black text-text-primary uppercase italic tracking-tight mb-2">Product <span className="text-brand-primary">Leaderboard</span></h4>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Most viewed products with conversion potential</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => exportData('csv')}
                      className="px-6 py-3 bg-brand-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20 flex items-center gap-2"
                    >
                      <Download size={16} />
                      Export CSV
                    </motion.button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border-primary">
                          <th className="text-left py-4 px-4 text-[10px] font-black text-text-secondary uppercase tracking-widest">Rank</th>
                          <th className="text-left py-4 px-4 text-[10px] font-black text-text-secondary uppercase tracking-widest">Product</th>
                          <th className="text-right py-4 px-4 text-[10px] font-black text-text-secondary uppercase tracking-widest">Views</th>
                          <th className="text-right py-4 px-4 text-[10px] font-black text-text-secondary uppercase tracking-widest">Favorites</th>
                          <th className="text-right py-4 px-4 text-[10px] font-black text-text-secondary uppercase tracking-widest">Conversion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shopProducts.sort((a, b) => b.views - a.views).map((product, index) => (
                          <tr key={product.id} className="border-b border-border-primary/30 hover:bg-bg-primary/30 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                {index === 0 && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                                <span className="text-sm font-black text-text-primary">#{index + 1}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm font-bold text-text-primary">{product.name}</p>
                              <p className="text-[10px] text-text-secondary opacity-60">{product.category}</p>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-sm font-black text-text-primary">{product.views}</span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-sm font-black text-brand-primary">{product.favorites}</span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-20 h-2 bg-bg-primary rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-brand-primary to-cyan-400"
                                    style={{ width: `${product.conversionScore}%` }}
                                  />
                                </div>
                                <span className="text-sm font-black text-text-primary w-12">{product.conversionScore}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Inventory Performance */}
                <div className="glass-card p-8 md:p-12 border border-border-primary">
                  <h4 className="text-2xl font-black text-text-primary uppercase italic tracking-tight mb-8">Inventory <span className="text-brand-primary">Performance</span></h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {shopProducts.map((product) => (
                      <div key={product.id} className="glass p-6 rounded-3xl border border-border-primary">
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 rounded-2xl object-cover"
                          />
                          <div className="flex-1">
                            <h5 className="text-sm font-black text-text-primary mb-1">{product.name}</h5>
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest">{product.category}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Eye size={14} className="text-brand-primary" />
                              <p className="text-[10px] font-black text-text-secondary uppercase">Views</p>
                            </div>
                            <p className="text-2xl font-black text-text-primary">{product.views}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Heart size={14} className="text-brand-primary" />
                              <p className="text-[10px] font-black text-text-secondary uppercase">Favorites</p>
                            </div>
                            <p className="text-2xl font-black text-text-primary">{product.favorites}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Clock size={14} className="text-brand-primary" />
                              <p className="text-[10px] font-black text-text-secondary uppercase">Avg Time</p>
                            </div>
                            <p className="text-2xl font-black text-text-primary">{product.avgTime}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Peak Hours Heatmap */}
                <div className="glass-card p-8 md:p-12 border border-border-primary">
                  <h4 className="text-2xl font-black text-text-primary uppercase italic tracking-tight mb-8">Peak <span className="text-brand-primary">Hours</span></h4>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-8">Traffic distribution throughout the day</p>

                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={peakHoursData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} opacity={0.3} />
                        <XAxis
                          dataKey="hour"
                          stroke="var(--text-secondary)"
                          fontSize={10}
                          fontWeight="bold"
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
                        />
                        <Bar dataKey="visits" radius={[12, 12, 0, 0]}>
                          {peakHoursData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.visits > 100 ? '#6366f1' : entry.visits > 50 ? '#22d3ee' : '#94a3b8'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#6366f1]" />
                      <span className="text-[10px] font-black text-text-secondary uppercase">High Traffic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#22d3ee]" />
                      <span className="text-[10px] font-black text-text-secondary uppercase">Medium Traffic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#94a3b8]" />
                      <span className="text-[10px] font-black text-text-secondary uppercase">Low Traffic</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="p-8 text-center text-text-secondary text-[10px] font-bold uppercase tracking-widest border-t border-border-primary shrink-0 opacity-40">
            PurzaSetu Advanced Analytics Engine v3.0 • {mode === 'technical' ? 'Technical Mode' : 'Normal Mode'} • Data refreshed in real-time
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BusinessInsightsModal;
