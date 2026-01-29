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
  Camera,
  QrCode,
  Download,
  Share2,
  Store,
  Verified,
  MapPin
} from 'lucide-react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import StatusPill from '../components/StatusPill';
import BusinessInsightsModal from '../components/BusinessInsightsModal';

const purzaLogoP = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiM0ZjQ2ZTUiLz48dGV4dCB4PSI1MCIgeT0iNzAiIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9IjY1IiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UDwvdGV4dD48L3N2Zz4=";

const ShopDashboard = () => {
  const navigate = useNavigate();
  const { user, products: inventory, requests, notifications, deleteProduct, updateRequestStatus, updateProduct } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [analyticsType, setAnalyticsType] = useState(null);
  const [showInsights, setShowInsights] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting from database...");
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        setDeleteConfirmId(null);
        toast.success("Permanently Deleted", { id: toastId });
      } else {
        toast.error("Deletion failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Critical System Error", { id: toastId });
    }
  };

  const handleUpdate = async (updatedProduct) => {
    const toastId = toast.loading("Syncing updates...");
    try {
      const res = await updateProduct(updatedProduct.id, updatedProduct);
      if (res.success) {
        setEditProduct(null);
        toast.success("Unit Record Updated", { id: toastId });
      } else {
        toast.error("Sync failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Critical System Error", { id: toastId });
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
      <BusinessInsightsModal isOpen={showInsights} onClose={() => setShowInsights(false)} shopData={user} />

      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-2">
            {user?.shopDetails?.name || user?.name || 'Shop'}
          </h1>
          <p className="text-text-secondary text-sm font-bold opacity-60 flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" /> System live
          </p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInsights(true)}
            className="flex-1 md:flex-none px-6 py-3.5 bg-white border border-border-primary text-brand-primary rounded-2xl font-bold text-xs hover:bg-brand-primary hover:text-white transition-all shadow-xl shadow-brand-primary/5 flex items-center justify-center gap-2 glow-effect"
          >
            <TrendingUp size={16} /> Business Insights
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/shop/upload')}
            className="flex-1 md:flex-none px-6 py-3.5 bg-brand-primary text-white rounded-2xl font-bold text-xs shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2 glow-effect"
          >
            <Plus size={20} /> Post Item
          </motion.button>
        </div>
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
        <TabButton active={activeTab === 'qr'} onClick={() => setActiveTab('qr')} label="Shop QR" />
      </div>

      <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {activeTab === 'requests' ? (
          <RequestsView requests={activeRequests} onAccept={(id) => { updateRequestStatus(id, 'accepted'); toast.success("Accepted"); navigate('/chats'); }} onDecline={(id) => { updateRequestStatus(id, 'declined'); toast.error("Declined"); }} inventory={inventory} />
        ) : activeTab === 'inventory' ? (
          <InventoryView inventory={inventory} onEdit={setEditProduct} onDelete={setDeleteConfirmId} />
        ) : (
          <ShopQRView user={user} />
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
                <div className="w-24 h-24 bg-bg-primary rounded-2xl overflow-hidden border border-border-primary/20 flex-shrink-0 relative group flex items-center justify-center">
                  {formData.image || (formData.images && formData.images[0]) ? (
                    <img
                      src={formData.image || formData.images[0]}
                      className="w-full h-full object-cover"
                      alt="Preview"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="text-text-secondary opacity-20"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg></div>';
                      }}
                    />
                  ) : (
                    <Package size={32} strokeWidth={1} className="text-text-secondary opacity-20" />
                  )}
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
              <div className="h-[400px] w-full min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}><defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={label.color} stopOpacity={0.2} /><stop offset="95%" stopColor={label.color} stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }} /><YAxis hide /><Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border-primary)', fontSize: '12px' }} /><Area type="monotone" dataKey={label.key} stroke={label.color} strokeWidth={4} fillOpacity={1} fill="url(#areaGrad)" /></AreaChart>
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

const ShopQRView = ({ user }) => {
  const shopUrl = `${window.location.origin}/shop/${user?.id || 'demo'}`;
  const posterRef = React.useRef(null);
  const downloadRef = React.useRef(null); // Ensure this ref is defined
  const qrRef = React.useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [capturedQr, setCapturedQr] = useState(null);

  const downloadQR = () => {
    const canvas = document.getElementById('shop-qr-canvas');
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `PurzaSetu_Shop_QR_${user?.shopDetails?.name || 'Shop'}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success("QR Code downloaded!");
  };

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    setIsGenerating(true);
    const toastId = toast.loading("Generating High-Quality Poster...");

    try {
      // Wait for fonts and QR to fully render
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(posterRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          const clonedPoster = clonedDoc.querySelector('[data-poster-container]');
          if (clonedPoster) {
            clonedPoster.style.transform = 'none';
            clonedPoster.style.borderRadius = '1.5rem';

            // Ensure QR canvas is visible
            const qrCanvas = clonedPoster.querySelector('canvas');
            if (qrCanvas) {
              qrCanvas.style.display = 'block';
              qrCanvas.style.opacity = '1';
              qrCanvas.style.visibility = 'visible';
            }
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `PurzaSetu_Official_Poster_${user?.shopDetails?.name || 'Shop'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Official Poster Ready for Print!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate poster", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto py-10">
      <div className="flex flex-col items-center w-full">
        {/* Poster Preview (The portion that gets captured) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center w-full"
        >
          <div className="flex items-center justify-between w-full mb-8 max-w-[595px]">
            <div>
              <h2 className="text-2xl font-black text-text-primary italic uppercase tracking-tight mb-1">Official Poster</h2>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] opacity-40 italic flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live HD Preview
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={downloadPoster}
              disabled={isGenerating}
              className="flex items-center gap-3 px-6 py-3 bg-brand-primary text-white rounded-2xl font-black italic text-xs hover:scale-[1.05] transition-all shadow-xl shadow-brand-primary/20"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <><Download size={16} /> DOWNLOAD POSTER (HD)</>}
            </motion.button>
          </div>

          <div className="scale-[0.6] md:scale-[0.75] origin-top">
            {/* THIS IS THE POSTER CONTAINER */}
            <div
              ref={posterRef}
              data-poster-container="true"
              style={{
                width: '894px',
                height: '1264px',
                backgroundColor: '#ffffff',
                color: '#000000',
                padding: '4.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                border: '18px solid rgba(79, 70, 229, 0.1)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                position: 'relative',
                margin: '0 auto',
                borderRadius: '2rem',
                overflow: 'hidden'
              }}
            >
              {/* Top Branding */}
              <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '4rem', flex: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '4rem',
                      height: '4rem',
                      backgroundColor: '#4f46e5',
                      borderRadius: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Store style={{ color: '#ffffff' }} size={32} />
                  </div>
                  <h1
                    style={{
                      fontSize: '3.5rem',
                      fontWeight: '900',
                      fontStyle: 'italic',
                      lineHeight: '1',
                      letterSpacing: '-0.05em',
                      margin: '0',
                      color: '#4f46e5'
                    }}
                  >
                    PurzaSetu
                  </h1>
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: '700', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#94a3b8', margin: '0' }}>Connect to Spares</p>
              </div>

              {/* Center QR */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem', flex: 'none' }}>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '2.5rem',
                    borderRadius: '4rem',
                    border: '2px solid #f1f5f9',
                    marginBottom: '2rem',
                    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <div ref={qrRef}>
                    <QRCodeCanvas
                      id="shop-qr-canvas"
                      value={shopUrl}
                      size={320}
                      level={"H"}
                      includeMargin={false}
                      imageSettings={{
                        src: purzaLogoP,
                        height: 60,
                        width: 60,
                        excavate: true,
                      }}
                    />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4f46e5', margin: '0 0 0.5rem 0' }}>Scan To Browse Catalog</h3>
                <div style={{ height: '2px', width: '5rem', backgroundColor: 'rgba(79, 70, 229, 0.2)', borderRadius: '9999px' }} />
              </div>

              <div style={{ width: '100%', textAlign: 'center', marginTop: 'auto', marginBottom: '2rem', flex: 'none' }}>
                <h2 style={{ fontSize: '2.75rem', fontStyle: 'italic', fontWeight: '950', textTransform: 'uppercase', letterSpacing: '-0.025em', color: '#0f172a', marginBottom: '1.5rem', marginTop: '0' }}>
                  {user?.shopDetails?.name || user?.name || "Premium Shop"}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '1rem',
                      border: '1px solid #d1fae5',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <Verified size={20} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Verified on PurzaSetu</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: '#f8fafc',
                      color: '#64748b',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '1rem',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <MapPin size={18} />
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Active Partner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-12 text-center text-text-secondary">
        <p className="text-xs font-bold opacity-40 uppercase tracking-widest max-w-[400px] leading-relaxed mx-auto">
          Tip: Print this poster in A4 size and place it near your shop entrance. High-quality QR scanning increases customer engagement by up to 40%.
        </p>
      </div>

      {/* DEDICATED DOWNLOAD-ONLY COMPONENT (Off-screen/Hidden) */}
      <div
        ref={downloadRef}
        data-download-poster="true"
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '800px',
          height: '1100px',
          backgroundColor: '#ffffff',
          color: '#000000',
          fontFamily: 'Arial, sans-serif',
          zIndex: '-100',
          opacity: 0,
          pointerEvents: 'none',
          display: 'block' // Keep block but hidden to ensure browser renders it
        }}
      >
        {/* Outer Border */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          border: '18px solid rgba(79, 70, 229, 0.08)',
          borderRadius: '40px'
        }} />

        {/* Top Branding Section */}
        <div style={{
          position: 'absolute',
          top: '80px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#4f46e5',
            borderRadius: '20px',
            margin: '0 auto 20px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Store style={{ color: '#ffffff' }} size={45} />
          </div>
          <h1 style={{
            fontSize: '65px',
            fontWeight: '950',
            fontStyle: 'italic',
            color: '#4f46e5',
            margin: '0',
            padding: '0',
            letterSpacing: '-2px'
          }}>PurzaSetu</h1>
          <p style={{
            fontSize: '14px',
            fontWeight: '800',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            color: '#94a3b8',
            marginTop: '5px'
          }}>Connect to Spares</p>
        </div>

        {/* Center QR Section */}
        <div style={{
          position: 'absolute',
          top: '360px',
          left: '0',
          right: '0',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#f8fafc',
            padding: '45px',
            borderRadius: '60px',
            border: '2px solid #f1f5f9'
          }}>
            <QRCodeCanvas
              value={shopUrl}
              size={350}
              level={"H"}
              includeMargin={false}
              imageSettings={{
                src: purzaLogoP,
                height: 70,
                width: 70,
                excavate: true,
              }}
            />
          </div>
          <div style={{ marginTop: '35px' }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: '#4f46e5',
              margin: '0'
            }}>Scan To Browse Catalog</h3>
            <div style={{
              width: '80px',
              height: '3px',
              backgroundColor: 'rgba(79, 70, 229, 0.2)',
              margin: '15px auto 0 auto'
            }} />
          </div>
        </div>

        {/* Bottom Shop Info */}
        <div style={{
          position: 'absolute',
          bottom: '100px',
          width: '100%',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '52px',
            fontWeight: '950',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            color: '#0f172a',
            margin: '0 40px 30px 40px',
            lineHeight: '1.1'
          }}>
            {user?.shopDetails?.name || user?.name || "Premium Shop"}
          </h2>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              padding: '15px 35px',
              borderRadius: '20px',
              border: '1px solid #d1fae5',
              marginRight: '20px'
            }}>
              <Verified size={24} style={{ marginRight: '10px' }} />
              <span style={{ fontSize: '16px', fontWeight: '900', textTransform: 'uppercase' }}>Verified Partner</span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              color: '#64748b',
              padding: '15px 35px',
              borderRadius: '20px',
              border: '1px solid #f1f5f9'
            }}>
              <MapPin size={22} style={{ marginRight: '10px' }} />
              <span style={{ fontSize: '16px', fontWeight: '800', textTransform: 'uppercase' }}>Active Store</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
