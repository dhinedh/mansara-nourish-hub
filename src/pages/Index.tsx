import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import HighlightCards from '@/components/HighlightCards';
import TrustStrip from '@/components/TrustStrip';
import { useFeaturedProducts } from '@/hooks/useProducts';
import heroImage from '@/assets/hero-image.jpg';

const Index: React.FC = () => {
  const { data: featuredProducts = [], isLoading } = useFeaturedProducts();

  return (
    <Layout>
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="MANSARA Foods" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-card mb-6 animate-fade-in">
              <Leaf className="h-4 w-4 text-brand-blue" />
              <span className="text-sm font-medium text-foreground">Pure & Nourishing Foods</span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-brand-blue mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Nourish from Within
            </h1>
            <p className="text-xl md:text-2xl text-accent font-heading font-semibold mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              The Power of MANSARA
            </p>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Discover pure, traditionally prepared foods crafted with care. From wholesome porridge mixes to cold-pressed oils, experience the difference of honest nourishment.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/products">
                <Button variant="hero" size="lg">
                  Shop Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="heroOutline" size="lg">
                  Explore Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HighlightCards />

      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-3">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our most loved products, crafted with traditional wisdom and modern convenience
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-card rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

          <div className="text-center mt-10">
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-light-yellow">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-6">
                Why Choose MANSARA?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1">Clean Ingredients</h4>
                    <p className="text-muted-foreground text-sm">Carefully selected, pure, and wholesome ingredients with no unnecessary additives.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1">Traditional Wisdom</h4>
                    <p className="text-muted-foreground text-sm">Time-tested recipes and methods passed down through generations.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1">Modern Convenience</h4>
                    <p className="text-muted-foreground text-sm">Easy-to-cook products suited for today's busy lifestyles.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/about">
                  <Button variant="default" size="lg">
                    Learn More About Us
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-card rounded-3xl shadow-hover overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
                      <span className="text-primary-foreground font-heading font-bold text-3xl">M</span>
                    </div>
                    <p className="font-heading font-semibold text-brand-blue text-lg">MANSARA</p>
                    <p className="text-muted-foreground text-sm">Nourish from Within</p>
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
