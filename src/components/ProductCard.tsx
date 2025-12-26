import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showBadge = true }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (product.stock === 0) {
      toast({
        title: "Out of stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }

    setAdding(true);
    try {
      addToCart(product, 'product');
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

  const displayPrice = product.offerPrice || product.price;
  const hasDiscount = product.offerPrice && product.offerPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('placeholder')) {
              target.src = "https://placehold.co/800x800/f5f5f5/999999?text=Product";
            }
          }}
        />
        {showBadge && (
          <>
            {product.isNewArrival && (
              <span
                className="absolute top-4 right-4 px-3 py-1 text-xs font-bold text-white rounded-full"
                style={{ backgroundColor: '#E91E63' }}
              >
                NEW
              </span>
            )}
            {hasDiscount && (
              <span
                className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full"
                style={{ backgroundColor: '#FDB913', color: '#1F2A7C' }}
              >
                {discountPercent}% OFF
              </span>
            )}
          </>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">OUT OF STOCK</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2" style={{ color: '#1F2A7C' }}>
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold" style={{ color: '#1F2A7C' }}>
              ₹{displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="p-2 rounded-lg transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: product.stock === 0 ? '#ccc' : '#FDB913' }}
            title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart className="w-5 h-5" style={{ color: '#1F2A7C' }} />
          </button>
        </div>
        {product.stock > 0 && product.stock < 10 && (
          <p className="text-xs text-orange-600 mt-2">Only {product.stock} left!</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;