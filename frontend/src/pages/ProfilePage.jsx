import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  MapPin,
  ShieldCheck,
  Camera,
  Save,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  HardDrive,
  Phone,
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  X,
  FileText,
  Download,
  Calendar,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SettingsModal from '../components/SettingsModal';
import ThemeModal from '../components/ThemeModal';

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth();
  const { currentTheme, setCurrentTheme, themes } = useTheme();
  const navigate = useNavigate();

  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleThemeChange = () => {
    setShowThemeModal(true);
  };

  const activeThemeObj = themes.find(t => t.id === currentTheme) || themes[0];
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: (user?.location && typeof user.location === 'object') ? `${user.location.lat}, ${user.location.lng}` : (user?.location || 'New Delhi, India'),
    bio: user?.bio || 'Automotive enthusiast and professional dealer.',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size too large (Max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          updateProfile({ avatar: reader.result });
          toast.success("Profile photo updated");
        } catch (error) {
          toast.error("Failed to process image");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
    }

    try {
      const { newPassword, confirmPassword, ...profileData } = formData;
      const updates = formData.newPassword ? { ...profileData, password: newPassword } : profileData;

      updateProfile(updates);
      setIsEditing(false);
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
      toast.success("Profile saved");
    } catch (err) {
      toast.error("Failed to save profile");
    }
  };

  return (
    <div className="pt-24 pb-32 px-4 md:px-8 max-w-4xl mx-auto min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 p-2 text-text-secondary hover:text-brand-primary transition-all flex items-center gap-2 text-sm font-semibold btn-press"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Profile Header */}
      <div className="glass-card p-6 md:p-10 mb-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-28 h-28 md:w-36 md:h-36 bg-bg-primary rounded-full flex items-center justify-center text-brand-primary/20 border border-border-primary/50 overflow-hidden shadow-inner">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <User size={48} />
              )}
            </div>
            <label className="absolute bottom-1 right-1 p-2.5 bg-brand-primary text-white rounded-full shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all border-4 border-white/50">
              <Camera size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
              {isEditing ? (
                <input
                  className="bg-bg-primary/50 border border-border-primary/50 rounded-xl px-4 py-2 text-2xl font-bold text-text-primary outline-none focus:border-brand-primary/30"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">{user?.name}</h1>
              )}
              <div className="flex items-center justify-center md:justify-start gap-1.5 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck size={12} fill="currentColor" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{user?.role || 'Guest'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {isEditing ? (
                <>
                  <div className="floating-label-group">
                    <input
                      className="w-full bg-bg-primary/50 border border-border-primary/50 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email"
                    />
                    <label>Email</label>
                  </div>
                  <div className="floating-label-group">
                    <input
                      className="w-full bg-bg-primary/50 border border-border-primary/50 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone"
                    />
                    <label>Phone</label>
                  </div>
                </>
              ) : (
                <>
                  <p className="flex items-center justify-center md:justify-start gap-2 text-text-secondary text-sm font-medium">
                    <Mail size={14} className="text-brand-primary opacity-60" /> {user?.email}
                  </p>
                  {user?.phone && (
                    <p className="flex items-center justify-center md:justify-start gap-2 text-text-secondary text-sm font-medium">
                      <Phone size={14} className="text-brand-primary opacity-60" /> {user?.phone}
                    </p>
                  )}
                  <p className="flex items-center justify-center md:justify-start gap-2 text-text-secondary text-sm font-medium">
                    <MapPin size={14} className="text-brand-primary opacity-60" /> {formData.location}
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className="px-8 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 btn-press glow-effect"
              >
                Account Settings <Settings size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
        <div onClick={handleThemeChange}>
          <ProfileCard
            icon={<Sparkles size={20} />}
            title="Appearance"
            subtitle={`Mode: ${activeThemeObj.name}`}
            color="text-indigo-600"
          />
        </div>
        <div onClick={() => setShowHistory(true)}>
          <ProfileCard icon={<HardDrive size={20} />} title="History" subtitle="View your activity" color="text-emerald-500" />
        </div>

        <div onClick={() => { logout(); navigate('/login'); toast.success("Logged out"); }} className="md:col-span-2 glass border border-border-primary/50 p-6 rounded-3xl flex items-center justify-between cursor-pointer group transition-all btn-press">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
              <LogOut size={20} />
            </div>
            <div>
              <h3 className="font-bold text-text-primary text-lg">Log Out</h3>
              <p className="text-text-secondary text-xs opacity-60">Disconnect from session</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-text-secondary group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      {/* Modals */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <ThemeModal isOpen={showThemeModal} onClose={() => setShowThemeModal(false)} />
      <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
};

const ProfileCard = ({ icon, title, subtitle, color }) => (
  <div className="glass-card p-6 hover:shadow-md transition-all cursor-pointer group btn-press">
    <div className={`w-12 h-12 bg-bg-primary/50 ${color} rounded-xl flex items-center justify-center mb-4 border border-border-primary/20`}>
      {icon}
    </div>
    <h3 className="font-bold text-text-primary text-lg mb-0.5">{title}</h3>
    <p className="text-text-secondary text-xs font-medium opacity-60">{subtitle}</p>
  </div>
);

const HistoryModal = ({ isOpen, onClose }) => {
  const { user, getOrderHistory } = useAuth();
  const [filter, setFilter] = useState('Completed');
  const role = user?.role?.toLowerCase() || 'customer';

  // Assuming getOrderHistory returns all relevant orders
  const allHistory = getOrderHistory(role);

  // Filter logic (Mocking status for demo if not present in completedOrders)
  // In real app, completedOrders would have 'cancelled' or 'returned' status too.
  // For now, we assume getOrderHistory returns mostly completed orders, but we can filter if needed.
  const history = allHistory.filter(item => {
    if (filter === 'Completed') return item.status === 'completed';
    // Mock other statuses for demo tabs, or if data supports it
    return item.status === filter.toLowerCase();
  });

  const totalEarnings = role === 'shopkeeper'
    ? allHistory.reduce((acc, curr) => acc + (curr.amount || 0), 0)
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[130] p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-2xl glass-card relative z-[131] p-0 overflow-hidden flex flex-col max-h-[85vh] glow-effect">

            {/* Header */}
            <div className="p-6 border-b border-border-primary/10 flex justify-between items-center bg-bg-primary/30">
              <div>
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">Order History</h2>
                <p className="text-xs font-bold text-text-secondary opacity-60 uppercase tracking-wider">
                  {role === 'shopkeeper' ? 'Sales & Earnings' : 'Purchases & Invoices'}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-bg-primary/50 rounded-full text-text-secondary transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Shopkeeper Earnings Summary */}
            {role === 'shopkeeper' && (
              <div className="p-6 pb-0">
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-emerald-500 text-xs font-black uppercase tracking-widest mb-1">Total Earnings</p>
                    <h3 className="text-3xl font-black text-text-primary">₹{totalEarnings.toLocaleString()}</h3>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <TrendingUp size={24} />
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="p-6 flex gap-2 overflow-x-auto no-scrollbar">
              {['Completed', 'Cancelled', 'Returned'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${filter === tab ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20' : 'glass border-border-primary/30 text-text-secondary hover:text-text-primary'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-4">
              {history.length > 0 ? (
                history.map(item => (
                  <div key={item.id} className="glass p-5 rounded-2xl border border-border-primary/10 hover:border-brand-primary/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center">
                          <Package size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">{item.productName}</h4>
                          <p className="text-[10px] font-bold text-text-secondary opacity-60 uppercase tracking-wider">
                            {role === 'shopkeeper' ? `Customer: ${item.customerName}` : `Shop: ${item.shopName || 'AutoParts Syndicate'}`}
                          </p>
                        </div>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded-md border border-emerald-500/20 uppercase">
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border-primary/10">
                      <div className="flex items-center gap-4 text-xs font-bold text-text-secondary">
                        <span className="flex items-center gap-1 opacity-70"><Calendar size={14} /> {item.date || new Date().toLocaleDateString()}</span>
                        <span className="text-text-primary">₹{item.amount?.toLocaleString()}</span>
                      </div>

                      {role === 'customer' && (
                        <button className="flex items-center gap-2 text-brand-primary text-[10px] font-black uppercase tracking-widest hover:underline">
                          <Download size={14} /> Invoice
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 opacity-50">
                  <div className="w-16 h-16 bg-bg-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-border-primary/30">
                    <FileText size={24} className="text-text-secondary" />
                  </div>
                  <p className="text-sm font-bold text-text-secondary">No history found</p>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePage;
