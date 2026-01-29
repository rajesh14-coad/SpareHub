import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { formatCount } from '../utils/analytics';
import {
  Store,
  MapPin,
  Star,
  MessageSquare,
  ArrowLeft,
  Plus,
  Package,
  ShieldCheck,
  Navigation,
  Globe,
  Verified,
  X,
  Clock,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  QrCode,
  Download,
  Trash2,
  Calendar,
  Pencil,
  LogOut,
  Smartphone,
  Image as ImageIcon
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const ShopProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, users, updateProfile, products, deleteProduct, logout, trackShopVisit } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  // Track shop visit
  useEffect(() => {
    if (id) {
      trackShopVisit(parseInt(id));
    } else if (user?.id && user?.role === 'shopkeeper') {
      trackShopVisit(user.id);
    }
  }, [id, user?.id, trackShopVisit]);

  // Check if viewing own shop
  const isOwnShop = user?.role === 'shopkeeper' && (id === String(user?.id) || !id);

  // Shop Data (Dynamically merged from user object if it's the owner's shop)
  // Search for shop in global users registry
  const viewedShop = useMemo(() => {
    return users.find(u => String(u.id) === String(id) && u.role === 'shopkeeper');
  }, [id, users]);

  // Shop Data (Dynamically merged from viewedShop or own user object)
  const shopData = useMemo(() => {
    const source = isOwnShop ? user : viewedShop;

    if (!source) {
      // Return a refined fallback if no data found yet
      return {
        id: id || 'loading',
        name: 'Loading Shop...',
        dealer: 'Please wait',
        address: 'Fetching from database',
        category: '...',
        verified: false,
        stats: { activeListings: 0, sales: '0' }
      };
    }

    return {
      id: source.id,
      name: source.shopDetails?.name || source.name || 'Premium Shop',
      dealer: source.name,
      address: source.shopDetails?.address || 'Location not set',
      category: source.shopDetails?.category || 'Spare Parts',
      timings: source.shopDetails?.timings || '9:00 AM - 6:00 PM',
      rating: 4.8,
      reviews: 124,
      verified: source.status === 'Verified' || source.isVerified,
      joinedDate: source.joined || 'Mar 2023',
      yearsInBusiness: source.shopDetails?.yearsInBusiness || '3+',
      businessMobile: source.shopDetails?.businessMobile || source.phone || 'Contact not set',
      coverPhoto: source.shopDetails?.coverPhoto || null,
      stats: {
        activeListings: products.filter(p => String(p.shopId) === String(source.id) || p.owner === source.name).length,
        joinedDate: source.joined || 'Mar 2023',
        sales: source.shopVisits ? formatCount(source.shopVisits) : '1.2L+'
      }
    };
  }, [isOwnShop, user, viewedShop, id, products]);

  // Filter products for this shop
  const shopProducts = useMemo(() => {
    if (isOwnShop) {
      return products.filter(p => String(p.shopId) === String(user.id) || p.owner === user.name);
    }
    // For other shops, just return a subset of products for demo
    return products.slice(0, 3);
  }, [products, isOwnShop, user, id]);

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to remove this product from your inventory?")) {
      deleteProduct(productId);
      toast.success("Product removed successfully");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate('/login');
      toast.success("Logged out successfully");
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Cover Photo Banner */}
      <div className="absolute top-0 left-0 w-full h-[350px] overflow-hidden z-0">
        {shopData.coverPhoto ? (
          <img
            src={shopData.coverPhoto}
            className="w-full h-full object-cover blur-[4px] scale-105 opacity-40 transition-all duration-700"
            alt="Shop Cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-primary/20 to-cyan-500/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/50 to-bg-primary" />
      </div>

      <div className="pt-28 pb-32 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        {/* Header / Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-bg-secondary rounded-[1.5rem] text-text-secondary hover:text-brand-primary border border-border-primary transition-all flex items-center gap-3 font-black uppercase text-[10px] tracking-widest shadow-lg"
          >
            <ArrowLeft size={20} /> Back
          </button>
        </div>

        {/* Shop Header Card */}
        <div className="bg-bg-secondary rounded-[3.5rem] border border-border-primary shadow-2xl relative overflow-hidden mb-16 p-8 md:p-12">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <Store size={220} strokeWidth={1} />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Shop Identity */}
            <div className="w-32 h-32 md:w-44 md:h-44 bg-bg-primary rounded-[3rem] shadow-inner flex items-center justify-center text-brand-primary relative border border-white/5">
              <Store size={64} />
              {shopData.verified && (
                <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white p-2 rounded-2xl shadow-xl border-4 border-bg-secondary">
                  <Verified size={20} />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-6xl font-black text-text-primary italic tracking-tighter uppercase">{shopData.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full border border-emerald-500/20">
                    <Star size={14} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{shopData.rating}</span>
                  </div>
                  <div className="bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full border border-brand-primary/20 text-[10px] font-black uppercase tracking-widest">
                    {shopData.category}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center md:justify-start gap-3 text-text-secondary flex-wrap">
                  <span className="flex items-center gap-2 font-bold text-sm bg-bg-primary px-4 py-2 rounded-2xl border border-border-primary">
                    <MapPin size={16} className="text-brand-primary" /> {shopData.address}
                  </span>
                  <span className="flex items-center gap-2 font-bold text-sm bg-bg-primary px-4 py-2 rounded-2xl border border-border-primary">
                    <Clock size={16} className="text-brand-primary" /> {shopData.timings}
                  </span>
                  <span className="flex items-center gap-2 font-bold text-sm bg-bg-primary px-4 py-2 rounded-2xl border border-border-primary">
                    <Smartphone size={16} className="text-brand-primary" /> {shopData.businessMobile}
                  </span>
                </div>
                <p className="text-text-secondary font-black uppercase text-[10px] tracking-widest italic opacity-50">Authorized Dealer: <span className="text-text-primary opacity-100">{shopData.dealer}</span> • Est. {shopData.joinedDate}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {isOwnShop ? (
                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="flex-1 md:flex-none px-6 py-3 bg-brand-primary text-white rounded-2xl font-black italic text-xs shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2 hover:scale-[1.05] active:scale-95 transition-all glow-effect"
                    >
                      <Pencil size={18} /> EDIT STORE
                    </button>
                    <button
                      onClick={() => navigate('/shop/upload')}
                      className="flex-1 md:flex-none px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black italic text-xs shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.05] active:scale-95 transition-all glow-effect"
                    >
                      <Plus size={18} /> ADD PRODUCT
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 md:flex-none px-6 py-3 bg-red-500/10 text-red-500 rounded-2xl font-black italic text-xs border border-red-500/20 flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all btn-press"
                    >
                      <LogOut size={18} /> LOGOUT
                    </button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => navigate('/chat/conv1')} className="flex-1 md:flex-none px-12 py-5 bg-brand-primary text-white rounded-[2rem] font-black italic text-xl shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3 hover:scale-[1.05] active:scale-95 transition-all">
                      MESSAGE SHOP <MessageSquare size={24} />
                    </button>
                    <button
                      onClick={() => {
                        const destination = `${shopData.location?.lat || 28.625},${shopData.location?.lng || 77.125}`;
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
                      }}
                      className="flex-1 md:flex-none px-12 py-5 bg-bg-primary text-text-primary border border-border-primary rounded-[2rem] font-black italic text-xl flex items-center justify-center gap-3 hover:bg-bg-secondary transition-all btn-press"
                    >
                      GET DIRECTIONS <Navigation size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Shop Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-border-primary border-dashed">
            <StatItem label="Products Listed" value={shopData.stats.activeListings} />
            <StatItem label="Shop Rating" value={shopData.rating} />
            <StatItem label="Years in Business" value={shopData.yearsInBusiness} />
          </div>
        </div>

        {/* Product Grid Header */}
        <div className="flex items-center gap-4 mb-10 px-2 justify-center md:justify-start">
          <Package size={32} className="text-brand-primary" strokeWidth={3} />
          <h2 className="text-4xl font-black text-text-primary tracking-tighter uppercase italic">Shop <span className="text-brand-primary italic">Inventory</span></h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {shopProducts.map(item => (
            <motion.div
              key={item.id}
              whileHover={{ y: -12 }}
              onClick={() => navigate(`/customer/product/${item.id}`)}
              className="bg-bg-secondary p-8 rounded-[3rem] shadow-xl border border-border-primary hover:shadow-2xl hover:border-brand-primary/40 transition-all group overflow-hidden cursor-pointer"
            >
              <div className="aspect-square bg-bg-primary rounded-[2rem] mb-6 flex items-center justify-center text-text-secondary group-hover:bg-brand-primary/5 transition-colors relative overflow-hidden">
                {item.image || (item.images && item.images[0]) ? (
                  <img
                    src={item.image || item.images[0]}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="text-text-secondary opacity-20"><svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg></div>';
                    }}
                  />
                ) : (
                  <Package size={80} strokeWidth={1} className="text-text-secondary opacity-10 group-hover:scale-110 group-hover:text-brand-primary/20 transition-all duration-700" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-brand-primary/5">
                  <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">View Catalog Entry</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.type === 'New' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                  {item.type}
                </span>
                <span className="text-text-secondary font-black text-[9px] uppercase">{item.compat}</span>
              </div>

              <h3 className="font-black text-text-primary text-2xl mb-4 leading-none group-hover:text-brand-primary transition-colors italic uppercase">
                {item.name}
              </h3>

              <div className="pt-4 border-t border-border-primary border-dashed mt-auto">
                <div className="flex items-center gap-1.5 mb-2 opacity-30">
                  <Eye size={12} className="text-text-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">
                    {formatCount(item.viewCount || 0)} views
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-text-primary italic">₹{item.price.toLocaleString()}</span>
                  {isOwnShop ? (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/shop/upload'); }}
                        className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all glow-effect"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteProduct(item.id); }}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <button className="p-4 bg-brand-primary/10 text-brand-primary rounded-2xl hover:bg-brand-primary hover:text-white transition-all">
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Edit Modal */}
        <ShopEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          shopData={shopData}
          onSave={async (updatedData) => {
            const toastId = toast.loading('Syncing with database...');
            try {
              const res = await updateProfile({
                name: updatedData.ownerName,
                phone: updatedData.contactNumber,
                shopDetails: {
                  ...user.shopDetails,
                  name: updatedData.shopName,
                  timings: updatedData.timings,
                  category: updatedData.category === 'custom' ? updatedData.customCategory : updatedData.category,
                  address: updatedData.address,
                  yearsInBusiness: updatedData.yearsInBusiness,
                  businessMobile: updatedData.businessMobile,
                  coverPhoto: updatedData.coverPhoto
                }
              });

              if (res.success) {
                setShowEditModal(false);
                toast.success('Shop details secured permanently!', { id: toastId });
              } else {
                toast.error('Failed to sync. Check network.', { id: toastId });
              }
            } catch (err) {
              toast.error('Critical Database Error', { id: toastId });
            }
          }}
        />
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
  <div className="text-center">
    <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.3em] mb-2">{label}</p>
    <p className="text-3xl font-black text-text-primary italic">{value}</p>
  </div>
);

const ShopEditModal = ({ isOpen, onClose, shopData, onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    shopName: shopData?.name || '',
    ownerName: user?.name || '',
    contactNumber: user?.phone || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    timings: shopData?.timings || '9:00 AM - 6:00 PM',
    category: shopData?.category || 'Spare Parts',
    customCategory: '',
    address: shopData?.address || '',
    yearsInBusiness: shopData?.yearsInBusiness || '3+',
    businessMobile: shopData?.businessMobile || '',
    coverPhoto: shopData?.coverPhoto || null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState('shop'); // 'shop' or 'account'
  const [isUploading, setIsUploading] = useState(false);

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size too large (Max 2MB)");
        return;
      }
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverPhoto: reader.result });
        setIsUploading(false);
        toast.success("Cover photo prepared!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (activeSection === 'account' && formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }

    onSave(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[150] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl glass-card relative z-[151] p-8 max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-primary/20">
              <h2 className="text-2xl font-bold text-text-primary">Edit Shop Profile</h2>
              <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-lg text-text-secondary transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveSection('shop')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === 'shop' ? 'bg-brand-primary text-white' : 'glass text-text-secondary'}`}
              >
                Shop Info
              </button>
              <button
                onClick={() => setActiveSection('account')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === 'account' ? 'bg-brand-primary text-white' : 'glass text-text-secondary'}`}
              >
                Account
              </button>
            </div>

            {/* Shop Info Section */}
            {activeSection === 'shop' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">Shop Name</label>
                  <input
                    type="text"
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full bg-bg-primary/50 border border-border-primary rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-primary/50"
                    placeholder="Enter shop name"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">Years in Business</label>
                  <input
                    type="text"
                    value={formData.yearsInBusiness}
                    onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                    className="w-full bg-bg-primary/50 border border-border-primary rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-primary/50"
                    placeholder="e.g., 5+"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">Timings</label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="text"
                      value={formData.timings}
                      onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-bg-primary/50 border border-border-primary rounded-xl text-sm font-semibold outline-none focus:border-brand-primary/50"
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">Business Mobile Number</label>
                  <div className="relative">
                    <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="text"
                      value={formData.businessMobile}
                      onChange={(e) => setFormData({ ...formData, businessMobile: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-bg-primary/50 border border-border-primary rounded-xl text-sm font-semibold outline-none focus:border-brand-primary/50"
                      placeholder="e.g., +91 98765 00000"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-bg-primary/50 border border-border-primary rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-primary/50 appearance-none"
                  >
                    <option value="Car Parts">Car Parts</option>
                    <option value="Bike Parts">Bike Parts</option>
                    <option value="EV Spares">EV Spares</option>
                    <option value="Truck/Heavy">Truck/Heavy</option>
                    <option value="Accessories">Accessories</option>
                    <option value="custom">Custom...</option>
                  </select>
                </div>
                {formData.category === 'custom' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">Custom Category Name</label>
                    <input
                      type="text"
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      className="w-full bg-bg-primary/50 border border-border-primary rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-primary/50"
                      placeholder="Type your category"
                    />
                  </motion.div>
                )}
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">Shop Cover Photo</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border-primary rounded-2xl cursor-pointer hover:bg-bg-primary/30 transition-all overflow-hidden relative group">
                    {formData.coverPhoto ? (
                      <>
                        <img src={formData.coverPhoto} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon className="text-white" size={24} />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="text-text-secondary opacity-40" size={24} />
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest italic">Upload Cover Banner</span>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                  </label>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-bg-primary/50 border border-border-primary rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-primary/50 resize-none"
                    rows={3}
                    placeholder="Enter complete address"
                  />
                </div>
              </div>
            )}

            {/* Account Section */}
            {activeSection === 'account' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">Owner Name</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full bg-bg-primary/50 border border-border-primary rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-primary/50"
                    placeholder="Enter owner name"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">Contact Number</label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full bg-bg-primary/50 border border-border-primary rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-primary/50"
                    placeholder="Enter contact number"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-bg-primary/50 border border-border-primary rounded-xl text-sm font-semibold outline-none focus:border-brand-primary/50"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">Current Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="w-full pl-12 pr-12 py-3 bg-bg-primary/50 border border-border-primary rounded-xl text-sm font-semibold outline-none focus:border-brand-primary/50"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">New Password</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-primary/50 border border-border-primary rounded-xl text-sm font-semibold outline-none focus:border-brand-primary/50"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2 block">Confirm New Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-primary/50 border border-border-primary rounded-xl text-sm font-semibold outline-none focus:border-brand-primary/50"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="w-full mt-6 py-4 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 glow-effect"
            >
              <Save size={20} /> Save Changes
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShopProfile;
