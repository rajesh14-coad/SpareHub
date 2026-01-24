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
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import toast from 'react-hot-toast';
import GuestRestrictionModal from '../components/GuestRestrictionModal';

const CustomerHome = () => {
  const navigate = useNavigate();
  const { products, requests, user, isGuest, users } = useAuth();
  const { query, setQuery } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [view, setView] = useState('inventory'); // inventory or requests
  const [showGuestModal, setShowGuestModal] = useState(false);

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

    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    if (query) {
      const searchResults = fuse.search(query);
      result = searchResults.map(res => res.item);
    }

    return result;
  }, [products, query, selectedCategory, fuse, users]);

  return (
    <div className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="mb-10 text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-2">
          Explore
        </h1>
        <p className="text-text-secondary text-sm font-medium opacity-60">Fine-quality parts for you</p>
      </div>

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
            {/* Search Bar */}
            <div className="relative mb-8 group max-w-2xl glow-effect">
              <div className="relative glass-card px-4 py-2 flex items-center gap-3 transition-all">
                <Search size={18} className="text-text-secondary group-focus-within:text-brand-primary transition-colors" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search parts..."
                  className="flex-1 bg-transparent py-2 text-sm font-bold outline-none text-text-primary placeholder:text-text-secondary placeholder:opacity-40"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="p-2 hover:bg-bg-primary rounded-full text-text-secondary hover:text-text-primary transition-all underline text-xs font-bold">
                    Clear
                  </button>
                )}
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
                className="glass-card p-5 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden group glow-effect"
              >
                <div className={`absolute top-0 left-0 w-1.2 h-full ${req.status === 'accepted' ? 'bg-emerald-500' : req.status === 'declined' ? 'bg-red-500' : 'bg-brand-primary/40'}`} style={{ width: '4px' }} />
                <div className="flex-1 w-full pl-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${req.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      req.status === 'declined' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                      }`}>
                      {req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}
                    </span>
                    <span className="text-text-secondary text-[10px] font-bold flex items-center gap-1 opacity-60">
                      <Clock size={12} /> {req.time}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary tracking-tight">{req.productName}</h3>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-text-secondary opacity-50 mb-0.5 uppercase tracking-wider">Offer</p>
                    <span className="text-lg font-bold text-text-primary">₹{req.amount.toLocaleString()}</span>
                  </div>
                  {req.status === 'accepted' && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/chats')}
                      className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-xs shadow-md shadow-brand-primary/20 glow-effect"
                    >
                      Message
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
