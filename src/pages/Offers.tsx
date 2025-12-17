import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ProductCard';
import { getOfferProducts } from '@/data/products';

const Offers: React.FC = () => {
  const offerProducts = getOfferProducts();

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-accent/20 to-accent/10 py-16">
        <div className="container">
          <div className="text-center">
            <span className="inline-block bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold mb-4">
              Limited Time Offers
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-blue mb-4">
              Special Offers
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Grab these amazing deals on your favorite MANSARA products. Premium quality at special prices!
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-background">
        <div className="container">
          {offerProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offerProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-fade-in" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No offers available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Offers;
