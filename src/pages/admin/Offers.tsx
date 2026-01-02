import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const AdminOffers = () => {
  const { products } = useStore();
  const navigate = useNavigate();

  // Filter products that are marked as offers
  const offers = products.filter(p => p.isOffer);

  const calculateDiscount = (price: number, offerPrice?: number) => {
    if (!offerPrice) return 0;
    return Math.round(((price - offerPrice) / price) * 100);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Offers</h1>
          <p className="text-slate-600 mt-1">Manage products on offer</p>
        </div>

        {offers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              No products marked as offers yet
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {offer.image && (
                  <img
                    src={offer.image}
                    alt={offer.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{offer.name}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold">₹{offer.offerPrice || offer.price}</span>
                    {offer.offerPrice && (
                      <>
                        <span className="line-through text-slate-500">₹{offer.price}</span>
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-semibold">
                          {calculateDiscount(offer.price, offer.offerPrice)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={() => navigate(`/admin/products/${offer.id}/edit`)}
                    className="w-full gap-2"
                  >
                    <Edit2 size={16} /> Edit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOffers;
