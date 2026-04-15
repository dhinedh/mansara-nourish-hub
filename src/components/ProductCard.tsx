import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap } from 'lucide-react';
import { calculateUnitPrice, optimizeImage } from '@/lib/utils';
import ProgressiveImage from '@/components/ui/ProgressiveImage';
import WhatsAppBuyButton from './WhatsAppBuyButton';
import { Product as DataProduct } from '@/data/products';
import { Product as StoreProduct } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

// Define a union type for the prop
type Product = DataProduct | StoreProduct;

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showBadge = true }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  // Normalize product data common fields
  const rawImage = product.image || (product as any).image_url || '';
  const imageUrl = optimizeImage(rawImage, 400);

  // Determine effective stock
  const stock = product.stock;

  const hasVariants = product.variants && product.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? product.variants![0] : null);

  // Determine effective stock
  const stock = selectedVariant ? selectedVariant.stock : product.stock;

  const basePrice = selectedVariant ? selectedVariant.price : product.price;
  const baseOriginalPrice = selectedVariant ? (selectedVariant as any).originalPrice : (product as any).originalPrice;

  const displayPrice = basePrice;
  const mrp = baseOriginalPrice;
  const hasDiscount = !!(mrp && mrp > displayPrice);

  // Calculate discount percentage
  let maxDiscountPercent = 0;
  if (hasDiscount) {
    maxDiscountPercent = Math.round(((mrp - displayPrice) / mrp) * 100);
  }

  // Check all variants for deeper discounts (for badge display)
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(v => {
      const vSelling = v.price;
      const vMrp = (v as any).originalPrice;

      if (vMrp && vMrp > vSelling) {
        const discount = Math.round(((vMrp - vSelling) / vMrp) * 100);
        if (discount > maxDiscountPercent) {
          maxDiscountPercent = discount;
        }
      }
    });
  }

  const isNewArrival = product.isNewArrival;
  const showDiscountBadge = maxDiscountPercent > 0 || product.isOffer;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (stock === 0) {
      toast({
        title: "Out of stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }

    setAdding(true);
    try {
      // If it's a StoreProduct, we need to adapt it for CartContext which expects DataProduct-like structure
      // specifically matching properties used in addToCart
      const cartItemStruture = {
        ...product,
        image: imageUrl,
        price: displayPrice,
        originalPrice: mrp,
        weight: selectedVariant ? selectedVariant.weight : product.weight,
        variant: selectedVariant ? { weight: selectedVariant.weight } : undefined
      };

      // Cast to any because CartContext types are strict but runtime is compatible with this shape
      addToCart(cartItemStruture as any, 'product');

      toast({
        title: "Added to cart!",
        description: `${product.name} (${selectedVariant ? selectedVariant.weight : product.weight}) has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      });
    }
    setAdding(false);
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock === 0) return;

    const cartItemStruture = {
      ...product,
      image: imageUrl,
      price: displayPrice,
      originalPrice: mrp,
      weight: selectedVariant ? selectedVariant.weight : product.weight,
      variant: selectedVariant ? { weight: selectedVariant.weight } : undefined
    };

    addToCart(cartItemStruture as any, 'product');
    navigate('/checkout');
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-transparent hover:border-black/5 flex flex-col h-full">
      <Link
        to={`/product/${product.slug}`}
        className="relative overflow-hidden aspect-square block"
      >
        <ProgressiveImage
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          placeholder="/placeholder.svg"
        />
        {showBadge && (
          <>
            {isNewArrival && (
              <span
                className="absolute top-4 right-4 px-3 py-1 text-xs font-bold text-white rounded-full shadow-sm"
                style={{ backgroundColor: '#E91E63' }}
              >
                NEW
              </span>
            )}
            {showDiscountBadge && (
              <span
                className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full shadow-sm"
                style={{ backgroundColor: '#FDB913', color: '#1a1a1a' }}
              >
                {maxDiscountPercent}% OFF
              </span>
            )}
          </>
        )}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-wider">OUT OF STOCK</span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-heading font-semibold text-lg mb-2 truncate text-foreground group-hover:text-primary transition-colors" title={product.name}>
            {product.name}
          </h3>
        </Link>
        
        {(product.short_description || product.description) && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.short_description || product.description}
          </p>
        )}

        {/* Variant Selector */}
        {hasVariants && (
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-0.5">Select Variety</p>
            <div className="flex flex-wrap gap-1.5">
              {product.variants!.map((v, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariant(v);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-all ${
                    selectedVariant?.weight === v.weight
                      ? 'bg-[#1F2A7C] border-[#1F2A7C] text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-[#1F2A7C]/30 hover:bg-slate-50'
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  ₹{displayPrice.toFixed(0)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through decoration-red-400/50">
                    ₹{mrp.toFixed(0)}
                  </span>
                )}
              </div>
              {!hasVariants && product.weight && (
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  {product.weight}
                </p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={adding || stock === 0}
              className="p-3 rounded-xl transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground hover:scale-110 active:scale-95 btn-shine relative overflow-hidden group/btn"
              style={{
                backgroundColor: stock === 0 ? '#ccc' : '#FDB913',
                boxShadow: stock === 0 ? 'none' : '0 4px 15px -3px rgba(253, 185, 19, 0.4)'
              }}
              title={stock === 0 ? 'Out of stock' : 'Add to cart'}
            >
              <ShoppingCart className="w-5 h-5 text-black" />
            </button>
          </div>
          
          <button
            onClick={handleBuyNow}
            disabled={stock === 0}
            className="w-full py-2 px-4 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap size={16} className="fill-current" />
            Buy Now
          </button>
          
          {stock > 0 && (
            <WhatsAppBuyButton
              product={product}
              variant={selectedVariant}
              className="w-full mt-2"
            />
          )}
          
          {stock > 0 && stock < 10 && (
            <p className="text-xs text-orange-600 font-medium mt-3 text-center">Only {stock} left!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;