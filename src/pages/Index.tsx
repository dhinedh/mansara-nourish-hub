import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import HighlightCards from '@/components/HighlightCards';
import TrustStrip from '@/components/TrustStrip';
import HeroSlider from '@/components/home/HeroSlider';
import { useFeaturedProducts } from '@/hooks/useProducts';


const Index: React.FC = () => {
  const { data: featuredProducts = [], isLoading } = useFeaturedProducts();

  return (
    <Layout>
      <HeroSlider />

      <HighlightCards />

      {/* Featured Products Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
        {/* Decorative background element */}
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
              Our most loved products, crafted with traditional wisdom and modern convenience. Experience the authentic taste of tradition.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-card rounded-xl h-96 animate-pulse shadow-sm border border-border/50" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10 sm:mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg" className="text-sm sm:text-base px-8 py-6 rounded-full border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg btn-shine group">
                View All Products
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
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

      <TrustStrip />
    </Layout>
  );
};

export default Index;