import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface Combo {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  image_url?: string;
  is_active: boolean;
}

const AdminCombos = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      const { data, error } = await supabase.from("combos").select("*");
      if (error) throw error;
      setCombos(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch combos");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("combos")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      toast.success("Combo status updated");
      fetchCombos();
    } catch (error: any) {
      toast.error("Failed to update combo");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Combos</h1>
          <p className="text-slate-600 mt-1">Manage combo offers</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : combos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              No combos available
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {combos.map((combo) => (
              <Card key={combo.id} className="overflow-hidden">
                {combo.image_url && (
                  <img
                    src={combo.image_url}
                    alt={combo.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{combo.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold">₹{combo.discount_price || combo.price}</span>
                    {combo.discount_price && (
                      <span className="line-through text-slate-500">₹{combo.price}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => toggleStatus(combo.id, combo.is_active)}
                      variant="outline"
                      className="w-full"
                    >
                      {combo.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button className="w-full gap-2">
                      <Edit2 size={16} /> Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCombos;
