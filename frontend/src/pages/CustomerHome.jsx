import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Package,
  Settings,
  Smartphone,
  Tablet,
  Laptop,
  HardDrive,
  Headphones,
  Filter,
  X,
  Zap,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Navigation,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import toast from 'react-hot-toast';
import GuestRestrictionModal from '../components/GuestRestrictionModal';
import StatusPill from '../components/StatusPill';

const CustomerHome = () => {
  const navigate = useNavigate();
  const { products, requests, user, isGuest, users } = useAuth();
  const { query, setQuery } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [view, setView] = useState('inventory'); // inventory or requests
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [inventoryFilter, setInventoryFilter] = useState('All');
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('sparehub-location');
    return saved ? JSON.parse(saved) : { state: '', district: '', area: '' };
  });

  // Filter requests for the current user
  const myRequests = requests.filter(r => r.customerName === user?.name);

  const categories = [
    { id: 'All', icon: <Package size={18} />, label: 'All' },
    { id: 'Mobile', icon: <Smartphone size={18} />, label: 'Mobile' },
    { id: 'Tablets', icon: <Tablet size={18} />, label: 'Tablets' },
    { id: 'Laptops', icon: <Laptop size={18} />, label: 'Laptops' },
    { id: 'Spare Parts', icon: <HardDrive size={18} />, label: 'Spares' },
    { id: 'Accessories', icon: <Headphones size={18} />, label: 'Accessories' },
    { id: 'Electronics', icon: <Settings size={18} />, label: 'Electronics' },
  ];

  const handleViewChange = (newView) => {
    if (newView === 'requests' && isGuest) {
      setShowGuestModal(true);
      return;
    }
    setView(newView);
  };

  const fuse = useMemo(() => new Fuse(products, {
    keys: ['name', 'category', 'compat', 'description'],
    threshold: 0.35,
    includeMatches: true
  }), [products]);

  const filteredProducts = useMemo(() => {
    const isMainShopVerified = users.find(u => u.email === 'shop@sparehub.com')?.status === 'Verified';

    let result = products;

    if (!isMainShopVerified) {
      result = result.filter(item => item.id !== 2);
    }

    // Apply inventory filter (condition-based)
    if (inventoryFilter !== 'All') {
      if (inventoryFilter === 'New') {
        result = result.filter(item => item.type?.toLowerCase() === 'new');
      } else if (inventoryFilter === 'Old') {
        result = result.filter(item => item.type?.toLowerCase() === 'used' || item.type?.toLowerCase() === 'old');
      } else if (inventoryFilter === 'Parts') {
        result = result.filter(item => item.category === 'Spare Parts');
      }
    }

    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    if (query) {
      const searchResults = fuse.search(query);
      result = searchResults.map(res => res.item);
    }

    return result;
  }, [products, query, selectedCategory, inventoryFilter, fuse, users]);

  return (
    <div className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="mb-10 flex justify-between items-start">
        <div className="text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-2">
            {user?.name ? `Hello, ${user.name}` : 'SpareHub'}
          </h1>
          <p className="text-text-secondary text-sm font-medium opacity-60">Fine-quality parts for you</p>
        </div>

        <button
          onClick={() => setShowLocationModal(true)}
          className="glass px-4 py-2 rounded-full border border-border-primary/50 flex items-center gap-2 text-xs font-bold text-text-primary hover:border-brand-primary/50 transition-all group"
        >
          <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
            <MapPin size={12} />
          </div>
          <span className="max-w-[100px] truncate">{location.area || 'All India'}</span>
          <ChevronDown size={12} className="text-text-secondary" />
        </button>
      </div>

      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelect={(loc) => {
          setLocation(loc);
          localStorage.setItem('sparehub-location', JSON.stringify(loc));
          toast.success(`Location set to ${loc.area}`);
          setShowLocationModal(false);
        }}
      />

      {/* Tab Switcher */}
      <div className="flex gap-6 mb-8 border-b border-border-primary/20">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setView('inventory')}
          className={`pb-4 px-1 text-sm font-bold relative transition-all ${view === 'inventory' ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Inventory
          {view === 'inventory' && <motion.div layoutId="custTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full" />}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => handleViewChange('requests')}
          className={`pb-4 px-1 text-sm font-bold relative transition-all ${view === 'requests' ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Requests
          {myRequests.length > 0 && <span className="ml-2 bg-brand-primary/10 text-brand-primary text-[10px] px-2 py-0.5 rounded-full">{myRequests.length}</span>}
          {view === 'requests' && <motion.div layoutId="custTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full" />}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'inventory' ? (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Filter Tabs */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center p-1.5 glass rounded-full relative overflow-hidden">
                {['All', 'New', 'Old', 'Parts'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setInventoryFilter(tab)}
                    className={`relative z-10 px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${inventoryFilter === tab ? 'text-white' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    {tab}
                    {inventoryFilter === tab && (
                      <motion.div
                        layoutId="inventoryFilter"
                        className="absolute inset-0 bg-brand-primary rounded-full -z-10 shadow-lg shadow-brand-primary/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>


            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 mb-6">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all whitespace-nowrap glow-effect ${selectedCategory === cat.id ? 'bg-brand-primary border-brand-primary text-white shadow-md' : 'glass border-border-primary/50 text-text-secondary hover:border-brand-primary/30'}`}
                >
                  <span className={selectedCategory === cat.id ? 'text-white' : 'text-brand-primary'}>{cat.icon}</span>
                  <span className="font-bold text-xs">{cat.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/customer/product/${item.id}`)}
                  className="glass-card p-4 transition-all group cursor-pointer relative flex flex-col glow-effect"
                >
                  <div className="aspect-[4/3] bg-bg-primary/50 rounded-2xl mb-4 overflow-hidden border border-border-primary/10">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${item.type === 'New' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-primary/10 text-brand-primary'}`}>
                        {item.type}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-text-secondary">
                        <MapPin size={10} className="text-brand-primary" /> Near
                      </div>
                    </div>
                    <h3 className="font-bold text-text-primary text-base mb-1 line-clamp-1 group-hover:text-brand-primary transition-colors">{item.name}</h3>
                    <p className="text-xs text-text-secondary line-clamp-2 mb-4 opacity-70 font-bold">{item.description}</p>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-border-primary/20">
                    <span className="text-lg font-bold text-text-primary">₹{item.price.toLocaleString()}</span>
                    <ChevronRight size={18} className="text-brand-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="requests"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4 max-w-3xl"
          >
            {myRequests.map((req) => (
              <motion.div
                key={req.id}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-5 flex flex-col gap-4 relative overflow-hidden group glow-effect"
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${req.status === 'accepted' ? 'bg-blue-500' : req.status === 'declined' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <div className="flex-1 w-full pl-2">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <StatusPill status={req.status} />
                    <span className="text-text-secondary text-[10px] font-bold flex items-center gap-1 opacity-60">
                      <Clock size={12} /> {req.time}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary tracking-tight mb-1">{req.productName}</h3>

                  {/* Booking Code Display */}
                  {req.status === 'accepted' && req.bookingCode && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl"
                    >
                      <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-1">Booking Code</p>
                      <p className="text-2xl font-bold text-blue-500 tracking-wider">{req.bookingCode}</p>
                      <p className="text-[10px] font-medium text-text-secondary mt-1 opacity-70">Show this code to the shopkeeper</p>
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-border-primary/10">
                  <div>
                    <p className="text-[10px] font-bold text-text-secondary opacity-50 mb-0.5 uppercase tracking-wider">Amount</p>
                    <span className="text-xl font-bold text-brand-primary">₹{req.amount.toLocaleString()}</span>
                  </div>
                  {req.status === 'accepted' && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/chats')}
                      className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-xs shadow-md shadow-brand-primary/20 glow-effect"
                    >
                      Message Shop
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
            {myRequests.length === 0 && (
              <div className="text-center py-20 bg-bg-primary/30 rounded-[32px] border border-dashed border-border-primary">
                <Package size={40} className="mx-auto mb-4 text-text-secondary opacity-20" />
                <p className="font-bold text-text-secondary text-sm">No requests</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <GuestRestrictionModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} />
    </div>
  );
};

const STATES_DATA = {
  'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'South Delhi', 'West Delhi'],
  'Maharashtra': ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Nashik', 'Thane'],
  'Karnataka': ['Bangalore Urban', 'Bangalore Rural', 'Mysore', 'Mangalore', 'Hubli'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Noida'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Hissar']
};

const LocationModal = ({ isOpen, onClose, onSelect }) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleUseCurrent = () => {
    const toastId = toast.loading("Locating...");
    setTimeout(() => {
      const detected = { state: 'Delhi', district: 'New Delhi', area: 'Connaught Place' };
      onSelect(detected);
      toast.success("Location Detected", { id: toastId });
    }, 1500);
  };

  const handleConfirm = () => {
    if (selectedState && selectedDistrict) {
      onSelect({ state: selectedState, district: selectedDistrict, area: selectedDistrict });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[150] p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md glass-card p-0 overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-text-primary text-xl tracking-tight">Select Location</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-text-secondary transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <button
                onClick={handleUseCurrent}
                className="w-full py-4 bg-brand-primary/10 border border-brand-primary/50 text-brand-primary rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-primary/20 transition-all glow-effect"
              >
                <Navigation size={18} /> Use Current Location
              </button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] font-black uppercase text-text-secondary opacity-50 tracking-widest">Or Select Manually</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">State</label>
                  <div className="relative">
                    <select
                      value={selectedState}
                      onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                      className="w-full px-4 py-3 bg-bg-primary/50 border border-white/10 rounded-xl outline-none appearance-none text-sm font-semibold text-text-primary focus:border-brand-primary/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all"
                    >
                      <option value="">Select State</option>
                      {Object.keys(STATES_DATA).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
                  </div>
                </div>

                <AnimatePresence>
                  {selectedState && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">District / Area</label>
                      <div className="relative">
                        <select
                          value={selectedDistrict}
                          onChange={(e) => setSelectedDistrict(e.target.value)}
                          className="w-full px-4 py-3 bg-bg-primary/50 border border-white/10 rounded-xl outline-none appearance-none text-sm font-semibold text-text-primary focus:border-brand-primary/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all"
                        >
                          <option value="">Select District</option>
                          {STATES_DATA[selectedState].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                disabled={!selectedDistrict}
                onClick={handleConfirm}
                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Confirm Location
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


export default CustomerHome;
