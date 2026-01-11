import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Plus, Tag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";

const AdminOffers = () => {
  const { products, updateProduct } = useStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter products that are marked as offers
  const offers = products.filter(p => p.isOffer);

  // Filter products eligible for new offers (not already an offer)
  const eligibleProducts = products.filter(p => !p.isOffer);

  const calculateDiscount = (price: number, offerPrice?: number) => {
    if (!offerPrice) return 0;
    return Math.round(((price - offerPrice) / price) * 100);
  };

  const handleAddOffer = async () => {
    if (!selectedProductId || !offerPrice) {
      toast.error("Please select a product and enter an offer price");
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    if (Number(offerPrice) >= product.price) {
      toast.error("Offer price must be less than the original price");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProduct(selectedProductId, {
        isOffer: true,
        offerPrice: Number(offerPrice)
      });
      toast.success("Offer added successfully");
      setIsModalOpen(false);
      setSelectedProductId("");
      setOfferPrice("");
    } catch (error) {
      toast.error("Failed to add offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Offers</h1>
            <p className="text-slate-600 mt-1">Manage products on offer</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus size={18} /> Add New Offer
          </Button>
        </div>

        {offers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <Tag size={32} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900">No Active Offers</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-1">
                  Create your first offer to attract more customers and boost sales.
                </p>
              </div>
              <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                Create Offer
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  {offer.image ? (
                    <img
                      src={offer.image}
                      alt={offer.name}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    {calculateDiscount(offer.price, offer.offerPrice)}% OFF
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 truncate" title={offer.name}>{offer.name}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-slate-900">₹{offer.offerPrice}</span>
                    <span className="line-through text-slate-500 text-sm">₹{offer.price}</span>
                  </div>
                  <Button
                    onClick={() => navigate(`/admin/products/${offer.id}/edit`)}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <Edit2 size={16} /> Edit Offer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Offer</DialogTitle>
              <DialogDescription>
                Select a product and set a discounted price.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Product</label>
                <Select
                  value={selectedProductId}
                  onValueChange={setSelectedProductId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {eligibleProducts.length === 0 ? (
                      <SelectItem value="none" disabled>No eligible products found</SelectItem>
                    ) : (
                      eligibleProducts.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} (₹{product.price})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedProduct && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Offer Price (₹)</label>
                    <Input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder={`Enter amount less than ${selectedProduct.price}`}
                      min="1"
                      max={selectedProduct.price - 1}
                    />
                  </div>

                  {offerPrice && Number(offerPrice) < selectedProduct.price && (
                    <div className="bg-green-50 text-green-700 p-3 rounded text-sm flex justify-between items-center">
                      <span>Discount Percentage:</span>
                      <span className="font-bold text-lg">
                        {calculateDiscount(selectedProduct.price, Number(offerPrice))}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button
                onClick={handleAddOffer}
                disabled={!selectedProductId || !offerPrice || isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Offer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOffers;
