import React from 'react';
import Layout from '@/components/layout/Layout';
import ComboCard from '@/components/ComboCard';
import { combos } from '@/data/products';

const Combos: React.FC = () => {
  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary/20 to-primary/10 py-16">
        <div className="container">
          <div className="text-center">
            <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold mb-4">
              Value Packs
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-blue mb-4">
              Combo Offers
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get more value with our carefully curated combo packs. Save more when you buy together!
            </p>
          </div>
        </div>
      </section>

      {/* Combos Grid */}
      <section className="py-12 bg-background">
        <div className="container">
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
        </div>
      </section>
    </Layout>
  );
};

export default Combos;
