import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Verified
} from 'lucide-react';

const ShopProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock Shop Data (In a real app, fetch by ID)
  const shop = {
    id: id || 'shop1',
    name: 'AutoParts Syndicate',
    dealer: 'Rahul Sharma',
    address: 'Shop 42, Mayapuri Phase II, New Delhi, 110064',
    rating: 4.8,
    reviews: 124,
    verified: true,
    location: { lat: 28.625, lng: 77.125 },
    stats: {
      activeListings: 42,
      joinedDate: 'Mar 2023',
      sales: '1.2L+'
    }
  };

  // Mock Products for this shop
  const shopProducts = [
    { id: 1, name: 'Toyota Innova Headlight', category: 'Spare Parts', type: 'New', price: 4500, compat: 'Innova 2018+' },
    { id: 2, name: 'Honda City Front Bumper', category: 'Spare Parts', type: 'Used', price: 2800, compat: 'City 2014-2016' },
    { id: 4, name: 'Tesla Model 3 Air Filter', category: 'Spare Parts', type: 'New', price: 1200, compat: 'Model 3/Y' },
  ];

  return (
    <div className="pt-28 pb-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
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
            {shop.verified && (
              <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white p-2 rounded-2xl shadow-xl border-4 border-bg-secondary">
                <Verified size={20} />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-6xl font-black text-text-primary italic tracking-tighter uppercase">{shop.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full border border-emerald-500/20">
                <Star size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-widest">{shop.rating} ({shop.reviews} Reviews)</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center md:justify-start gap-3 text-text-secondary flex-wrap">
                <span className="flex items-center gap-2 font-bold text-sm bg-bg-primary px-4 py-2 rounded-2xl border border-border-primary"><MapPin size={16} className="text-brand-primary" /> {shop.address}</span>
                <span className="flex items-center gap-2 font-bold text-sm bg-bg-primary px-4 py-2 rounded-2xl border border-border-primary"><Navigation size={16} className="text-brand-primary" /> Live Location Active</span>
              </div>
              <p className="text-text-secondary font-black uppercase text-[10px] tracking-widest italic opacity-50">Authorized Dealer: <span className="text-text-primary opacity-100">{shop.dealer}</span> • Est. {shop.stats.joinedDate}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/chat/conv1')} className="flex-1 md:flex-none px-12 py-5 bg-brand-primary text-white rounded-[2rem] font-black italic text-xl shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3 hover:scale-[1.05] active:scale-95 transition-all">
                MESSAGE SHOP <MessageSquare size={24} />
              </button>
              <button className="flex-1 md:flex-none px-12 py-5 bg-bg-primary text-text-primary border border-border-primary rounded-[2rem] font-black italic text-xl flex items-center justify-center gap-3 hover:bg-bg-secondary transition-all">
                GET DIRECTIONS <Navigation size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Shop Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-border-primary border-dashed">
          <StatItem label="Active Inventory" value={shop.stats.activeListings} />
          <StatItem label="Total Volume" value={shop.stats.sales} />
          <StatItem label="Response Rate" value="98%" />
        </div>
      </div>

      {/* Product Grid Header */}
      <div className="flex items-center gap-4 mb-10 px-2 justify-center md:justify-start">
        <Globe size={32} className="text-brand-primary" strokeWidth={3} />
        <h2 className="text-4xl font-black text-text-primary tracking-tighter uppercase italic">Inventory <span className="text-brand-primary italic">Stockpile</span></h2>
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
            <div className="aspect-square bg-bg-primary rounded-[2rem] mb-6 flex items-center justify-center text-text-secondary group-hover:bg-brand-primary/5 transition-colors relative">
              <Package size={80} strokeWidth={1} className="text-text-secondary opacity-10 group-hover:scale-110 group-hover:text-brand-primary/20 transition-all duration-700" />
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

            <div className="flex justify-between items-center pt-4 border-t border-border-primary border-dashed mt-auto">
              <span className="text-3xl font-black text-text-primary italic">₹{item.price.toLocaleString()}</span>
              <button className="p-4 bg-brand-primary/10 text-brand-primary rounded-2xl hover:bg-brand-primary hover:text-white transition-all">
                <Plus size={20} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        ))}
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

export default ShopProfile;
