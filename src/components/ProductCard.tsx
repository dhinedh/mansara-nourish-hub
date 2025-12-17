import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showBadge = true }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 'product');
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const discountPercent = product.offerPrice 
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100) 
    : 0;

  return (
    <Link to={`/product/${product.slug}`} className="group">
      <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-square bg-secondary overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          {showBadge && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isOffer && (
                <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                  {discountPercent}% OFF
                </span>
              )}
              {product.isNewArrival && (
                <span className="bg-brand-blue text-brand-cream text-xs font-bold px-3 py-1 rounded-full">
                  NEW
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.category === 'porridge-mixes' ? 'Porridge Mixes' : 'Oil & Ghee'}
          </p>
          <h3 className="font-heading font-semibold text-foreground text-sm mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            {product.offerPrice ? (
              <>
                <span className="font-heading font-bold text-brand-blue text-lg">₹{product.offerPrice}</span>
                <span className="text-muted-foreground text-sm line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="font-heading font-bold text-brand-blue text-lg">₹{product.price}</span>
            )}
          </div>

          {/* Add to Cart */}
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
