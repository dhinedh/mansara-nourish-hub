import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Check } from 'lucide-react';
import { calculateUnitPrice, optimizeImage } from '@/lib/utils';
import ProgressiveImage from '@/components/ui/ProgressiveImage';
import WhatsAppBuyButton from './WhatsAppBuyButton';
import { Product as DataProduct } from '@/data/products';
import { Product as StoreProduct } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

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
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'cart' | 'buy' | 'whatsapp' | null>(null);

  // Normalize product data common fields
  const rawImage = product.image || (product as any).image_url || '';
  const imageUrl = optimizeImage(rawImage, 400);

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

  const executeAction = (action: 'cart' | 'buy' | 'whatsapp', variant = selectedVariant) => {
    if (action === 'cart') {
      performAddToCart(variant);
    } else if (action === 'buy') {
      performBuyNow(variant);
    }
    // WhatsApp is handled by the button component usually,
    // but we can trigger it or just let the user click it from modal.
  };

  const performAddToCart = async (variant = selectedVariant) => {
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
      const cartItemStruture = {
        ...product,
        image: imageUrl,
        price: variant ? variant.price : product.price,
        originalPrice: variant ? (variant as any).originalPrice : (product as any).originalPrice,
        weight: variant ? variant.weight : product.weight,
        variant: variant ? { weight: variant.weight } : undefined
      };

      addToCart(cartItemStruture as any, 'product');

      toast({
        title: "Added to cart!",
        description: `${product.name} (${variant ? variant.weight : product.weight}) added.`,
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

  const performBuyNow = async (variant = selectedVariant) => {
    if (stock === 0) return;

    const cartItemStruture = {
      ...product,
      image: imageUrl,
      price: variant ? variant.price : product.price,
      originalPrice: variant ? (variant as any).originalPrice : (product as any).originalPrice,
      weight: variant ? variant.weight : product.weight,
      variant: variant ? { weight: variant.weight } : undefined
    };

    addToCart(cartItemStruture as any, 'product');
    navigate('/checkout');
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants) {
      setPendingAction('cart');
      setShowVariantModal(true);
    } else {
      performAddToCart();
    }
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants) {
      setPendingAction('buy');
      setShowVariantModal(true);
    } else {
      performBuyNow();
    }
  };

  const weightVarieties = product.variants && product.variants.length > 0
    ? product.variants.map(v => v.weight).join(', ')
    : product.weight;

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
              <p className="text-xs text-muted-foreground font-medium mt-1">
                {hasVariants ? `Available in: ${weightVarieties}` : product.weight}
              </p>
            </div>
            <button
              onClick={handleAddToCartClick}
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
            onClick={handleBuyNowClick}
            disabled={stock === 0}
            className="w-full py-2.5 px-4 bg-black text-white rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-wider"
          >
            <Zap size={16} className="fill-current" />
            Buy Now
          </button>
          
          {stock > 0 && (
            <WhatsAppBuyButton
              product={product}
              variant={selectedVariant}
              className="w-full mt-2"
              onClick={hasVariants ? (e) => {
                e.preventDefault();
                e.stopPropagation();
                setPendingAction('whatsapp');
                setShowVariantModal(true);
              } : undefined}
            />
          )}
          
          {stock > 0 && stock < 10 && (
            <p className="text-xs text-orange-600 font-medium mt-3 text-center">Only {stock} left!</p>
          )}
        </div>
      </div>

      {/* Variant Selection Modal */}
      <Dialog open={showVariantModal} onOpenChange={setShowVariantModal}>
        <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold font-heading text-[#1F2A7C]">Choose Variety</DialogTitle>
              <DialogDescription className="text-slate-500 text-base">
                Select your preferred size for <span className="font-semibold text-slate-800">{product.name}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-1 gap-3">
                {product.variants?.map((v, idx) => {
                   const isSelected = selectedVariant?.weight === v.weight;
                   const vMrp = (v as any).originalPrice;
                   const vPrice = v.price;
                   const vDisc = vMrp && vMrp > vPrice ? Math.round(((vMrp - vPrice)/vMrp)*100) : 0;

                   return (
                     <button
                       key={idx}
                       onClick={() => setSelectedVariant(v)}
                       className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                         isSelected 
                           ? 'border-[#1F2A7C] bg-blue-50/50 shadow-md ring-1 ring-[#1F2A7C]/20' 
                           : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                       }`}
                     >
                       <div className="flex items-center gap-3">
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                           isSelected ? 'border-[#1F2A7C] bg-[#1F2A7C]' : 'border-slate-300 bg-white'
                         }`}>
                           {isSelected && <Check className="w-3 h-3 text-white" />}
                         </div>
                         <div className="text-left">
                           <p className={`font-bold text-lg ${isSelected ? 'text-[#1F2A7C]' : 'text-slate-700'}`}>{v.weight}</p>
                           {vDisc > 0 && (
                             <span className="text-[10px] font-bold text-green-600 uppercase">Save {vDisc}%</span>
                           )}
                         </div>
                       </div>
                       
                       <div className="text-right">
                         <p className="font-bold text-xl text-slate-900">₹{vPrice.toFixed(0)}</p>
                         {vMrp > vPrice && (
                           <p className="text-sm text-slate-400 line-through">₹{vMrp.toFixed(0)}</p>
                         )}
                       </div>
                     </button>
                   );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-xl font-bold text-slate-500 border-slate-200 hover:bg-slate-50"
                onClick={() => setShowVariantModal(false)}
              >
                Cancel
              </Button>
              {pendingAction === 'whatsapp' ? (
                <div className="flex-1">
                  <WhatsAppBuyButton
                    product={product}
                    variant={selectedVariant}
                    className="w-full h-12 !rounded-xl"
                  />
                </div>
              ) : (
                <Button 
                  className="flex-1 h-12 rounded-xl font-bold bg-[#FDB913] text-black hover:bg-[#eeb012] shadow-sm transform transition-all active:scale-95"
                  onClick={() => {
                    executeAction(pendingAction as 'cart' | 'buy');
                    setShowVariantModal(false);
                  }}
                >
                  Confirm Choice
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductCard;