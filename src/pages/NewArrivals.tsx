import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ProductCard';
import { getNewArrivals } from '@/data/products';

const NewArrivals: React.FC = () => {
  const newProducts = getNewArrivals();

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-brand-blue/10 to-brand-blue/5 py-16">
        <div className="container">
          <div className="text-center">
            <span className="inline-block bg-brand-blue text-brand-cream px-4 py-1 rounded-full text-sm font-bold mb-4">
              Fresh Additions
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-blue mb-4">
              New Arrivals
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover our latest additions to the MANSARA family. Fresh, innovative, and always pure.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-background">
        <div className="container">
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
