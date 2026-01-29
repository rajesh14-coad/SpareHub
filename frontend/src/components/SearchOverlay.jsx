import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, ArrowRight, Car, Bike, Zap, Package, MapPin, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import Fuse from 'fuse.js';
import { calculateDistance, formatDistance } from '../utils/location';

const SearchOverlay = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { query, setQuery } = useSearch();
  const { products, users, coords } = useAuth();
  const [localQuery, setLocalQuery] = useState(query);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery]);

  const trending = [
    { name: 'Thar Front Grille', icon: <Car size={16} /> },
    { name: 'RE Brake Pads', icon: <Bike size={16} /> },
    { name: 'LED Headlights', icon: <Zap size={16} /> },
    { name: 'Alloy Wheels', icon: <Package size={16} /> },
  ];

  const recent = ['Innova Filters', 'Swift Mirror', 'Nexon Charger'];

  // Fuse search configuration
  const productFuse = useMemo(() => new Fuse(products, {
    keys: ['name', 'category', 'compat', 'description'],
    threshold: 0.35,
  }), [products]);

  const shopFuse = useMemo(() => new Fuse(users.filter(u => u.role === 'shopkeeper'), {
    keys: ['name', 'shopDetails.name', 'shopDetails.address'],
    threshold: 0.35,
  }), [users]);

  const searchResults = useMemo(() => {
    if (!debouncedQuery) return { shops: [], products: [] };

    const productRes = productFuse.search(debouncedQuery).map(r => r.item);
    const shopRes = shopFuse.search(debouncedQuery).map(r => r.item);

    return { shops: shopRes, products: productRes };
  }, [debouncedQuery, productFuse, shopFuse]);

  const handleSearch = (q) => {
    const finalQuery = q || localQuery;
    setQuery(finalQuery);
    onClose();
    navigate('/customer/home');
  };

  const handleShopClick = (shopId) => {
    onClose();
    navigate(`/shop/profile/${shopId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="fixed inset-0 bg-bg-primary z-[200] p-6 md:p-12 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 max-w-5xl mx-auto w-full">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-brand-primary search-icon-mobile" size={20} />
              <input
                autoFocus
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Find spares or shops..."
                className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-4 md:py-7 bg-bg-secondary rounded-2xl md:rounded-[3rem] border-2 border-brand-primary/20 focus:border-brand-primary outline-none text-base md:text-2xl font-black italic text-text-primary shadow-2xl transition-all search-input-mobile"
              />
            </div>
            <button
              onClick={onClose}
              className="p-3 md:p-6 bg-bg-secondary rounded-full text-text-secondary hover:text-red-500 transition-all border border-border-primary shadow-lg close-btn-mobile"
            >
              <X size={24} className="md:hidden" />
              <X size={32} className="hidden md:block" />
            </button>
          </div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 overflow-y-auto no-scrollbar max-w-5xl mx-auto w-full space-y-8 md:space-y-12 pb-20"
          >
            {debouncedQuery ? (
              <div className="space-y-8 md:space-y-12">
                {/* Shops Section - Horizontal Scroll on Mobile */}
                {searchResults.shops.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <Store size={18} className="text-brand-primary md:w-5 md:h-5" />
                      <h3 className="text-[10px] font-black uppercase text-text-secondary tracking-[0.3em]">Matching Shops</h3>
                    </div>

                    {/* Mobile: Horizontal Scroll */}
                    <div className="md:hidden overflow-x-auto no-scrollbar -mx-6 px-6">
                      <div className="flex gap-3 pb-2">
                        {searchResults.shops.map((shop) => (
                          <motion.div
                            key={shop.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleShopClick(shop.id)}
                            className="glass-card p-4 flex-shrink-0 w-[280px] cursor-pointer glow-effect"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary flex-shrink-0">
                                <Store size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-black text-sm text-text-primary uppercase italic leading-none truncate">{shop.name}</h4>
                                  <span className="px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary text-[7px] font-black rounded uppercase flex-shrink-0">SHOP</span>
                                </div>
                                <div className="flex items-center gap-2 text-[9px] font-bold text-text-secondary opacity-60">
                                  <MapPin size={8} />
                                  <span className="truncate">Near City</span>
                                  <span className="text-brand-primary flex-shrink-0">
                                    {formatDistance(calculateDistance(coords?.lat, coords?.lng, shop.lat, shop.lng))}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Desktop: Grid */}
                    <div className="hidden md:grid grid-cols-2 gap-4">
                      {searchResults.shops.map((shop) => (
                        <motion.div
                          key={shop.id}
                          whileHover={{ y: -4 }}
                          onClick={() => handleShopClick(shop.id)}
                          className="glass-card p-6 flex items-center justify-between cursor-pointer group glow-effect"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                              <Store size={28} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-black text-lg text-text-primary uppercase italic leading-none">{shop.name}</h4>
                                <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[8px] font-black rounded uppercase tracking-tighter">SHOP</span>
                              </div>
                              <div className="flex items-center gap-4 opacity-60">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-text-secondary">
                                  <MapPin size={10} /> Near City
                                </div>
                                <div className="text-[10px] font-black text-brand-primary uppercase">
                                  {formatDistance(calculateDistance(coords?.lat, coords?.lng, shop.lat, shop.lng))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <ArrowRight size={20} className="text-text-secondary group-hover:text-brand-primary group-hover:translate-x-2 transition-all" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Section - 2 Column Grid on Mobile */}
                {searchResults.products.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <Package size={18} className="text-brand-primary md:w-5 md:h-5" />
                      <h3 className="text-[10px] font-black uppercase text-text-secondary tracking-[0.3em]">Matching Products</h3>
                    </div>

                    {/* Mobile: 2-Column Compact Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
                      {searchResults.products.map((item) => (
                        <motion.div
                          key={item.id}
                          whileTap={{ scale: 0.98 }}
                          whileHover={{ y: -4 }}
                          onClick={() => handleSearch(item.name)}
                          className="glass-card p-3 md:p-6 cursor-pointer group glow-effect product-card-mobile"
                        >
                          {/* Mobile Layout */}
                          <div className="md:hidden">
                            <div className="relative mb-2">
                              <img src={item.image} className="w-full h-24 rounded-xl object-cover" alt={item.name} />
                              <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-emerald-500/90 text-white text-[7px] font-black rounded uppercase backdrop-blur-sm">PART</span>
                            </div>
                            <h4 className="font-bold text-xs text-text-primary line-clamp-1 mb-1">{item.name}</h4>
                            <div className="flex items-center justify-between text-[9px] font-bold">
                              <span className="text-brand-primary">₹{item.price.toLocaleString()}</span>
                              <span className="text-text-secondary opacity-60">{item.type}</span>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <img src={item.image} className="w-14 h-14 rounded-2xl object-cover" alt={item.name} />
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold text-base text-text-primary line-clamp-1">{item.name}</h4>
                                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded uppercase tracking-tighter">PRODUCT</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-bold text-text-secondary opacity-60">
                                  <span>₹{item.price.toLocaleString()}</span>
                                  <span className="w-1 h-1 bg-text-secondary rounded-full" />
                                  <span>{item.type}</span>
                                </div>
                              </div>
                            </div>
                            <ArrowRight size={20} className="text-text-secondary group-hover:text-brand-primary group-hover:translate-x-2 transition-all" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.shops.length === 0 && searchResults.products.length === 0 && (
                  <div className="text-center py-12 md:py-20 flex flex-col items-center gap-4 md:gap-6">
                    <div className="w-16 md:w-20 h-16 md:h-20 bg-bg-secondary rounded-full flex items-center justify-center border border-border-primary">
                      <Search size={32} className="md:w-10 md:h-10 text-text-secondary opacity-20" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-text-primary mb-2 italic">NO DECRYPTIONS FOUND</h4>
                      <p className="text-xs md:text-sm text-text-secondary font-medium opacity-60 max-w-xs mx-auto mb-6 md:mb-8">
                        We couldn't find any shops or spares matching "{debouncedQuery}".
                      </p>
                      <button
                        onClick={() => navigate('/customer/home')}
                        className="px-6 md:px-8 py-2.5 md:py-3 bg-brand-primary/10 text-brand-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all glow-effect"
                      >
                        VIEW ALL SHOPS
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Trending */}
                <div>
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <TrendingUp size={18} className="text-brand-primary md:w-5 md:h-5" />
                    <h3 className="text-[10px] font-black uppercase text-text-secondary tracking-[0.3em]">Trending Categories</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {trending.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(item.name)}
                        className="flex justify-between items-center p-4 md:p-6 bg-bg-secondary rounded-2xl md:rounded-3xl border border-border-primary hover:border-brand-primary/30 transition-all group glow-effect"
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="p-2 md:p-3 bg-brand-primary/10 rounded-xl md:rounded-2xl text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">{item.icon}</div>
                          <span className="font-black text-[10px] md:text-xs uppercase tracking-widest text-text-primary">{item.name}</span>
                        </div>
                        <ArrowRight size={14} className="md:w-4 md:h-4 text-text-secondary group-hover:text-brand-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                <div>
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <Clock size={18} className="text-brand-primary md:w-5 md:h-5" />
                    <h3 className="text-[10px] font-black uppercase text-text-secondary tracking-[0.3em]">Recent Decryption</h3>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    {recent.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(q)}
                        className="w-full flex items-center justify-between p-4 md:p-6 bg-bg-primary border border-border-primary rounded-2xl md:rounded-[2.5rem] hover:bg-bg-secondary transition-all group"
                      >
                        <span className="font-black text-xs md:text-sm italic text-text-primary group-hover:text-brand-primary transition-colors">{q}</span>
                        <div className="p-2 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={14} className="md:w-4 md:h-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Quick Actions */}
            <div className="pt-6 md:pt-8 border-t border-border-primary/50">
              <button
                onClick={() => handleSearch()}
                className="w-full py-4 md:py-7 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-2xl md:rounded-[2.5rem] font-black italic text-base md:text-xl shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-2 md:gap-3 glow-effect"
              >
                EXECUTE SEARCH <Zap size={20} className="md:w-6 md:h-6" strokeWidth={3} />
              </button>
            </div>
          </motion.div>

          {/* Mobile-specific CSS */}
          <style jsx>{`
            @media (max-width: 768px) {
              .search-icon-mobile {
                width: 20px;
                height: 20px;
              }
              
              .search-input-mobile::placeholder {
                font-size: 14px;
              }
              
              .close-btn-mobile {
                padding: 12px;
              }
              
              .product-card-mobile {
                min-height: 140px;
              }
              
              /* Prevent keyboard overlap */
              .fixed.inset-0 {
                padding-bottom: env(safe-area-inset-bottom, 20px);
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
