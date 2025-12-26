
import React from 'react';
import Layout from '@/components/layout/Layout';
import ComboCard from '@/components/ComboCard';
import { combos } from '@/data/products';
import PageHero from '@/components/layout/PageHero';


const Combos: React.FC = () => {
  return (
    <Layout>
      {/* Hero Banner */}
      {/* Hero Banner */}
      <PageHero pageKey="combos">
        <span className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold mb-6 shadow-sm border border-white/30">
          Value Packs
        </span>
      </PageHero>

      {/* Combos Grid */}
      <section className="py-12 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {combos.map((combo, index) => (
              <div
                key={combo.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1} s` }}
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
