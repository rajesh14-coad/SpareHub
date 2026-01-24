import React, { useState } from 'react';
import {
  Package,
  Bell,
  Check,
  X,
  TrendingUp,
  Users,
  ArrowUpRight,
  Plus,
  Edit,
  Trash2,
  Clock,
  ArrowLeft,
  Activity,
  ChevronRight,
  ShieldAlert,
  Save,
  Loader2,
  ChevronDown,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import StatusPill from '../components/StatusPill';

const ShopDashboard = () => {
  const navigate = useNavigate();
  const { user, products: inventory, requests, notifications, deleteProduct, updateRequestStatus, updateProduct } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [analyticsType, setAnalyticsType] = useState(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const handleDelete = (id) => {
    try {
      deleteProduct(id);
      setDeleteConfirmId(null);
      toast.success("Deleted");
    } catch (err) {
      toast.error("Error");
    }
  };

  const handleUpdate = (updatedProduct) => {
    try {
      updateProduct(updatedProduct.id, updatedProduct);
      setEditProduct(null);
      toast.success("Updated");
    } catch (err) {
      toast.error("Error");
    }
  };

  const activeRequests = requests.filter(r => r.status === 'pending');
  const totalVolume = inventory.reduce((total, item) => total + item.price, 0);

  const stats = [
    { id: 'listings', label: 'Inventory', value: inventory.length.toString(), icon: <Package size={18} />, change: '+5', color: 'text-brand-primary' },
    { id: 'sales', label: 'Volume', value: `₹${(totalVolume / 1000).toFixed(1)}K`, icon: <TrendingUp size={18} />, change: '+12%', color: 'text-emerald-500' },
    { id: 'requests', label: 'Requests', value: activeRequests.length.toString(), icon: <Bell size={18} />, change: 'New', color: 'text-brand-primary' },
  ];

  const chartData = [
    { day: 'M', sales: 4000, requests: 24, listings: 35 },
    { day: 'T', sales: 3000, requests: 13, listings: 38 },
    { day: 'W', sales: 2000, requests: 98, listings: 40 },
    { day: 'T', sales: 2780, requests: 39, listings: 41 },
    { day: 'F', sales: 1890, requests: 48, listings: 42 },
    { day: 'S', sales: 2390, requests: 38, listings: 42 },
    { day: 'S', sales: 3490, requests: 43, listings: 42 },
  ];

  return (
    <div className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <AnalyticsModal isOpen={!!analyticsType} onClose={() => setAnalyticsType(null)} type={analyticsType} data={chartData} />
      <DeleteModal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} onConfirm={() => handleDelete(deleteConfirmId)} productName={inventory.find(i => i.id === deleteConfirmId)?.name} />
      <EditModal isOpen={!!editProduct} onClose={() => setEditProduct(null)} onSave={handleUpdate} product={editProduct} />

      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-2">
            {user?.shopDetails?.name || user?.name || 'Shop'}
          </h1>
          <p className="text-text-secondary text-sm font-bold opacity-60 flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" /> System live
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/shop/upload')}
          className="w-full md:w-auto px-8 py-3.5 bg-brand-primary text-white rounded-2xl shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 font-bold text-sm glow-effect"
        >
          <Plus size={20} /> Post Item
        </motion.button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAnalyticsType(stat.id)}
            className="glass-card p-6 relative overflow-hidden group cursor-pointer glow-effect"
          >
            <div className={`absolute -right-2 -top-2 p-6 opacity-5 group-hover:opacity-10 transition-all duration-300 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-text-secondary opacity-60 mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-text-primary tracking-tight">{stat.value}</h3>
              <span className={`${stat.color} font-bold text-[10px] bg-bg-primary px-2 py-1 rounded-lg border border-border-primary/30 flex items-center gap-1`}>
                <ArrowUpRight size={12} /> {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b border-border-primary/20 overflow-x-auto no-scrollbar">
        <TabButton active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} label="Requests" count={activeRequests.length} />
        <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} label="Inventory" count={inventory.length} />
      </div>

      <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {activeTab === 'requests' ? (
          <RequestsView requests={activeRequests} onAccept={(id) => { updateRequestStatus(id, 'accepted'); toast.success("Accepted"); navigate('/chats'); }} onDecline={(id) => { updateRequestStatus(id, 'declined'); toast.error("Declined"); }} inventory={inventory} />
        ) : (
          <InventoryView inventory={inventory} onEdit={setEditProduct} onDelete={setDeleteConfirmId} />
        )}
      </motion.div>
    </div>
  );
};

const RequestsView = ({ requests, onAccept, onDecline, inventory }) => {
  const [filter, setFilter] = useState('All');

  const filteredRequests = requests.filter(req => {
    // Mock logic to find product details from inventory or request itself if inventory not passed fully
    // Assuming we can find product by req.productId in full app, but here we can try to guess or use passed inventory
    // Since `requests` in AuthContext has minimal mock data, let's assume we filter based on text for now or `inventory` prop
    // Actually, let's use the `inventory` prop passed down from ShopDashboard to find the product
    if (!inventory) return true;
    const product = inventory.find(p => p.id === req.productId);
    const condition = (product?.condition || product?.type || 'Used').toLowerCase();
    const category = product?.category || '';

    if (filter === 'All') return true;
    if (filter === 'New') return condition === 'new';
    if (filter === 'Old') return condition === 'used' || condition === 'old';
    if (filter === 'Parts') return category === 'Spare Parts';
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Inventory Requests</h2>

        {/* Filter Tabs */}
        <div className="flex items-center p-1.5 glass rounded-full relative overflow-hidden">
          {['All', 'New', 'Old', 'Parts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`relative z-10 px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${filter === tab ? 'text-white' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {tab}
              {filter === tab && (
                <motion.div
                  layoutId="reqFilter"
                  className="absolute inset-0 bg-brand-primary rounded-full -z-10 shadow-lg shadow-brand-primary/30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.map((req) => (
        <motion.div
          key={req.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          className="glass-card p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden group glow-effect"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary/30" />
          <div className="flex-1 pl-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-md text-[10px] font-bold border border-brand-primary/20">NEW</span>
              <span className="text-text-secondary text-[10px] font-bold flex items-center gap-1 opacity-60">
                <Clock size={12} /> {req.time}
              </span>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-1 tracking-tight">{req.productName}</h3>
            <p className="text-xs font-bold text-text-secondary opacity-70">{req.customerName}</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => onAccept(req.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-xs glow-effect shadow-md shadow-brand-primary/10">
              <Check size={16} /> Accept
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => onDecline(req.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 glass text-text-secondary rounded-xl font-bold text-xs glow-effect">
              <X size={16} /> Decline
            </motion.button>
          </div>
        </motion.div>
      ))}
      {filteredRequests.length === 0 && (
        <div className="text-center py-20 bg-bg-primary/30 rounded-[32px] border border-dashed border-border-primary">
          <Bell size={40} className="mx-auto mb-4 text-text-secondary opacity-20" />
          <p className="font-bold text-text-secondary text-sm">No requests found</p>
        </div>
      )}
    </div>
  );
};

const InventoryView = ({ inventory, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
    <AnimatePresence mode='popLayout'>
      {inventory.map(item => (
        <motion.div
          key={item.id}
          layout
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="glass-card overflow-hidden group hover:border-brand-primary/30 transition-all flex flex-col glow-effect"
        >
          <div className="aspect-[4/3] bg-bg-primary/50 relative overflow-hidden border-b border-border-primary/20">
            <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} />
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                className="p-2 bg-white/90 text-text-primary rounded-lg shadow-lg hover:bg-white transition-all"
              >
                <Edit size={16} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="p-2 bg-white/90 text-red-500 rounded-lg shadow-lg hover:bg-red-50 transition-all"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">{item.category}</span>
              {item.stock <= 1 && (
                <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded-md text-[8px] font-bold">STOCK</span>
              )}
            </div>
            <h3 className="font-bold text-text-primary text-base line-clamp-1 mb-4 group-hover:text-brand-primary transition-colors">{item.name}</h3>

            <div className="mt-auto flex justify-between items-center pt-3 border-t border-border-primary/10">
              <span className="font-bold text-xl text-text-primary">₹{item.price.toLocaleString()}</span>
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${item.type === 'New' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-primary/10 text-brand-primary'}`}>{item.type}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

const DeleteModal = ({ isOpen, onClose, onConfirm, productName }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-[130] p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm glass-card relative z-[131] p-8 text-center glow-effect">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Delete?</h2>
          <p className="text-sm font-bold text-text-secondary opacity-60 mb-8 leading-relaxed">Remove product?</p>
          <div className="flex flex-col gap-3">
            <motion.button whileTap={{ scale: 0.98 }} onClick={onConfirm} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold text-sm glow-effect">Delete</motion.button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={onClose} className="w-full py-3 glass text-text-secondary rounded-xl font-bold text-sm">Cancel</motion.button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const EditModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState(product || {});
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => { if (product) setFormData(product); }, [product]);

  const handleSave = () => {
    if (!formData.name || !formData.price) { toast.error("Required"); return; }
    setIsSaving(true);
    setTimeout(() => { onSave(formData); setIsSaving(false); }, 800);
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[130] p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full max-w-lg glass-card relative z-[131] p-8 max-h-[90vh] overflow-y-auto no-scrollbar glow-effect">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Edit</h2>
              <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-lg text-text-secondary transition-all"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="w-24 h-24 bg-bg-primary rounded-2xl overflow-hidden border border-border-primary/20 flex-shrink-0 relative group">
                  <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="floating-label-group glow-effect">
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Item Name" className="w-full bg-bg-primary/50 px-4 py-3 rounded-xl border border-border-primary/50 text-sm font-bold" />
                    <label>Item Name</label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="floating-label-group glow-effect">
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" className="w-full bg-bg-primary/50 px-4 py-3 rounded-xl border border-border-primary/50 text-sm font-bold text-brand-primary" />
                  <label>Price</label>
                </div>
                <div className="relative glow-effect">
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-bg-primary/50 px-4 py-3 rounded-xl border border-border-primary/50 text-sm font-bold appearance-none outline-none">
                    <option>Spare Parts</option><option>Mobile</option><option>Tablets</option><option>Laptops</option><option>Electronics</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                </div>
              </div>

              <div className="flex p-1 bg-bg-primary/50 rounded-xl border border-border-primary/50">
                {['New', 'Used'].map(c => (
                  <button key={c} onClick={() => setFormData({ ...formData, type: c })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.type === c ? 'bg-white text-brand-primary shadow-sm' : 'text-text-secondary'}`}>{c}</button>
                ))}
              </div>

              <motion.button whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving} className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-base shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 glow-effect disabled:opacity-50">
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save</>}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const TabButton = ({ active, onClick, label, count }) => (
  <motion.button whileTap={{ scale: 0.95 }} onClick={onClick} className={`pb-3 px-1 text-sm font-bold transition-all relative whitespace-nowrap ${active ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}>
    {label}
    {count > 0 && <span className="ml-2 bg-brand-primary/10 text-brand-primary text-[10px] px-2 py-0.5 rounded-full">{count}</span>}
    {active && <motion.div layoutId="dashTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full" />}
  </motion.button>
);

const AnalyticsModal = ({ isOpen, onClose, type, data }) => {
  const labelMap = {
    sales: { name: 'Revenue', color: '#10b981', key: 'sales' },
    listings: { name: 'Inventory', color: '#4f46e5', key: 'listings' },
    requests: { name: 'Requests', color: '#6366f1', key: 'requests' }
  };
  const label = labelMap[type] || labelMap.listings;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-[95%] max-w-4xl glass-card relative z-[111] p-8 md:p-10 max-h-[90vh] overflow-y-auto no-scrollbar glow-effect">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-text-primary">{label.name}</h2>
              <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-lg text-text-secondary transition-all"><X size={20} /></button>
            </div>

            <div className="bg-bg-primary/30 rounded-3xl p-6 border border-border-primary/20 mb-8">
              <h3 className="text-xs font-bold text-text-secondary mb-6 opacity-60">Performance</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}><defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={label.color} stopOpacity={0.2} /><stop offset="95%" stopColor={label.color} stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }} /><YAxis hide /><Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border-primary)', fontSize: '12px' }} /><Area type="monotone" dataKey={label.key} stroke={label.color} strokeWidth={4} fillOpacity={1} fill="url(#areaGrad)" /></AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 glass border border-border-primary/20 rounded-2xl">
                <p className="text-[10px] font-bold text-text-secondary mb-1 opacity-60 uppercase">Top</p>
                <h4 className="text-lg font-bold text-text-primary">Spares</h4>
              </div>
              <div className="p-5 glass border border-border-primary/20 rounded-2xl">
                <p className="text-[10px] font-bold text-text-secondary mb-1 opacity-60 uppercase">Rate</p>
                <h4 className="text-lg font-bold text-emerald-500">68%</h4>
              </div>
              <div className="p-5 glass border border-border-primary/20 rounded-2xl">
                <p className="text-[10px] font-bold text-text-secondary mb-1 opacity-60 uppercase">Year</p>
                <h4 className="text-lg font-bold text-text-primary">₹55K</h4>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShopDashboard;
