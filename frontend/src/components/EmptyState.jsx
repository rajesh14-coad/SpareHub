import React from 'react';
import { motion } from 'framer-motion';
import { Package, Store, Heart, Search, MessageSquare, FileText } from 'lucide-react';

const EmptyState = ({
  type = 'products',
  title,
  description,
  actionLabel,
  onAction
}) => {
  const getIcon = () => {
    switch (type) {
      case 'products':
        return <Package size={48} />;
      case 'shops':
        return <Store size={48} />;
      case 'favorites':
        return <Heart size={48} />;
      case 'search':
        return <Search size={48} />;
      case 'messages':
        return <MessageSquare size={48} />;
      case 'requests':
        return <FileText size={48} />;
      default:
        return <Package size={48} />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case 'products':
        return {
          title: 'No Products Yet',
          description: 'Start adding products to your inventory to get discovered by customers.'
        };
      case 'shops':
        return {
          title: 'No Shops Found',
          description: 'We couldn\'t find any shops in your area. Try adjusting your search.'
        };
      case 'favorites':
        return {
          title: 'No Favorites Yet',
          description: 'Start adding products to your favorites to easily find them later.'
        };
      case 'search':
        return {
          title: 'No Results Found',
          description: 'Try different keywords or browse all available products.'
        };
      case 'messages':
        return {
          title: 'No Messages',
          description: 'Your inbox is empty. Start a conversation with a shop or customer.'
        };
      case 'requests':
        return {
          title: 'No Requests',
          description: 'You haven\'t received any part requests yet.'
        };
      default:
        return {
          title: 'Nothing Here',
          description: 'This section is currently empty.'
        };
    }
  };

  const content = {
    title: title || getDefaultContent().title,
    description: description || getDefaultContent().description
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mb-6 border border-border-primary">
        <div className="text-text-secondary opacity-20">
          {getIcon()}
        </div>
      </div>

      <h3 className="text-xl md:text-2xl font-black text-text-primary uppercase italic mb-3">
        {content.title}
      </h3>

      <p className="text-sm text-text-secondary opacity-70 max-w-md mb-8 leading-relaxed">
        {content.description}
      </p>

      {actionLabel && onAction && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 glow-effect"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
