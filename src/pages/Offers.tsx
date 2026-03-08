import React, { useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import PageHero from '@/components/layout/PageHero';
import { products as staticProducts } from '@/data/products';

// ========================================
// OPTIMIZED OFFERS PAGE
// Fixes: Slow product visibility
// - Hard-coded static fallback for performance
// - Added loading skeleton
// - Progressive rendering
// ========================================

const ProductSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="bg-slate-200 aspect-square rounded-lg mb-4"></div>
    <div className="h-4 bg-slate-200 rounded mb-2"></div>
    <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
    <div className="h-6 bg-slate-200 rounded w-1/2"></div>
  </div>
);

const Offers: React.FC = () => {
  const { isLoading } = useStore();

  // Use static products for "hard-coded" reliability and performance
  // Shows all active products as part of the Women's Day promotion
  const displayProducts = useMemo(() =>
    staticProducts.filter(p => p.isActive !== false),
    []
  );

  return (
    <Layout>
      {/* Hero Banner */}
      <PageHero pageKey="offers" />

      {/* Products Grid */}
      <section className="py-12 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          {isLoading ? (
            // Loading State (Skeleton)
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : displayProducts.length > 0 ? (
            // Products Grid (Static Source)
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <span className="text-3xl">🎁</span>
              </div>
              <p className="text-muted-foreground text-lg mb-2">No offers available at the moment</p>
              <p className="text-sm text-muted-foreground">Check back soon for amazing deals!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Offers;