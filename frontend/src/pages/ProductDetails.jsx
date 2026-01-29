import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  MessageSquare,
  Send,
  Star,
  Check,
  ChevronRight,
  Store,
  ExternalLink,
  ShieldCheck,
  Package,
  Clock,
  ChevronLeft,
  X,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import GuestRestrictionModal from '../components/GuestRestrictionModal';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, user, isGuest, addRequest, isShopkeeper, reportProduct, trackProductView } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);

  // Track product view
  useEffect(() => {
    if (id) {
      trackProductView(Number(id));
    }
  }, [id, trackProductView]);

  // Find product from global state
  const product = products.find(p => p.id === Number(id)) || products[0];

  const handleRaiseRequest = () => {
    if (isShopkeeper) {
      toast.error("Shopkeepers cannot raise requests!");
      return;
    }

    if (isGuest) {
      setShowGuestModal(true);
      return;
    }

    setIsRequesting(true);
    setTimeout(() => {
      try {
        addRequest({
          id: Date.now(),
          customerName: user?.name || 'Guest User',
          productName: product.name,
          time: 'Just now',
          status: 'pending',
          productId: product.id,
          amount: product.price
        });
        toast.success("Request sent");
        setIsRequesting(false);
      } catch (err) {
        toast.error("Failed to send request");
        setIsRequesting(false);
      }
    }, 1000);
  };

  const nextImage = () => setActiveImage((prev) => (prev + 1) % (product.images?.length || 1));
  const prevImage = () => setActiveImage((prev) => (prev - 1 + (product.images?.length || 1)) % (product.images?.length || 1));

  const displayImage = product.images ? product.images[activeImage] : product.image;

  return (
    <div className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(-1)}
          className="p-2 text-text-secondary hover:text-brand-primary transition-all flex items-center gap-2 text-sm font-semibold glow-effect"
        >
          <ArrowLeft size={18} /> Back
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="relative aspect-square bg-bg-secondary rounded-3xl overflow-hidden border border-border-primary/50 shadow-xl group">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={displayImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x600?text=Product+Image+Not+Found';
                }}
              />
            </AnimatePresence>

            {product.images && product.images.length > 1 && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-brand-primary transition-all"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-brand-primary transition-all"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            )}

            <div className="absolute bottom-6 left-6">
              <div className="glass px-6 py-3 rounded-2xl text-text-primary shadow-xl border border-white/20">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-50 mb-0.5">Price</span>
                <span className="text-2xl font-bold">₹{product.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {(product.images || [product.image]).map((img, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-brand-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.condition === 'New' || product.type === 'New' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                {product.condition || product.type}
              </span>
              <span className="bg-bg-secondary text-text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {product.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-text-primary tracking-tight mb-4">
              {product.name}
            </h1>
            <p className="text-text-secondary text-base font-medium leading-relaxed opacity-70">
              {product.description || `Quality ${product.name} for your vehicle.`}
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 space-y-6 glow-effect">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-bg-primary/50 rounded-2xl flex items-center justify-center text-brand-primary border border-border-primary/50">
                <Store size={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-0.5">Dealer</p>
                <h3 className="text-xl font-bold text-text-primary">AutoParts Shop</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex text-amber-500">
                    <Star size={12} fill="currentColor" />
                  </div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase">4.8 Rating</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-brand-primary opacity-50" size={18} />
              <p className="text-sm font-semibold text-text-primary">New Delhi, India</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/shop/profile/shop1`)}
                className="w-full py-3.5 glass text-text-primary rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-bg-primary transition-all glow-effect"
              >
                View Dealer
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const reason = window.prompt("Reason for report:");
                  if (reason) {
                    reportProduct(product.id, reason);
                    toast.success("Report submitted");
                  }
                }}
                className="w-full py-3.5 bg-red-500/5 text-red-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 glow-effect"
              >
                <ShieldAlert size={14} /> Report
              </motion.button>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/chat/conv1')}
              className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 glow-effect"
            >
              Message <MessageSquare size={18} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleRaiseRequest}
              disabled={isRequesting}
              className="flex-1 py-4 bg-bg-primary text-text-primary border border-border-primary rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-bg-secondary transition-all glow-effect disabled:opacity-50"
            >
              {isRequesting ? 'Sending...' : 'Request'} <Send size={18} />
            </motion.button>
          </div>
        </div>
      </div>
      <GuestRestrictionModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} />
    </div>
  );
};

export default ProductDetails;
