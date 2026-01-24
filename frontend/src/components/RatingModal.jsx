import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const RatingModal = ({ isOpen, onClose, order, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    onSubmit(order.id, rating, review);
    toast.success('Rating submitted!');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[150] p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md glass-card relative p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-bg-primary rounded-lg text-text-secondary transition-all"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-2">Rate Your Experience</h2>
              <p className="text-sm font-medium text-text-secondary opacity-70">
                How was your experience with {order?.shopName}?
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="p-2 transition-all"
                >
                  <Star
                    size={40}
                    className={`transition-all ${star <= (hoveredRating || rating)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-text-secondary opacity-30'
                      }`}
                  />
                </motion.button>
              ))}
            </div>

            {/* Rating Text */}
            {rating > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <p className="text-lg font-bold text-brand-primary">
                  {rating === 5 && '🌟 Excellent!'}
                  {rating === 4 && '😊 Great!'}
                  {rating === 3 && '👍 Good'}
                  {rating === 2 && '😐 Fair'}
                  {rating === 1 && '😞 Poor'}
                </p>
              </motion.div>
            )}

            {/* Review Text Area */}
            <div className="mb-6">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 block opacity-60">
                Your Review (Optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience..."
                className="w-full bg-bg-primary/50 border border-border-primary p-4 rounded-xl outline-none focus:border-brand-primary/30 text-sm font-medium resize-none glow-effect"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={rating === 0}
              className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 glow-effect disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} /> Submit Rating
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;
