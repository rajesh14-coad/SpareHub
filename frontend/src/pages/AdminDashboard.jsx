import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Store,
  ShieldCheck,
  AlertOctagon,
  TrendingUp,
  Activity,
  DollarSign,
  Bell,
  Settings,
  Trash2,
  CheckCircle,
  Ban,
  Search,
  ChevronRight,
  Menu,
  X,
  PieChart as PieChartIcon,
  MessageSquare,
  Power,
  Edit3,
  Filter,
  ShieldAlert,
  Package,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const SidebarLink = ({ icon, label, active, onClick, collapsed }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all relative group ${active ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
  >
    <div className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'text-brand-primary' : ''}`}>
      {icon}
    </div>
    {!collapsed && <span className={`font-bold text-xs uppercase tracking-widest ${active ? 'text-brand-primary' : ''}`}>{label}</span>}
    {active && (
      <motion.div layoutId="navMarker" className="absolute left-0 top-2 bottom-2 w-1 bg-brand-primary rounded-full shadow-[0_0_10px_var(--brand-primary)]" />
    )}
  </motion.button>
);

const StatCard = ({ label, value, icon, change }) => {
  return (
    <div className="glass-card p-8 group relative overflow-hidden transition-all glow-effect">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-bg-primary/50 rounded-2xl text-brand-primary border border-border-primary/50 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
          {icon}
        </div>
        <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
          {change}
        </div>
      </div>
      <p className="text-[10px] font-bold uppercase text-text-secondary tracking-widest mb-1 opacity-60">{label}</p>
      <h4 className="text-3xl font-bold text-text-primary tracking-tight">{value}</h4>
    </div>
  );
};

const ControlSwitch = ({ label, description, active, onToggle }) => (
  <div className="flex items-center justify-between p-6 glass border border-border-primary/50 rounded-2xl hover:border-brand-primary/30 transition-all glow-effect">
    <div className="max-w-[70%]">
      <h4 className="font-bold text-text-primary text-sm tracking-tight mb-1">{label}</h4>
      <p className="text-[10px] text-text-secondary font-medium tracking-wide opacity-60">{description}</p>
    </div>
    <button
      onClick={onToggle}
      className={`w-12 h-6.5 rounded-full relative transition-all duration-300 ${active ? 'bg-brand-primary shadow-lg shadow-brand-primary/20' : 'bg-border-primary/50'}`}
    >
      <motion.div
        animate={{ x: active ? 22 : 4 }}
        className="w-5 h-5 rounded-full bg-white absolute top-0.75 shadow-sm"
      />
    </button>
  </div>
);

const AdminDashboard = () => {
  const {
    users, products, requests, isMaintenanceMode, setIsMaintenanceMode, reports,
    verifyShopkeeper, banUser, deleteUser, broadcastNotification, deleteProduct
  } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [broadcastText, setBroadcastText] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('All');

  const totalRevenue = requests.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const platformCommission = totalRevenue * 0.05;
  const pendingShops = users.filter(u => u.role === 'Shopkeeper' && u.status === 'Pending').length;

  const chartData = [
    { time: 'Mon', users: 400 },
    { time: 'Tue', users: 300 },
    { time: 'Wed', users: 1200 },
    { time: 'Thu', users: 2100 },
    { time: 'Fri', users: 1800 },
    { time: 'Sat', users: 2400 },
    { time: 'Sun', users: 1500 },
  ];

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    broadcastNotification(broadcastText);
    toast.success("Broadcast sent");
    setBroadcastText('');
  };

  const filteredInventoryRequests = useMemo(() => {
    return requests.filter(req => {
      const product = products.find(p => p.id === req.productId);
      const condition = (product?.condition || product?.type || 'Used').toLowerCase();
      const category = product?.category || '';

      if (inventoryFilter === 'All') return true;
      if (inventoryFilter === 'New') return condition === 'new';
      if (inventoryFilter === 'Old') return condition === 'used' || condition === 'old';
      if (inventoryFilter === 'Parts') return category === 'Spare Parts';
      return true;
    });
  }, [requests, products, inventoryFilter]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full glass border-r border-border-primary/50 z-[100] transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          {isSidebarOpen && <span className="text-lg font-bold tracking-tight">Admin</span>}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1">
          <SidebarLink icon={<LayoutDashboard size={18} />} label="Stats" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={!isSidebarOpen} />
          <SidebarLink icon={<Users size={18} />} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} collapsed={!isSidebarOpen} />
          <SidebarLink icon={<AlertOctagon size={18} />} label="Alerts" active={activeTab === 'approvals'} onClick={() => setActiveTab('approvals')} collapsed={!isSidebarOpen} />
          <SidebarLink icon={<Package size={18} />} label="Stock" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} collapsed={!isSidebarOpen} />
          <SidebarLink icon={<ShieldAlert size={18} />} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} collapsed={!isSidebarOpen} />
          <SidebarLink icon={<DollarSign size={18} />} label="Funds" active={activeTab === 'financials'} onClick={() => setActiveTab('financials')} collapsed={!isSidebarOpen} />
          <SidebarLink icon={<Settings size={18} />} label="System" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={!isSidebarOpen} />
        </nav>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-6 text-text-secondary hover:text-brand-primary transition-all border-t border-border-primary/30 flex justify-center"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 pt-8 pb-24 px-8 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Panel</h1>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Control</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${isMaintenanceMode ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              {isMaintenanceMode ? 'Maintenance' : 'Live'}
            </div>
            <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <ShieldCheck size={18} />
              </div>
              <span className="text-xs font-bold">Root</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<DollarSign size={20} />} change="+12%" />
                <StatCard label="Fees" value={`₹${platformCommission.toLocaleString()}`} icon={<CheckCircle size={20} />} change="5%" />
                <StatCard label="Pending" value={pendingShops} icon={<AlertOctagon size={20} />} change="Priority" />
                <StatCard label="Live" value="2.4K" icon={<Activity size={20} />} change="Active" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="lg:col-span-2 glass-card p-8 glow-effect">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-8">Analytics</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 700 }} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="users" stroke="var(--brand-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card p-8 flex flex-col glow-effect">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Bell size={16} className="text-brand-primary" /> Broadcast
                  </h3>
                  <form onSubmit={handleBroadcast} className="flex-1 flex flex-col gap-4">
                    <textarea
                      value={broadcastText}
                      onChange={(e) => setBroadcastText(e.target.value)}
                      placeholder="Message..."
                      className="w-full flex-1 bg-bg-primary/50 border border-border-primary p-4 rounded-xl outline-none focus:border-brand-primary/30 text-xs font-semibold resize-none glow-effect"
                    />
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 bg-brand-primary text-white font-bold uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-brand-primary/20 glow-effect"
                    >
                      Send
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <div className="glass-card p-8 glow-effect">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold">Users</h3>
                  <div className="relative w-72 glow-effect">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-50" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-bg-primary border border-border-primary rounded-xl outline-none text-xs font-semibold"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-border-primary/30">
                        <th className="pb-4 pt-2">Name</th>
                        <th className="pb-4 pt-2">Role</th>
                        <th className="pb-4 pt-2">Status</th>
                        <th className="pb-4 pt-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-primary/30">
                      {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                        <tr key={u.id} className="group hover:bg-bg-primary/30 transition-all">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">{u.name[0]}</div>
                              <span className="text-sm font-semibold">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-4"><span className="text-xs font-medium text-text-secondary">{u.role}</span></td>
                          <td className="py-4">
                            <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${u.status === 'Verified' || u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{u.status}</span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => deleteUser(u.id)} className="p-2 text-text-secondary hover:text-red-500 transition-colors"><Trash2 size={16} /></motion.button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div key="inventory" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col items-center gap-6">
                  <h2 className="text-2xl font-bold tracking-tight">Inventory Requests</h2>

                  {/* Pill Filter Tabs */}
                  <div className="flex items-center p-1.5 bg-bg-secondary/40 backdrop-blur-md rounded-full border border-border-primary/50 relative overflow-hidden h-12">
                    {['All', 'New', 'Old', 'Parts'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setInventoryFilter(tab)}
                        className={`relative z-10 px-8 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${inventoryFilter === tab ? 'text-white' : 'text-text-secondary hover:text-text-primary'}`}
                      >
                        {tab}
                        {inventoryFilter === tab && (
                          <motion.div
                            layoutId="activeFilterBg"
                            className="absolute inset-0 bg-brand-primary rounded-full -z-10 shadow-lg shadow-brand-primary/30"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInventoryRequests.map((req, idx) => {
                    const product = products.find(p => p.id === req.productId);
                    return (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card p-6 flex flex-col gap-4 glow-effect"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-bg-primary/50 border border-border-primary/50 overflow-hidden flex-shrink-0">
                            <img src={product?.image} className="w-full h-full object-cover" alt={req.productName} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-text-primary truncate">{req.productName}</h4>
                            <p className="text-[10px] font-medium text-text-secondary opacity-60 uppercase tracking-widest">{product?.category}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-end pt-2 border-t border-border-primary/10">
                          <div>
                            <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest mb-1 opacity-50">Customer</p>
                            <span className="text-xs font-bold">{req.customerName}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest mb-1 opacity-50">Value</p>
                            <span className="text-lg font-bold text-brand-primary">₹{req.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {filteredInventoryRequests.length === 0 && (
                    <div className="col-span-full py-32 text-center opacity-30 flex flex-col items-center gap-4">
                      <Package size={48} strokeWidth={1.5} />
                      <p className="font-bold text-lg">No requests found</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="glass-card p-8 glow-effect">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-6">System</h3>
                  <div className="space-y-4">
                    <ControlSwitch
                      label="Maintenance"
                      description="Lock public access"
                      active={isMaintenanceMode}
                      onToggle={() => setIsMaintenanceMode(!isMaintenanceMode)}
                    />
                  </div>
                </div>

                <div className="glass-card p-8 glow-effect">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-red-500">Danger</h3>
                  <p className="text-xs text-text-secondary mb-6 font-medium">Irreversible actions</p>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold uppercase text-[10px] tracking-widest glow-effect"
                  >
                    Clear Data
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
