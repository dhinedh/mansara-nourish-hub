import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ArrowLeft, Leaf, Shield, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { getProductBySlug, getFeaturedProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/ProductCard';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const product = slug ? getProductBySlug(slug) : undefined;
  const relatedProducts = getFeaturedProducts().filter(p => p.slug !== slug).slice(0, 4);

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold text-brand-blue mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button variant="default">Back to Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, 'product');
    }
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} has been added to your cart.`,
    });
  };

  const discountPercent = product.offerPrice 
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100) 
    : 0;

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary py-4">
        <div className="container">
          <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square bg-secondary rounded-2xl overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isOffer && (
                  <span className="bg-accent text-accent-foreground text-sm font-bold px-4 py-2 rounded-full">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="bg-brand-blue text-brand-cream text-sm font-bold px-4 py-2 rounded-full">
                    NEW
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div>
              <p className="text-accent font-semibold uppercase tracking-wide mb-2">
                {product.category === 'porridge-mixes' ? 'Porridge Mixes' : 'Oil & Ghee'}
              </p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                {product.offerPrice ? (
                  <>
                    <span className="font-heading font-bold text-brand-blue text-3xl">₹{product.offerPrice}</span>
                    <span className="text-muted-foreground text-xl line-through">₹{product.price}</span>
                    <span className="bg-accent text-accent-foreground text-sm font-bold px-3 py-1 rounded-full">
                      Save ₹{product.price - product.offerPrice}
                    </span>
                  </>
                ) : (
                  <span className="font-heading font-bold text-brand-blue text-3xl">₹{product.price}</span>
                )}
              </div>

              <p className="text-muted-foreground mb-6">{product.description}</p>

              <p className="text-sm text-foreground mb-6">
                <span className="font-semibold">Weight:</span> {product.weight}
              </p>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-border rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 font-semibold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button variant="default" size="lg" onClick={handleAddToCart} className="flex-1">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
              </div>

              {/* Trust Icons */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
                <div className="text-center">
                  <Leaf className="h-6 w-6 mx-auto text-brand-blue mb-2" />
                  <p className="text-xs text-muted-foreground">Pure Ingredients</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto text-brand-blue mb-2" />
                  <p className="text-xs text-muted-foreground">Quality Assured</p>
                </div>
                <div className="text-center">
                  <Clock className="h-6 w-6 mx-auto text-brand-blue mb-2" />
                  <p className="text-xs text-muted-foreground">Fresh & Natural</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info Tabs */}
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h3 className="font-heading font-semibold text-brand-blue mb-3">Ingredients</h3>
              <p className="text-muted-foreground text-sm">{product.ingredients}</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h3 className="font-heading font-semibold text-brand-blue mb-3">How to Use</h3>
              <p className="text-muted-foreground text-sm">{product.howToUse}</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h3 className="font-heading font-semibold text-brand-blue mb-3">Storage</h3>
              <p className="text-muted-foreground text-sm">{product.storage}</p>
            </div>
            <div className="bg-brand-light-yellow rounded-xl p-6">
              <h3 className="font-heading font-semibold text-brand-blue mb-3">Why MANSARA?</h3>
              <p className="text-muted-foreground text-sm">
                Every MANSARA product is crafted with purity, traditional wisdom, and an unwavering commitment to quality. No shortcuts, no compromises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-secondary">
          <div className="container">
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;
