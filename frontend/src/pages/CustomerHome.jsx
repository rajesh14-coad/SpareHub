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
  Check,
  QrCode,
  Eye
} from 'lucide-react';
import ScannerModal from '../components/ScannerModal';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import toast from 'react-hot-toast';
import GuestRestrictionModal from '../components/GuestRestrictionModal';
import { formatCount } from '../utils/analytics';
import { calculateDistance, formatDistance } from '../utils/location';
import StatusPill from '../components/StatusPill';
import LocationModal from '../components/LocationModal';

const CustomerHome = () => {
  const navigate = useNavigate();
  const { products, requests, user, isGuest, users } = useAuth();
  const { query, setQuery } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [view, setView] = useState('inventory'); // inventory or requests
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [inventoryFilter, setInventoryFilter] = useState('All');
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('purzasetu-location');
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

  const productFuse = useMemo(() => new Fuse(products, {
    keys: ['name', 'category', 'compat', 'description'],
    threshold: 0.35,
  }), [products]);

  const shopFuse = useMemo(() => new Fuse(users.filter(u => u.role === 'shopkeeper'), {
    keys: ['name', 'shopDetails.name', 'shopDetails.address'],
    threshold: 0.35,
  }), [users]);

  const { coords } = useAuth();

  const searchResults = useMemo(() => {
    const isMainShopVerified = users.find(u => u.email === 'shop@purzasetu.com')?.status === 'Verified';
    let filteredProducts = products;

    if (!isMainShopVerified) {
      filteredProducts = filteredProducts.filter(item => item.id !== 2);
    }

    if (inventoryFilter !== 'All') {
      if (inventoryFilter === 'New') {
        filteredProducts = filteredProducts.filter(item => item.type?.toLowerCase() === 'new');
      } else if (inventoryFilter === 'Old') {
        filteredProducts = filteredProducts.filter(item => item.type?.toLowerCase() === 'used' || item.type?.toLowerCase() === 'old');
      } else if (inventoryFilter === 'Parts') {
        filteredProducts = filteredProducts.filter(item => item.category === 'Spare Parts');
      }
    }

    if (selectedCategory !== 'All') {
      filteredProducts = filteredProducts.filter(item => item.category === selectedCategory);
    }

    let matchingProducts = filteredProducts;
    let matchingShops = [];

    if (query) {
      const pFuse = new Fuse(filteredProducts, {
        keys: ['name', 'category', 'compat', 'description'],
        threshold: 0.35,
      });
      matchingProducts = pFuse.search(query).map(res => res.item);
      matchingShops = shopFuse.search(query).map(res => res.item);
    }

    return { products: matchingProducts, shops: matchingShops };
  }, [products, query, selectedCategory, inventoryFilter, users, shopFuse]);

  const filteredProducts = searchResults.products;
  const filteredShops = searchResults.shops;

  return (
    <div className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="mb-10 flex justify-between items-start">
        <div className="text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-2">
            {user?.name ? `Hello, ${user.name}` : 'PurzaSetu'}
          </h1>
          <p className="text-text-secondary text-sm font-medium opacity-60">Fine-quality parts for you</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowScannerModal(true)}
            className="glass w-10 h-10 rounded-full border border-border-primary/50 flex items-center justify-center text-text-primary hover:border-brand-primary/50 transition-all group shadow-lg"
            title="Scan Shop QR"
          >
            <QrCode size={18} className="group-hover:text-brand-primary transition-colors" />
          </button>

          <button
            onClick={() => setShowLocationModal(true)}
            className="glass px-4 py-2 rounded-full border border-border-primary/50 flex items-center gap-2 text-xs font-bold text-text-primary hover:border-brand-primary/50 transition-all group shadow-lg"
          >
            <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
              <MapPin size={12} />
            </div>
            <span className="max-w-[100px] truncate">{location.area || 'All India'}</span>
            <ChevronDown size={12} className="text-text-secondary" />
          </button>
        </div>
      </div>

      <ScannerModal isOpen={showScannerModal} onClose={() => setShowScannerModal(false)} />

      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelect={(loc) => {
          setLocation(loc);
          localStorage.setItem('purzasetu-location', JSON.stringify(loc));
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
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 mb-10">
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

            {/* Matching Shops Segment */}
            {query && filteredShops.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                    <Zap size={16} />
                  </span>
                  <h3 className="text-sm font-black uppercase text-text-primary tracking-widest italic">Matching <span className="text-brand-primary">Shops</span></h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredShops.map((shop) => (
                    <motion.div
                      key={shop.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      onClick={() => navigate(`/shop/profile/${shop.id}`)}
                      className="glass-card p-6 flex items-center justify-between cursor-pointer group glow-effect"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-primary border border-white/10 group-hover:bg-brand-primary/20 transition-all">
                          <Zap size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-black text-base text-text-primary uppercase italic tracking-tight">{shop.name}</h4>
                            <span className="px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary text-[8px] font-black rounded uppercase tracking-tighter">SHOP</span>
                          </div>
                          <div className="flex items-center gap-3 opacity-60">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-text-secondary">
                              <MapPin size={10} /> {shop.city || 'Near You'}
                            </div>
                            <div className="text-[10px] font-black text-brand-primary uppercase">
                              {formatDistance(calculateDistance(coords?.lat, coords?.lng, shop.lat, shop.lng))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-text-secondary group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  ))}
                </div>
                <div className="h-px bg-border-primary/20 w-full mt-10" />
              </div>
            )}

            {/* Products Grid */}
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-8 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                <Package size={16} />
              </span>
              <h3 className="text-sm font-black uppercase text-text-primary tracking-widest italic">Matching <span className="text-brand-primary">Spares</span></h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((item) => {
                const shopId = item.id === 1 ? 2 : item.id === 2 ? 2 : 4; // Mock logic for owner
                const shop = users.find(u => u.id === shopId);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/customer/product/${item.id}`)}
                    className="glass-card p-4 transition-all group cursor-pointer relative flex flex-col glow-effect"
                  >
                    <div className="aspect-[4/3] bg-bg-primary/50 rounded-2xl mb-4 overflow-hidden border border-border-primary/10 relative flex items-center justify-center">
                      {item.image || (item.images && item.images[0]) ? (
                        <img
                          src={item.image || item.images[0]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt={item.name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="text-text-secondary opacity-20"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg></div>';
                          }}
                        />
                      ) : (
                        <div className="text-text-secondary opacity-20">
                          <Package size={48} strokeWidth={1} />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-black text-brand-primary uppercase tracking-widest border border-white/10">
                        {formatDistance(calculateDistance(coords?.lat, coords?.lng, shop?.lat || item.lat, shop?.lng || item.lng))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${item.type === 'New' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-primary/10 text-brand-primary'}`}>
                          {item.type}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-text-secondary">
                          <MapPin size={10} className="text-brand-primary" /> {shop?.city || 'Near'}
                        </div>
                      </div>
                      <h3 className="font-bold text-text-primary text-base mb-1 line-clamp-1 group-hover:text-brand-primary transition-colors">{item.name}</h3>
                      <p className="text-xs text-text-secondary line-clamp-2 mb-4 opacity-70 font-bold">{item.description}</p>
                    </div>
                    <div className="flex justify-between items-end pt-3 border-t border-border-primary/20">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 mb-1 opacity-40">
                          <Eye size={10} className="text-text-secondary" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">
                            {formatCount(item.viewCount || 0)} views
                          </span>
                        </div>
                        <span className="text-lg font-bold text-text-primary">₹{item.price.toLocaleString()}</span>
                      </div>
                      <ChevronRight size={18} className="text-brand-primary group-hover:translate-x-1 transition-transform mb-1" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && filteredShops.length === 0 && (
              <div className="text-center py-20 bg-bg-primary/30 rounded-[32px] border border-dashed border-border-primary flex flex-col items-center">
                <Search size={40} className="mb-4 text-text-secondary opacity-20" />
                <h4 className="font-black text-lg text-text-primary uppercase italic mb-2">No Decryptions Found</h4>
                <p className="text-text-secondary text-sm font-bold opacity-60 mb-8">We couldn't find any results for "{query}"</p>
                <button
                  onClick={() => setQuery('')}
                  className="px-8 py-3 bg-brand-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-brand-primary/20 glow-effect"
                >
                  Clear Search
                </button>
              </div>
            )}
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

export default CustomerHome;
