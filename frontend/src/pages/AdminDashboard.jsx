import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  Users,
  Mail,
  MapPin,
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
  ArrowUpRight,
  UserCheck,
  Building,
  Calendar,
  Layers,
  MoreVertical,
  Download,
  ArrowLeft as BackIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import toast from 'react-hot-toast';

const SidebarLink = ({ icon, label, active, onClick, collapsed }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all relative group ${active ? 'bg-white/10 text-white shadow-xl shadow-brand-primary/20 backdrop-blur-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
  >
    <div className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'text-blue-400' : ''}`}>
      {icon}
    </div>
    {!collapsed && <span className={`font-bold text-xs uppercase tracking-widest ${active ? 'text-white' : ''}`}>{label}</span>}
    {active && (
      <motion.div layoutId="navMarker" className="absolute left-0 top-3 bottom-3 w-1.5 bg-blue-400 rounded-full shadow-[0_0_15px_#60a5fa]" />
    )}
  </motion.button>
);

const LuxuryStatCard = ({ label, value, icon, change, color, onClick, active }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass-card p-6 cursor-pointer border-white/5 bg-slate-900/40 group relative overflow-hidden transition-all duration-500 ${active ? 'ring-2 ring-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'hover:border-white/10'}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-4 bg-white/5 rounded-2xl ${color.replace('from-', 'text-').split(' ')[0]} border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
        <div className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/20">
          {change}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">{label}</p>
        <h4 className="text-3xl font-bold text-white tracking-tighter">{value}</h4>
      </div>
      {active && (
        <motion.div
          layoutId="cardGlow"
          className="absolute inset-0 bg-blue-500/5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
};

const AdminDashboard = () => {
  const {
    users, products, requests, isMaintenanceMode, setIsMaintenanceMode, reports,
    verifyShopkeeper, banUser, unbanUser, deleteUser, broadcastNotification, deleteProduct,
    pendingShopkeepers, approveShopkeeper, rejectShopkeeper, logout,
    isRegistrationOpen, toggleRegistration
  } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [subView, setSubView] = useState(null); // 'revenue', 'verified_shops', 'active_users'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [broadcastText, setBroadcastText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const totalRevenue = requests.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const platformCommission = totalRevenue * 0.05;
  const verifiedShops = users.filter(u => u.role?.toLowerCase() === 'shopkeeper' && (u.status === 'Verified' || u.isVerified)).length;
  const activeUsers = users.length;

  const chartData = [
    { time: 'Mon', revenue: 4000 },
    { time: 'Tue', revenue: 3000 },
    { time: 'Wed', revenue: 7000 },
    { time: 'Thu', revenue: 12000 },
    { time: 'Fri', revenue: 9000 },
    { time: 'Sat', revenue: 15000 },
    { time: 'Sun', revenue: 11000 },
  ];

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    broadcastNotification(broadcastText);
    toast.success("Broadcast sent globally");
    setBroadcastText('');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex font-sans">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full glass border-r border-white/5 z-[100] transition-all duration-500 flex flex-col bg-slate-950/20 backdrop-blur-2xl ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 glow-effect">
            <ShieldCheck size={24} className="text-white" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white">SPARE<span className="text-blue-500">HUB</span></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Terminal</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Stats" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={!isSidebarOpen} />
          <SidebarLink icon={<Users size={20} />} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} collapsed={!isSidebarOpen} />
          <SidebarLink icon={<Store size={20} />} label="Shops" active={activeTab === 'shops'} onClick={() => setActiveTab('shops')} collapsed={!isSidebarOpen} />
          <SidebarLink icon={<UserCheck size={20} />} label="New Shopkeepers" active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} collapsed={!isSidebarOpen} />
          <SidebarLink icon={<Package size={20} />} label="Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} collapsed={!isSidebarOpen} />
          <SidebarLink icon={<ShieldAlert size={20} />} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} collapsed={!isSidebarOpen} />
          <SidebarLink icon={<Settings size={20} />} label="System" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={!isSidebarOpen} />

          <div className="pt-6 mt-6 border-t border-white/5">
            <SidebarLink
              icon={<Power size={20} className="text-red-400" />}
              label="Logout"
              active={false}
              onClick={() => {
                toast.loading("Securing session... Logging out", { duration: 2000 });
                setTimeout(() => {
                  logout();
                  navigate('/');
                  toast.success("Logged out successfully");
                }, 1500);
              }}
              collapsed={!isSidebarOpen}
            />
          </div>
        </nav>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-8 text-slate-500 hover:text-white transition-all border-t border-white/5 flex justify-center"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-500 pt-8 pb-24 px-10 ${isSidebarOpen ? 'ml-72' : 'ml-24'} bg-gradient-to-b from-slate-900/20 to-transparent`}>
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} <span className="text-blue-500 text-sm font-medium tracking-normal ml-2">v4.2.0</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                <Activity size={12} className="text-emerald-500" />
                Connectivity: 100%
              </div>
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Region: Global
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isMaintenanceMode ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-400/20'}`}>
              {isMaintenanceMode ? 'Maintenance' : 'System Live'}
            </div>
            <div className="flex items-center gap-3 glass px-5 py-2.5 rounded-2xl border-white/5 shadow-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Master Admin</p>
                <p className="text-xs font-bold text-white">Root Access</p>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {!subView ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <LuxuryStatCard
                      label="Platform Revenue"
                      value={`₹${totalRevenue.toLocaleString()}`}
                      icon={<DollarSign size={24} />}
                      change="+₹12K (5%)"
                      color="from-emerald-600 to-teal-500"
                      onClick={() => setSubView('revenue')}
                    />
                    <LuxuryStatCard
                      label="Total Verified Shops"
                      value={verifiedShops}
                      icon={<Building size={24} />}
                      change="Verified"
                      color="from-blue-600 to-indigo-500"
                      onClick={() => setSubView('verified_shops')}
                    />
                    <LuxuryStatCard
                      label="Active Users"
                      value={activeUsers}
                      icon={<Activity size={24} />}
                      change="+24 Today"
                      color="from-purple-600 to-pink-500"
                      onClick={() => setSubView('active_users')}
                    />
                    <LuxuryStatCard
                      label="Pending Verifications"
                      value={pendingShopkeepers.length}
                      icon={<AlertOctagon size={24} />}
                      change="Urgent"
                      color="from-amber-600 to-orange-500"
                      onClick={() => setActiveTab('pending')}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-2 glass-card p-8 border-white/5 bg-slate-900/40 glow-effect">
                      <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Revenue Analytics</h3>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-[10px] uppercase font-bold text-slate-400">Monthly</span>
                        </div>
                      </div>
                      <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height={350}>
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="glass-card p-8 border-white/5 bg-slate-900/40 flex flex-col glow-effect">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-3 text-white">
                        <Bell size={18} className="text-blue-500" /> Global Broadcast
                      </h3>
                      <form onSubmit={handleBroadcast} className="flex-1 flex flex-col gap-6">
                        <div className="flex-1 relative group">
                          <textarea
                            value={broadcastText}
                            onChange={(e) => setBroadcastText(e.target.value)}
                            placeholder="Type system alert..."
                            className="w-full h-full bg-slate-950/50 border border-white/10 p-6 rounded-3xl outline-none focus:border-blue-500/30 text-xs font-semibold resize-none transition-all placeholder:text-slate-700"
                          />
                          <div className="absolute top-4 right-4 text-[10px] font-black text-slate-700 uppercase tracking-widest">Encrypted</div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-2xl shadow-blue-900/20 glow-effect"
                        >
                          Broadcast Signal
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </>
              ) : subView === 'revenue' ? (
                <DrillDownView
                  title="Revenue Breakdown"
                  data={requests.map(r => ({ ...r, commission: r.amount * 0.05 }))}
                  columns={[
                    { key: 'productName', label: 'Product' },
                    { key: 'customerName', label: 'Customer' },
                    { key: 'amount', label: 'Total Amount', format: (v) => `₹${v.toLocaleString()}` },
                    { key: 'commission', label: 'Commission (5%)', format: (v) => `₹${v.toLocaleString()}` },
                    { key: 'time', label: 'Timestamp' }
                  ]}
                  onBack={() => setSubView(null)}
                  searchKey="productName"
                />
              ) : subView === 'verified_shops' ? (
                <DrillDownView
                  title="Verified Shop Registry"
                  data={users.filter(u => u.role?.toLowerCase() === 'shopkeeper' && (u.status === 'Verified' || u.isVerified))}
                  columns={[
                    { key: 'name', label: 'Shop Name' },
                    { key: 'email', label: 'Owner Email' },
                    { key: 'joined', label: 'Joining Date' },
                    { key: 'status', label: 'Level', format: () => 'Verified Partner' }
                  ]}
                  onBack={() => setSubView(null)}
                  searchKey="name"
                />
              ) : subView === 'active_users' ? (
                <DrillDownView
                  title="Active Customer Registry"
                  data={users.filter(u => u.role?.toLowerCase() === 'customer')}
                  columns={[
                    { key: 'name', label: 'Customer Name' },
                    { key: 'email', label: 'Contact Email' },
                    { key: 'joined', label: 'Registry Date' },
                    { key: 'status', label: 'Status' }
                  ]}
                  onBack={() => setSubView(null)}
                  searchKey="name"
                />
              ) : null}
            </motion.div>
          )}

          {activeTab === 'pending' && (
            <motion.div key="pending" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingShopkeepers.map((req, idx) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card p-6 border-white/5 bg-slate-900/40 relative overflow-hidden group glow-effect"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Store size={80} />
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-xl">
                        {req.shopName[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white tracking-tight">{req.shopName}</h4>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{req.shopType}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <DetailRow icon={<User size={14} />} label="Owner" value={req.name} />
                      <DetailRow icon={<Mail size={14} />} label="Email" value={req.email} />
                      <DetailRow icon={<Clock size={14} />} label="Hours" value={`${req.openingTime} - ${req.closingTime}`} />
                      <DetailRow icon={<Package size={14} />} label="Specializes" value={req.productsDealtIn} />
                      <DetailRow icon={<MapPin size={14} />} label="Location" value={`${req.city}, ${req.state}`} />
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-white/5">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => approveShopkeeper(req.id)}
                        className="flex-1 py-3.5 bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-emerald-900/40 glow-effect-green"
                      >
                        Approve & Verify
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => rejectShopkeeper(req.id)}
                        className="px-4 py-3.5 bg-white/5 text-red-400 font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-500/10 transition-all border border-white/5"
                      >
                        <X size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}

                {pendingShopkeepers.length === 0 && (
                  <div className="col-span-full py-40 flex flex-col items-center justify-center text-slate-500 opacity-20">
                    <UserCheck size={80} strokeWidth={1} />
                    <p className="mt-6 text-xl font-black uppercase tracking-[0.3em]">No Pending Requests</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card p-8 border-white/5 bg-slate-900/40 glow-effect">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-base font-black uppercase tracking-[0.2em] text-white">User Registry</h3>
                  <div className="relative w-80 group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search credentials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-2xl outline-none focus:border-blue-500/20 text-xs font-semibold"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                        <th className="pb-6 pt-2">Identity</th>
                        <th className="pb-6 pt-2">Role Cluster</th>
                        <th className="pb-6 pt-2">Status</th>
                        <th className="pb-6 pt-2 text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                        <tr key={u.id} className="group hover:bg-white/5 transition-all">
                          <td className="py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-black text-white text-sm group-hover:scale-110 transition-transform">{u.name[0]}</div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-white mb-0.5">{u.name}</span>
                                <span className="text-[10px] text-slate-500 font-medium">{u.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-6">
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${u.role?.toLowerCase() === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : u.role?.toLowerCase() === 'shopkeeper' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-6">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${u.status === 'Verified' || u.status === 'Active' || u.isVerified ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                              <span className="text-[10px] font-black uppercase text-slate-400">{u.status}</span>
                            </div>
                          </td>
                          <td className="py-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {(u.status === 'Banned' || u.isBanned) ? (
                                <motion.button whileTap={{ scale: 0.9 }} onClick={() => unbanUser(u.id)} className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 transition-all"><CheckCircle size={16} /></motion.button>
                              ) : (
                                <motion.button whileTap={{ scale: 0.9 }} onClick={() => banUser(u.id)} className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500/20 transition-all"><Ban size={16} /></motion.button>
                              )}
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => deleteUser(u.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"><Trash2 size={16} /></motion.button>
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

          {/* Additional management tabs would follow similar luxury design... */}

          {activeTab === 'shops' && (
            <motion.div key="shops" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.filter(u => u.role?.toLowerCase() === 'shopkeeper').map(shop => (
                  <div key={shop.id} className="glass-card p-8 border-white/5 bg-slate-900/40 relative overflow-hidden group glow-effect">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-2xl">
                        {shop.name[0]}
                      </div>
                      <button
                        onClick={() => verifyShopkeeper(shop.id)}
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all hover:scale-105 ${shop.status === 'Verified' || shop.isVerified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}
                      >
                        {shop.status}
                      </button>
                    </div>
                    <h4 className="text-xl font-black text-white tracking-tight mb-2">{shop.name}</h4>
                    <p className="text-xs font-bold text-slate-500 mb-8">{shop.email}</p>

                    <div className="flex gap-2">
                      {shop.isBanned ? (
                        <button onClick={() => unbanUser(shop.id)} className="flex-1 py-3 bg-white/5 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-emerald-500/10 transition-all">Restore</button>
                      ) : (
                        <button onClick={() => banUser(shop.id)} className="flex-1 py-3 bg-white/5 text-amber-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-amber-500/10 transition-all">Ban Access</button>
                      )}
                      <button onClick={() => deleteUser(shop.id)} className="px-4 py-3 bg-white/5 text-red-500 rounded-xl border border-white/5 hover:bg-red-500/10 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div key="inventory" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card p-8 border-white/5 bg-slate-900/40 glow-effect">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                  <h3 className="text-base font-black uppercase tracking-[0.2em] text-white">Global Stock Control</h3>
                  <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="text" placeholder="Scan global metadata..." className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-2xl outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map(product => (
                    <div key={product.id} className="bg-slate-950/50 border border-white/5 rounded-3xl overflow-hidden group">
                      <div className="aspect-square relative overflow-hidden flex items-center justify-center bg-slate-900">
                        {(product.image || (product.images && product.images[0])) ? (
                          <img
                            src={product.image || product.images[0]}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            alt={product.name}
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="text-slate-700 opacity-20"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg></div>';
                            }}
                          />
                        ) : (
                          <div className="text-slate-700 opacity-20">
                            <Package size={48} strokeWidth={1} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => deleteProduct(product.id)} className="p-4 bg-red-500 text-white rounded-full shadow-2xl shadow-red-900/50 hover:scale-110 transition-transform">
                            <Trash2 size={24} />
                          </button>
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-sm text-white mb-2 line-clamp-1">{product.name}</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-400 font-bold">₹{product.price.toLocaleString()}</span>
                          <span className="text-[10px] uppercase font-black text-slate-600">{product.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="max-w-4xl space-y-8">
                <div className="glass-card p-10 border-white/5 bg-slate-900/40 glow-effect">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-white">System Protocol</h3>
                  <div className="space-y-6">
                    <SystemToggle label="Maintenance Mode" desc="Isolate platform access for technical override" active={isMaintenanceMode} onToggle={() => setIsMaintenanceMode(!isMaintenanceMode)} />
                    <SystemToggle label="Public Registration" desc="Allow new user credentials to be registered" active={isRegistrationOpen} onToggle={toggleRegistration} />
                  </div>
                </div>

                <div className="glass-card p-10 border-red-500/10 bg-red-500/5 glow-effect">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-red-500">Security Clearance</h3>
                  <p className="text-xs text-slate-500 mb-8 font-medium">Critical system overrides. Use extreme caution.</p>
                  <button className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-red-900/40">Total Site Purge</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass-card p-10 border-white/5 bg-slate-900/40 glow-effect text-center py-40">
                <PieChartIcon size={64} className="text-slate-700 mx-auto mb-8 animate-pulse" />
                <h3 className="text-xl font-black uppercase tracking-[0.4em] text-slate-500">Reporting Module Locked</h3>
                <p className="text-xs font-bold text-slate-600 mt-4 uppercase tracking-[0.2em]">Contact System Overseer for decryption</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .glow-effect:hover {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.1);
          border-color: rgba(255, 255, 255, 0.1);
        }
        .glow-effect-green {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
          transition: all 0.3s ease;
        }
        .glow-effect-green:hover {
          box-shadow: 0 0 40px rgba(16, 185, 129, 0.5);
          transform: translateY(-2px);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const DrillDownView = ({ title, data, columns, onBack, searchKey }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);

  const filteredData = data.filter(item =>
    item[searchKey]?.toString().toLowerCase().includes(query.toLowerCase())
  );

  const handleExport = () => {
    const headers = columns.map(c => c.label).join(',');
    const rows = filteredData.map(item =>
      columns.map(c => c.format ? c.format(item[c.key]) : item[c.key]).join(',')
    ).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.toLowerCase().replace(/ /g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    toast.success("Data exported to CSV");
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelected(prev => prev.length === filteredData.length ? [] : filteredData.map(d => d.id));
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
          >
            <BackIcon size={20} />
          </motion.button>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase tracking-[0.1em]">{title}</h2>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter data..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-950/50 border border-white/5 rounded-2xl outline-none focus:border-blue-500/20 text-xs font-semibold"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="p-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-2xl hover:bg-blue-600/20 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <Download size={16} /> Export
          </motion.button>
        </div>
      </div>

      <div className="glass-card border-white/5 bg-slate-900/40 overflow-hidden glow-effect">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 bg-white/5">
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={selected.length === filteredData.length && filteredData.length > 0}
                    className="rounded border-white/10 bg-slate-800"
                  />
                </th>
                {columns.map(c => (
                  <th key={c.key} className="px-6 py-4">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-white/5 transition-all">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      onChange={() => toggleSelect(item.id)}
                      checked={selected.includes(item.id)}
                      className="rounded border-white/10 bg-slate-800"
                    />
                  </td>
                  {columns.map(c => (
                    <td key={c.key} className="px-6 py-4 text-xs font-semibold text-slate-300">
                      {c.format ? c.format(item[c.key]) : item[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="py-20 text-center text-slate-500 opacity-50 uppercase text-[10px] font-black tracking-widest">
              No matching records found in registry
            </div>
          )}
        </div>
      </div>

      {selected.length > 0 && (
        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 glass border border-blue-500/30 px-8 py-4 rounded-3xl flex items-center gap-6 shadow-2xl z-[200]">
          <span className="text-xs font-bold text-white tracking-tight">{selected.length} items selected</span>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20 flex items-center gap-2">
              <Trash2 size={14} /> Bulk Delete
            </button>
            <button className="px-4 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500/20 transition-all border border-emerald-500/20 flex items-center gap-2">
              <CheckCircle size={14} /> Mark Actionable
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-slate-600">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-xs font-bold text-slate-300 truncate">{value}</p>
    </div>
  </div>
);

const SystemToggle = ({ label, desc, active, onToggle }) => (
  <div className="flex items-center justify-between p-6 bg-slate-950/30 border border-white/5 rounded-3xl">
    <div>
      <h4 className="font-black text-xs text-white uppercase tracking-widest mb-1">{label}</h4>
      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{desc}</p>
    </div>
    <button
      onClick={onToggle}
      className={`w-14 h-8 rounded-full relative transition-all duration-500 ${active ? 'bg-blue-600 shadow-xl shadow-blue-500/30' : 'bg-slate-800'}`}
    >
      <motion.div animate={{ x: active ? 28 : 6 }} className="w-5 h-5 rounded-lg bg-white absolute top-1.5 shadow-xl" />
    </button>
  </div>
);

export default AdminDashboard;
