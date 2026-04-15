import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import WhatsAppBuyButton from './WhatsAppBuyButton';

interface VariantSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
  onConfirm: (variant: any) => void;
  actionType: 'cart' | 'buy' | 'whatsapp' | null;
}

const VariantSelectionModal: React.FC<VariantSelectionModalProps> = ({
  isOpen,
  onOpenChange,
  product,
  onConfirm,
  actionType
}) => {
  const variants = product?.variants || [];
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, selectedVariant]);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] sm:max-w-md bg-white p-0 overflow-hidden border-none shadow-2xl rounded-2xl gap-0">
        <div className="p-6">
          <DialogHeader className="mb-6 space-y-2">
            <DialogTitle className="text-2xl font-bold font-heading text-[#1F2A7C]">
              Select Variety
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Choose your preferred size for <span className="font-semibold text-slate-800">{product.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mb-8 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
            {variants.map((v: any, idx: number) => {
              const isSelected = selectedVariant?.weight === v.weight;
              const vMrp = v.originalPrice || (v as any).mrp;
              const vPrice = v.price;
              const vDisc = vMrp && vMrp > vPrice ? Math.round(((vMrp - vPrice) / vMrp) * 100) : 0;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedVariant(v)}
                  className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 w-full ${isSelected
                      ? 'border-[#1F2A7C] bg-blue-50/50 shadow-md ring-1 ring-[#1F2A7C]/20'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'border-[#1F2A7C] bg-[#1F2A7C]' : 'border-slate-300 bg-white'
                      }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="text-left">
                      <p className={`font-bold text-base sm:text-lg ${isSelected ? 'text-[#1F2A7C]' : 'text-slate-700'}`}>{v.weight}</p>
                      {vDisc > 0 && (
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-tight">Save {vDisc}%</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg sm:text-xl text-slate-900">₹{vPrice.toFixed(0)}</p>
                    {vMrp > vPrice && (
                      <p className="text-xs sm:text-sm text-slate-400 line-through">₹{vMrp.toFixed(0)}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {actionType === 'whatsapp' ? (
              <div className="flex-1 w-full">
                <WhatsAppBuyButton
                  product={product}
                  variant={selectedVariant}
                  className="w-full h-14 !rounded-xl text-base font-bold shadow-lg"
                />
              </div>
            ) : (
              <Button
                className="flex-1 h-14 rounded-xl font-bold bg-[#FDB913] text-black hover:bg-[#eeb012] shadow-lg transform transition-all active:scale-95 text-lg"
                onClick={() => {
                  onConfirm(selectedVariant);
                  onOpenChange(false);
                }}
              >
                Confirm & {actionType === 'buy' ? 'Buy Now' : 'Add to Cart'}
              </Button>
            )}
            <Button
              variant="ghost"
              className="h-14 sm:w-24 rounded-xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 order-last sm:order-first"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VariantSelectionModal;
