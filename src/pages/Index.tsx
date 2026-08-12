import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sparkles, Heart, Activity, ShieldCheck, Globe } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import TrustStrip from '@/components/TrustStrip';
import HeroSlider from '@/components/home/HeroSlider';
import SEO from '@/components/SEO';
import { useStore } from '@/context/StoreContext';
import { useContent } from '@/context/ContentContext';

// ========================================
// OPTIMIZED HOME PAGE  
// Fixes: Slow product visibility
// - Added loading skeletons
// - Memoized filtering
// - Progressive rendering
// ========================================

const ProductSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="bg-slate-200 aspect-square rounded-lg mb-4"></div>
    <div className="h-4 bg-slate-200 rounded mb-2"></div>
    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
  </div>
);

import { sortInStockFirst } from '@/lib/utils';

const Index: React.FC = () => {
  const { products, isLoading } = useStore();
  const { getContent } = useContent();

  // Memoize to prevent recalculation on every render - in-stock products displayed first
  const featuredProducts = useMemo(() =>
    sortInStockFirst(products.filter(p => p.isFeatured && p.isActive)).slice(0, 4),
    [products]
  );

  const newArrivals = useMemo(() =>
    sortInStockFirst(products.filter(p => p.slug === 'ragi-choco-malt' && p.isActive)),
    [products]
  );

  return (
    <Layout>
      <SEO 
        title="Mansara Foods | Healthy Porridge Mixes, Health Mix & Idly Podi | Chennai"
        description="Pure, traditional health mixes, porridge mixes, and idly podis from Mansara Foods, Chennai. Nutritious food for all ages, made the traditional way."
        keywords="health mix, porridge mix, urad dal health mix, black rice mix, idly podi, traditional food, healthy breakfast, Mansara Foods, Chennai, Tamil Nadu, organic food India"
        url="https://www.mansarafoods.com/"
      />
      <HeroSlider />

      {/* New Arrivals Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-brand-cream/30 relative overflow-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4 border border-brand-orange/20">
              <Sparkles className="w-3 h-3" />
              Just In
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              New Arrivals
            </h2>
            <div className="w-20 h-1 bg-brand-orange mx-auto rounded-full mb-4" />
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-4 leading-relaxed">
              Introducing our nutritious and delicious Ragi Choco Malt
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {[1, 2, 3, 4].map(i => <ProductSkeleton key={i} />)}
            </div>
          ) : newArrivals.length > 0 ? (
            <>
              <div className="flex justify-center max-w-lg mx-auto">
                <div className="w-full animate-fade-in-up">
                  <ProductCard product={newArrivals[0]} />
                </div>
              </div>
              <div className="text-center mt-10 sm:mt-12">
                <Link to="/new-arrivals">
                  <Button variant="outline" size="lg" className="text-sm sm:text-base px-8 py-6 rounded-full border-2 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300 shadow-sm hover:shadow-lg btn-shine group">
                    Learn More About Ragi Choco Malt
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
              <Leaf className="w-3 h-3" />
              Customer Favorites
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4" />
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-4 leading-relaxed">
              Our most loved products, crafted with traditional wisdom
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {[1, 2, 3, 4].map(i => <ProductSkeleton key={i} />)}
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {featuredProducts.map((product, index) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <div className="text-center mt-10 sm:mt-12">
                <Link to="/products">
                  <Button variant="outline" size="lg" className="text-sm sm:text-base px-8 py-6 rounded-full border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg btn-shine group">
                    View All Products
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* Audience Segment Section */}
      <section className="py-12 sm:py-16 bg-brand-cream/40 border-y border-border/40">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              Tailored For Your Wellness
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Nutrition Crafted for Every Stage of Life
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Mothers & Kids */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">Mothers & Kids</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4">
                  Sprouted sathu maavu & multi-grain porridges for infant weight gain, toddler immunity & lactating mothers.
                </p>
              </div>
              <Link to="/blog/health-mix-for-babies-and-kids" className="inline-flex items-center text-xs font-bold text-primary hover:underline">
                Explore Baby & Kids Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Card 2: Fitness & Weight Loss */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">Fitness & Weight Loss</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4">
                  High-fiber Karuppu Kavuni black rice & protein-rich sprouted urad mixes to sustain fat loss and active metabolism.
                </p>
              </div>
              <Link to="/blog/health-mix-for-weight-loss" className="inline-flex items-center text-xs font-bold text-primary hover:underline">
                Read Weight Loss Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Card 3: Diabetic & Senior Care */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">Diabetic & Senior Care</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4">
                  Low GI sprouted millets & whole urad dal for natural blood sugar stability and gentle digestive comfort.
                </p>
              </div>
              <Link to="/blog/millet-mix-for-diabetics" className="inline-flex items-center text-xs font-bold text-primary hover:underline">
                Read Senior Care Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Card 4: NRI & Global Tamil Diaspora */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">NRI & Global Diaspora</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4">
                  Freshly roasted, export-certified South Indian health mixes & idly podis delivered directly to your doorstep worldwide.
                </p>
              </div>
              <Link to="/blog/international-shipping-south-indian-food" className="inline-flex items-center text-xs font-bold text-primary hover:underline">
                View Export Shipping Info <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose MANSARA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-secondary bg-pattern-dots">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                Why Choose MANSARA?
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white shadow-sm border border-border/50">
                    <span className="text-primary font-bold text-sm sm:text-base">1</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1 text-sm sm:text-base">Clean Ingredients</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">Carefully selected, pure, and wholesome ingredients with no unnecessary additives.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white shadow-sm border border-border/50">
                    <span className="text-primary font-bold text-sm sm:text-base">2</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1 text-sm sm:text-base">Traditional Wisdom</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">Time-tested recipes and methods passed down through generations.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white shadow-sm border border-border/50">
                    <span className="text-primary font-bold text-sm sm:text-base">3</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1 text-sm sm:text-base">Modern Convenience</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">Easy-to-cook products suited for today's busy lifestyles.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:mt-8">
                <Link to="/about">
                  <Button variant="default" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                    Learn More About Us
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative order-first md:order-last">
              <div className="aspect-square bg-card rounded-2xl sm:rounded-3xl shadow-hover overflow-hidden border border-border">
                <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                  <div className="text-center p-6 sm:p-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-primary rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                      <span className="text-primary-foreground font-heading font-bold text-2xl sm:text-3xl lg:text-4xl">M</span>
                    </div>
                    <p className="font-heading font-semibold text-foreground text-base sm:text-lg lg:text-xl">MANSARA</p>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-1">Nourish from Within</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Health Mix & Porridge Educational SEO Content Section */}
      <section className="py-16 bg-card border-t border-border/40">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          <div className="max-w-4xl mx-auto space-y-8 text-foreground/90">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                <Leaf className="w-3.5 h-3.5" /> Traditional Wellness & Nutrition
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                Authentic Traditional Health Mix & Porridge Mixes from Chennai
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-4" />
            </div>

            <div className="prose prose-slate max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
              <p>
                At <strong className="text-foreground">Mansara Foods</strong>, based in <strong className="text-foreground">Chennai, Tamil Nadu</strong>, we are dedicated to reviving authentic South Indian culinary heritage through our premium <strong className="text-foreground">health mix Chennai</strong> creations and wholesome <strong className="text-foreground">traditional porridge mix</strong> blends. Rooted in ancestral recipes, our products offer complete family nutrition without artificial preservatives, additives, or refined sugars.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6 not-prose">
                <div className="bg-secondary/40 p-5 rounded-2xl border border-border/50">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Heritage Tamil Porridge Recipes
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Our flagship Urad Health Mixes and Black Rice Porridge Mixes draw from centuries of Tamil culinary wisdom. Slowly roasted whole grains and sprouted lentils nourish the stomach, boost vitality, and support bone density for all age groups.
                  </p>
                </div>
                <div className="bg-secondary/40 p-5 rounded-2xl border border-border/50">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-orange" />
                    Sprouted Millet Health Mix India
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Packed with multi-grains, finger millet (ragi), kambu, and digestive spices, our <strong className="text-foreground">millet health mix India</strong> blends provide sustained energy for toddlers, growing children, working professionals, and seniors alike.
                  </p>
                </div>
              </div>

              <h3 className="font-heading text-xl font-bold text-foreground tracking-tight">
                Buy Authentic Tamil Nadu Idly Podi Online
              </h3>
              <p>
                In addition to our nourishing porridge mixes, Mansara Foods crafts aromatic rice mixes and classic <strong className="text-foreground">idly podi online</strong> formulations—including Curry Leaf Podi, Moringa Rice Mix, Coriander Aroma Mix, and Pirandai Power Mix. Prepared using traditional slow-roasting techniques, each batch preserves natural essential oils, vitamins, and minerals.
              </p>

              <p>
                Whether you are looking for a wholesome daily morning breakfast drink or authentic South Indian side mixes delivered directly to your doorstep in Chennai and across India, Mansara Foods brings you pure, unadulterated taste and health.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />
    </Layout>
  );
};

export default Index;