import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Combo } from '@/context/StoreContext';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ComboCardProps {
  combo: Combo;
}

const ComboCard: React.FC<ComboCardProps> = ({ combo }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { getProduct } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Helper to adapt StoreContext Combo to CartContext expected type if needed, 
    // assuming CartContext handles similar shape or we cast it. 
    // Ideally CartContext should share types with StoreContext.
    addToCart(combo as any, 'combo');
    toast({
      title: "Combo added to cart!",
      description: `${combo.name} has been added to your cart.`,
    });
  };

  const savings = combo.originalPrice - combo.comboPrice;
  const productNames = (combo.products || []).map(id => getProduct(id)?.name).filter(Boolean);

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
        <img
          src={combo.image}
          alt={combo.name}
          className="w-full h-full object-cover"
        />

        {/* Savings Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-accent text-accent-foreground text-sm font-bold px-4 py-2 rounded-full">
            Save ₹{savings}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-bold text-foreground text-lg mb-2">
          {combo.name}
        </h3>

        <p className="text-muted-foreground text-sm mb-3">
          {combo.description}
        </p>

        {/* Included Products */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Includes:</p>
          <ul className="text-sm text-foreground space-y-1">
            {productNames.map((name, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                {name}
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-heading font-bold text-primary text-2xl">₹{combo.comboPrice}</span>
          <span className="text-muted-foreground line-through">₹{combo.originalPrice}</span>
        </div>

        {/* Add to Cart */}
        <Button
          variant="default"
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5" />
          Add Combo to Cart
        </Button>
      </div>
    </div>
  );
};

export default ComboCard;
