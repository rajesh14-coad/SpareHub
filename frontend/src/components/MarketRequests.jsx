import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, MapPin, Clock, DollarSign, Image as ImageIcon, Send, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistance } from '../utils/location';

const MarketRequests = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerData, setOfferData] = useState({
    price: '',
    photo: '',
    message: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMarketRequests();
  }, [user]);

  const fetchMarketRequests = async () => {
    try {
      const url = `http://localhost:5001/api/requests/market/${user?._id || user?.id}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching market requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'purzasetu_offers');
      formData.append('cloud_name', 'YOUR_CLOUD_NAME');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setOfferData(prev => ({ ...prev, photo: data.secure_url }));
        toast.success('Photo uploaded!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();

    if (!offerData.price) {
      toast.error('Please enter a price');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/requests/${selectedRequest._id}/offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shopkeeperId: user.id,
          shopkeeperName: user.name,
          shopName: user.shopDetails?.name || user.name,
          price: parseInt(offerData.price),
          photo: offerData.photo,
          message: offerData.message
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('✅ Offer submitted successfully!');
        setShowOfferModal(false);
        setOfferData({ price: '', photo: '', message: '' });
        fetchMarketRequests(); // Refresh the list
      } else {
        toast.error(result.message || 'Failed to submit offer');
      }
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast.error('Failed to submit offer');
    }
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Market Requests</h2>
          <p className="text-sm text-text-secondary opacity-60">Requests from customers in your area</p>
        </div>
        <div className="px-4 py-2 bg-brand-primary/10 rounded-full">
          <span className="text-sm font-bold text-brand-primary">{requests.length} Active</span>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl">
          <Package size={48} className="mx-auto mb-4 text-text-secondary opacity-20" />
          <h3 className="text-lg font-bold text-text-primary mb-2">No requests yet</h3>
          <p className="text-sm text-text-secondary opacity-60">New requests will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests.map((request) => {
            const hasOffered = request.offers?.some(offer => offer.shopkeeperId === user.id);
            const timeLeft = getTimeRemaining(request.expiresAt);
            const isExpired = timeLeft === 'Expired';

            return (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 relative overflow-hidden group glow-effect"
              >
                {/* Status Indicator */}
                <div className={`absolute top-0 left-0 w-1 h-full ${isExpired ? 'bg-red-500' : hasOffered ? 'bg-green-500' : 'bg-brand-primary'}`} />

                <div className="pl-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-1">{request.partName}</h3>
                      <p className="text-sm text-text-secondary opacity-70">{request.vehicleModel}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${isExpired ? 'bg-red-500/10 text-red-500' :
                      hasOffered ? 'bg-green-500/10 text-green-500' :
                        'bg-brand-primary/10 text-brand-primary'
                      }`}>
                      {isExpired ? 'Expired' : hasOffered ? 'Offered' : 'New'}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Package size={14} className="text-brand-primary" />
                      <span className="text-text-secondary">
                        <span className="font-bold text-text-primary">{request.condition}</span> • {request.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-brand-primary" />
                      <span className="text-text-secondary">
                        {request.location.area ? `${request.location.area}, ` : ''}{request.location.district}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={14} className="text-brand-primary" />
                      <span className="text-text-secondary">
                        Budget: <span className="font-bold text-text-primary">₹{request.budgetMin.toLocaleString()} - ₹{request.budgetMax.toLocaleString()}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} className={isExpired ? 'text-red-500' : 'text-brand-primary'} />
                      <span className={isExpired ? 'text-red-500 font-bold' : 'text-text-secondary'}>
                        {timeLeft}
                      </span>
                    </div>
                  </div>

                  {/* Reference Photo */}
                  {request.referencePhoto && (
                    <div className="mb-4">
                      <img
                        src={request.referencePhoto}
                        alt="Reference"
                        className="w-full h-32 object-cover rounded-2xl border border-border-primary/20"
                      />
                    </div>
                  )}

                  {/* Description */}
                  {request.description && (
                    <p className="text-xs text-text-secondary opacity-70 mb-4 line-clamp-2">
                      {request.description}
                    </p>
                  )}

                  {/* Action Button */}
                  {!isExpired && !hasOffered && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowOfferModal(true);
                      }}
                      className="w-full py-3 bg-brand-primary text-white font-bold text-sm rounded-2xl shadow-md shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all glow-effect"
                    >
                      I Have This Part
                    </motion.button>
                  )}

                  {hasOffered && (
                    <div className="flex items-center justify-center gap-2 py-3 bg-green-500/10 rounded-2xl">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-sm font-bold text-green-500">Offer Submitted</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Offer Modal */}
      <AnimatePresence>
        {showOfferModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOfferModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-lg w-full p-8 relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text-primary">Submit Your Offer</h3>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="w-8 h-8 rounded-full glass border border-border-primary/50 flex items-center justify-center hover:border-red-500/50 transition-all group"
                >
                  <X size={16} className="text-text-secondary group-hover:text-red-500 transition-colors" />
                </button>
              </div>

              {/* Request Summary */}
              <div className="p-4 rounded-2xl bg-bg-primary/30 border border-border-primary/20 mb-6">
                <p className="text-sm font-bold text-text-primary mb-1">{selectedRequest.partName}</p>
                <p className="text-xs text-text-secondary opacity-70">{selectedRequest.vehicleModel}</p>
              </div>

              {/* Offer Form */}
              <form onSubmit={handleSubmitOffer} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                    Your Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold">₹</span>
                    <input
                      type="number"
                      value={offerData.price}
                      onChange={(e) => setOfferData({ ...offerData, price: e.target.value })}
                      placeholder="Enter your price"
                      className="w-full pl-8 pr-4 py-3 rounded-3xl glass border border-border-primary/50 text-text-primary placeholder:text-text-secondary/40 focus:border-brand-primary/50 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                    Part Photo (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="offer-photo"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="offer-photo"
                    className={`w-full px-4 py-4 rounded-3xl glass border-2 border-dashed border-border-primary/50 flex items-center justify-center cursor-pointer hover:border-brand-primary/50 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {offerData.photo ? (
                      <img src={offerData.photo} alt="Preview" className="h-20 object-cover rounded-xl" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <ImageIcon size={20} className="text-brand-primary" />
                        <span className="text-sm font-bold text-text-primary">
                          {uploading ? 'Uploading...' : 'Upload Photo'}
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={offerData.message}
                    onChange={(e) => setOfferData({ ...offerData, message: e.target.value })}
                    placeholder="Any additional details..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-3xl glass border border-border-primary/50 text-text-primary placeholder:text-text-secondary/40 focus:border-brand-primary/50 focus:outline-none transition-all resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-brand-primary text-white font-bold text-sm uppercase tracking-widest rounded-3xl shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all glow-effect flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Submit Offer
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketRequests;
