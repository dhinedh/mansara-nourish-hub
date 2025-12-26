import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import HighlightCards from '@/components/HighlightCards';
import TrustStrip from '@/components/TrustStrip';
import { useFeaturedProducts } from '@/hooks/useProducts';


const Index: React.FC = () => {
  const { data: featuredProducts = [], isLoading } = useFeaturedProducts();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Healthy Food Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>

        <div className="w-full relative z-10 px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          <div className="max-w-2xl lg:max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-card px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-card mb-4 sm:mb-6 animate-fade-in">
              <Leaf className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Pure & Nourishing Foods</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-brand-blue mb-3 sm:mb-4 animate-fade-in-up leading-tight" style={{ animationDelay: '0.1s' }}>
              Nourish from Within
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-accent font-heading font-semibold mb-4 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              The Power of MANSARA
            </p>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-lg lg:max-w-xl animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.3s' }}>
              Discover pure, traditionally prepared foods crafted with care. From wholesome porridge mixes to cold-pressed oils, experience the difference of honest nourishment.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/products" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                  Shop Now
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto">
                <Button variant="heroOutline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                  Explore Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HighlightCards />

      {/* Featured Products Section */}
      <section className="py-10 sm:py-12 lg:py-16 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-blue mb-2">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-xl mx-auto px-4">
              Our most loved products, crafted with traditional wisdom and modern convenience
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-card rounded-xl h-56 sm:h-64 lg:h-72 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-6 sm:mt-8">
            <Link to="/products">
              <Button variant="outline" size="lg" className="text-xs sm:text-sm">
                View All Products
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose MANSARA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-brand-light-yellow">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-blue mb-4 sm:mb-6">
                Why Choose MANSARA?
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-sm sm:text-base">1</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1 text-sm sm:text-base">Clean Ingredients</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">Carefully selected, pure, and wholesome ingredients with no unnecessary additives.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-sm sm:text-base">2</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1 text-sm sm:text-base">Traditional Wisdom</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">Time-tested recipes and methods passed down through generations.</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-sm sm:text-base">3</span>
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
              <div className="aspect-square bg-card rounded-2xl sm:rounded-3xl shadow-hover overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center p-6 sm:p-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-primary rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      <span className="text-primary-foreground font-heading font-bold text-2xl sm:text-3xl lg:text-4xl">M</span>
                    </div>
                    <p className="font-heading font-semibold text-brand-blue text-base sm:text-lg lg:text-xl">MANSARA</p>
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