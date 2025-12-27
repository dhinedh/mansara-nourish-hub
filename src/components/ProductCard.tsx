import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap } from 'lucide-react';
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
  // Normalize product data common fields
  const getProductImage = (p: Product) => 'image_url' in p ? (p as StoreProduct).image_url || '' : (p as DataProduct).image;
  const getProductOfferPrice = (p: Product) => 'offer_price' in p ? (p as StoreProduct).offer_price : (p as DataProduct).offerPrice;
  const getProductIsNew = (p: Product) => 'is_new_arrival' in p ? (p as StoreProduct).is_new_arrival : (p as DataProduct).isNewArrival;

  const imageUrl = getProductImage(product);
  const offerPrice = getProductOfferPrice(product);
  const isNewArrival = getProductIsNew(product);
  const stock = product.stock;
  const price = product.price;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

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
        offerPrice: offerPrice,
      };

      // Cast to any because CartContext types are strict but runtime is compatible with this shape
      addToCart(cartItemStruture as any, 'product');

      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
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
    if (stock === 0) return;

    const cartItemStruture = {
      ...product,
      image: imageUrl,
      offerPrice: offerPrice,
    };

    addToCart(cartItemStruture as any, 'product');
    navigate('/checkout');
  };

  const displayPrice = offerPrice || price;
  const hasDiscount = offerPrice && offerPrice < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - offerPrice) / price) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-transparent hover:border-black/5"
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('placeholder')) {
              target.src = "https://placehold.co/800x800/f5f5f5/999999?text=Product";
            }
          }}
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
            {hasDiscount && (
              <span
                className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full shadow-sm"
                style={{ backgroundColor: '#FDB913', color: '#1a1a1a' }}
              >
                {discountPercent}% OFF
              </span>
            )}
          </>
        )}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-wider">OUT OF STOCK</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-heading font-semibold text-lg mb-2 truncate text-foreground group-hover:text-primary transition-colors" title={product.name}>
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground">
              ₹{displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="ml-2 text-sm text-muted-foreground line-through decoration-red-400/50">
                ₹{price.toFixed(2)}
              </span>
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
          className="w-full mt-3 py-2 px-4 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap size={16} className="fill-current" />
          Buy Now
        </button>
        {stock > 0 && stock < 10 && (
          <p className="text-xs text-orange-600 font-medium mt-3">Only {stock} left!</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;