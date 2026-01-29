import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites on mount and when user changes
  useEffect(() => {
    if (user && user.id) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user || !user.id) return;

    try {
      const response = await fetch(`http://localhost:5001/api/favorites/${user.id}`);
      const data = await response.json();

      if (data.success) {
        setFavorites(data.favorites);
      }
    } catch (error) {
      // Silent fail - favorites will be empty
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (productId) => {
    if (!user || !user.id) {
      toast.error('Please login to add favorites');
      return;
    }

    // Optimistic UI update
    const isFavorited = favorites.includes(productId);

    if (isFavorited) {
      // Remove from local state immediately
      setFavorites(prev => prev.filter(id => id !== productId));
    } else {
      // Add to local state immediately
      setFavorites(prev => [...prev, productId]);
    }

    try {
      const response = await fetch('http://localhost:5001/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          productId: productId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        if (data.action === 'added') {
          toast.success('Added to favorites! ❤️', {
            duration: 2000,
            icon: '❤️'
          });
        } else {
          toast.success('Removed from favorites', {
            duration: 2000,
            icon: '💔'
          });
        }
      } else {
        // Revert optimistic update on error
        if (isFavorited) {
          setFavorites(prev => [...prev, productId]);
        } else {
          setFavorites(prev => prev.filter(id => id !== productId));
        }
        toast.error(data.message || 'Failed to update favorites');
      }
    } catch (error) {
      // Revert optimistic update on error
      if (isFavorited) {
        setFavorites(prev => [...prev, productId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== productId));
      }

      toast.error('Failed to update favorites');
    }
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  const value = {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    refreshFavorites: fetchFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
