import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Package, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import FavoriteHeart from '../components/FavoriteHeart';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, loading, toggleFavorite, isFavorite } = useFavorites();
  const { products } = useAuth();

  // Filter products to show only favorited ones
  const favoriteProducts = products.filter(product => isFavorite(product.id));

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary font-bold">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center">
            <Heart size={24} className="text-red-500 fill-red-500" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
              My Favorites
            </h1>
            <p className="text-sm text-text-secondary opacity-60 mt-1">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'part' : 'parts'} saved
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {favoriteProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 bg-bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={48} className="text-text-secondary opacity-20" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            No favorite parts yet
          </h3>
          <p className="text-text-secondary opacity-60 mb-8">
            Start exploring and save parts you love!
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/customer/home')}
            className="px-8 py-3 bg-brand-primary text-white rounded-3xl font-bold text-sm shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all glow-effect"
          >
            Explore Parts
          </motion.button>
        </motion.div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/customer/product/${item.id}`)}
              className="glass-card rounded-3xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all relative"
            >
              {/* Favorite Heart */}
              <FavoriteHeart
                productId={item.id}
                isFavorited={isFavorite(item.id)}
                onToggle={toggleFavorite}
              />

              {/* Product Image */}
              <div className="relative h-48 overflow-hidden bg-bg-secondary/30">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.type && (
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.type.toLowerCase() === 'new'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                      {item.type}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-1 group-hover:text-brand-primary transition-colors">
                  {item.name}
                </h3>

                {item.compat && (
                  <p className="text-xs text-text-secondary opacity-60 mb-3 line-clamp-1">
                    {item.compat}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-brand-primary">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-brand-primary group-hover:translate-x-1 transition-transform"
                  />
                </div>

                {item.category && (
                  <div className="mt-3 pt-3 border-t border-border-primary/20">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider opacity-50">
                      {item.category}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
