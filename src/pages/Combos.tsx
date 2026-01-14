import React from 'react';
import Layout from '@/components/layout/Layout';
import ComboCard from '@/components/ComboCard';
import { useStore } from '@/context/StoreContext';
import PageHero from '@/components/layout/PageHero';

// ========================================
// OPTIMIZED COMBOS PAGE
// Fixes: Slow combo visibility
// - Added loading skeleton
// - Progressive rendering
// - Better empty state
// ========================================

const ComboSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="bg-slate-200 aspect-[4/3] rounded-lg mb-4"></div>
    <div className="h-6 bg-slate-200 rounded mb-2"></div>
    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
    <div className="h-8 bg-slate-200 rounded w-1/2"></div>
  </div>
);

const Combos: React.FC = () => {
  const { combos, isLoading } = useStore();

  return (
    <Layout>
      {/* Hero Banner */}
      <PageHero pageKey="combos" className="py-24 md:py-48" />

      {/* Combos Grid */}
      <section className="py-12 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          {isLoading ? (
            // Loading State
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <ComboSkeleton key={i} />
              ))}
            </div>
          ) : combos.length > 0 ? (
            // Combos Grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {combos.map((combo, index) => (
                <div
                  key={combo.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ComboCard combo={combo} />
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <span className="text-3xl">📦</span>
              </div>
              <p className="text-muted-foreground text-lg mb-2">No combo packs available</p>
              <p className="text-sm text-muted-foreground">Check back soon for special value packs!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Combos;