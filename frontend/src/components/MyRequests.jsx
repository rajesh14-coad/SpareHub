import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, DollarSign, MapPin, Eye, X, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import StatusPill from './StatusPill';

const MyRequests = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showOffersModal, setShowOffersModal] = useState(false);

  useEffect(() => {
    fetchMyRequests();
  }, [user]);

  const fetchMyRequests = async () => {
    try {
      const url = `http://localhost:5001/api/requests/customer/${user?._id || user?.id}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load your requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500';
      case 'Offers Received':
        return 'bg-blue-500';
      case 'Closed':
        return 'bg-green-500';
      case 'Expired':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock size={16} />;
      case 'Offers Received':
        return <Eye size={16} />;
      case 'Closed':
        return <CheckCircle size={16} />;
      case 'Expired':
        return <AlertCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diff = now - created;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const handleCloseRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Closed' })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Request closed successfully');
        fetchMyRequests();
      }
    } catch (error) {
      console.error('Error closing request:', error);
      toast.error('Failed to close request');
    }
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
          <h2 className="text-2xl font-bold text-text-primary">My Requests</h2>
          <p className="text-sm text-text-secondary opacity-60">Track your part requests</p>
        </div>
        <div className="px-4 py-2 bg-brand-primary/10 rounded-full">
          <span className="text-sm font-bold text-brand-primary">{requests.length} Total</span>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl">
          <Package size={48} className="mx-auto mb-4 text-text-secondary opacity-20" />
          <h3 className="text-lg font-bold text-text-primary mb-2">No requests yet</h3>
          <p className="text-sm text-text-secondary opacity-60">Click the Request button to create your first request</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const timeLeft = getTimeRemaining(request.expiresAt);
            const isExpired = request.status === 'Expired' || timeLeft === 'Expired';
            const hasOffers = request.offers && request.offers.length > 0;

            return (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-6 relative overflow-hidden group glow-effect cursor-pointer"
              >
                {/* Status Bar */}
                <div className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(request.status)}`} />

                <div className="pl-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-1">{request.partName}</h3>
                      <p className="text-sm text-text-secondary opacity-70">{request.vehicleModel}</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${isExpired ? 'bg-red-500/10 text-red-500' :
                      request.status === 'Closed' ? 'bg-green-500/10 text-green-500' :
                        hasOffers ? 'bg-blue-500/10 text-blue-500' :
                          'bg-amber-500/10 text-amber-500'
                      }`}>
                      {getStatusIcon(request.status)}
                      {request.status}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Package size={14} className="text-brand-primary" />
                      <span className="text-text-secondary">
                        <span className="font-bold text-text-primary">{request.condition}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-brand-primary" />
                      <span className="text-text-secondary truncate">
                        {request.location.district}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={14} className="text-brand-primary" />
                      <span className="text-text-secondary">
                        ₹{request.budgetMin.toLocaleString()} - ₹{request.budgetMax.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} className={isExpired ? 'text-red-500' : 'text-brand-primary'} />
                      <span className={isExpired ? 'text-red-500 font-bold' : 'text-text-secondary'}>
                        {isExpired ? 'Expired' : `${timeLeft} left`}
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

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border-primary/20">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-text-secondary opacity-60">
                        {getTimeAgo(request.createdAt)}
                      </span>
                      {hasOffers && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 rounded-full">
                          <Eye size={12} className="text-blue-500" />
                          <span className="text-xs font-bold text-blue-500">
                            {request.offers.length} {request.offers.length === 1 ? 'Offer' : 'Offers'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {hasOffers && request.status !== 'Closed' && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(request);
                            setShowOffersModal(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                        >
                          View Offers
                        </motion.button>
                      )}
                      {request.status !== 'Closed' && !isExpired && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseRequest(request._id);
                          }}
                          className="px-4 py-2 bg-green-500/10 text-green-500 font-bold text-xs rounded-xl border border-green-500/30 hover:bg-green-500/20 transition-all"
                        >
                          Mark as Found
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Offers Modal */}
      <AnimatePresence>
        {showOffersModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOffersModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-text-primary">Offers Received</h3>
                  <p className="text-sm text-text-secondary opacity-60">{selectedRequest.partName}</p>
                </div>
                <button
                  onClick={() => setShowOffersModal(false)}
                  className="w-8 h-8 rounded-full glass border border-border-primary/50 flex items-center justify-center hover:border-red-500/50 transition-all group"
                >
                  <X size={16} className="text-text-secondary group-hover:text-red-500 transition-colors" />
                </button>
              </div>

              {/* Offers List */}
              <div className="space-y-4">
                {selectedRequest.offers.map((offer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-2xl glass border border-border-primary/20 hover:border-brand-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-text-primary">{offer.shopName}</h4>
                        <p className="text-xs text-text-secondary opacity-60">{offer.shopkeeperName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-brand-primary">₹{offer.price.toLocaleString()}</p>
                        <p className="text-xs text-text-secondary opacity-60">
                          {getTimeAgo(offer.respondedAt)}
                        </p>
                      </div>
                    </div>

                    {offer.photo && (
                      <img
                        src={offer.photo}
                        alt="Part"
                        className="w-full h-40 object-cover rounded-xl mb-3"
                      />
                    )}

                    {offer.message && (
                      <p className="text-sm text-text-secondary opacity-70 mb-3">
                        {offer.message}
                      </p>
                    )}

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2.5 bg-brand-primary text-white font-bold text-xs rounded-xl shadow-md shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={14} />
                      Contact Shopkeeper
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyRequests;
