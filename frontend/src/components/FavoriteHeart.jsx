import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const FavoriteHeart = ({ productId, isFavorited, onToggle, className = '' }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(productId);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full glass border border-white/20 flex items-center justify-center group hover:border-red-500/50 transition-all ${className}`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isFavorited ? [1, 1.3, 1] : 1
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
      >
        <Heart
          size={18}
          className={`transition-all duration-200 ${isFavorited
              ? 'fill-red-500 text-red-500'
              : 'text-white/70 group-hover:text-red-400'
            }`}
        />
      </motion.div>
    </motion.button>
  );
};

export default FavoriteHeart;
