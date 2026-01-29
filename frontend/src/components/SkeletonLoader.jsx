import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'product', count = 4 }) => {
  const ProductSkeleton = () => (
    <div className="glass-card p-6 animate-pulse">
      <div className="aspect-[4/3] bg-bg-primary/50 rounded-2xl mb-4" />
      <div className="h-4 bg-bg-primary/50 rounded-full w-3/4 mb-2" />
      <div className="h-3 bg-bg-primary/50 rounded-full w-1/2" />
    </div>
  );

  const ShopSkeleton = () => (
    <div className="glass-card p-6 animate-pulse flex items-center gap-4">
      <div className="w-14 h-14 bg-bg-primary/50 rounded-2xl flex-shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-bg-primary/50 rounded-full w-3/4 mb-2" />
        <div className="h-3 bg-bg-primary/50 rounded-full w-1/2" />
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="glass p-4 rounded-2xl animate-pulse">
          <div className="h-3 bg-bg-primary/50 rounded-full w-full mb-2" />
          <div className="h-3 bg-bg-primary/50 rounded-full w-2/3" />
        </div>
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(count)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        );
      case 'shop':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(count)].map((_, i) => (
              <ShopSkeleton key={i} />
            ))}
          </div>
        );
      case 'list':
        return <ListSkeleton />;
      default:
        return <ProductSkeleton />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {renderSkeleton()}
    </motion.div>
  );
};

export default SkeletonLoader;
