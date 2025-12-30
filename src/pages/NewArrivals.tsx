import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import PageHero from '@/components/layout/PageHero';

const NewArrivals: React.FC = () => {
  const { products } = useStore();
  const newProducts = products.filter(p => p.isNewArrival && p.isActive).reverse();

  return (
    <Layout>
      {/* Hero Banner */}
      <PageHero pageKey="newArrivals">
        <span className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold mb-6 shadow-sm border border-white/30">
          Fresh Additions
        </span>
      </PageHero>

      {/* Products Grid */}
      <section className="py-12 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          {newProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} showBadge={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">New products coming soon. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default NewArrivals;
