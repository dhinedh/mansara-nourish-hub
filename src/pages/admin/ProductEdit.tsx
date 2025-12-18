import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface ProductFormData {
  name: string;
  slug: string;
  category: string;
  sub_category?: string;
  price: number;
  offer_price?: number;
  stock: number;
  weight?: string;
  short_description?: string;
  description?: string;
  ingredients?: string;
  how_to_use?: string;
  storage_instructions?: string;
  image_url?: string;
  is_offer: boolean;
  is_new_arrival: boolean;
  is_featured: boolean;
  is_active: boolean;
}

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    category: "Porridge Mixes",
    price: 0,
    stock: 0,
    is_offer: false,
    is_new_arrival: false,
    is_featured: false,
    is_active: true,
  });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id && id !== "new") {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
      if (error) throw error;
      setFormData(data);
    } catch (error: any) {
      toast.error("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
    });
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData({
      ...formData,
      [field]: checked,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (id && id !== "new") {
        const { error } = await supabase.from("products").update(formData).eq("id", id);
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase.from("products").insert([formData]);
        if (error) throw error;
        toast.success("Product created successfully");
      }
      navigate("/admin/products");
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-8">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/products")} className="gap-2">
            <ArrowLeft size={20} /> Back
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">
            {id && id !== "new" ? "Edit Product" : "Add Product"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug (auto-generated)</label>
                  <Input name="slug" value={formData.slug} disabled />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Porridge Mixes">Porridge Mixes</SelectItem>
                        <SelectItem value="Oil & Ghee">Oil & Ghee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sub-Category</label>
                    <Input
                      name="sub_category"
                      value={formData.sub_category || ""}
                      onChange={handleChange}
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Stock</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                    <Input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Offer Price (₹)</label>
                    <Input
                      name="offer_price"
                      type="number"
                      value={formData.offer_price || ""}
                      onChange={handleChange}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Stock *</label>
                    <Input
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Weight/Size</label>
                    <Input
                      name="weight"
                      value={formData.weight || ""}
                      onChange={handleChange}
                      placeholder="e.g., 500g"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Short Description</label>
                  <textarea
                    name="short_description"
                    value={formData.short_description || ""}
                    onChange={handleChange}
                    placeholder="Brief description"
                    className="w-full p-2 border border-slate-300 rounded-md"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    placeholder="Detailed description"
                    className="w-full p-2 border border-slate-300 rounded-md"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ingredients</label>
                  <textarea
                    name="ingredients"
                    value={formData.ingredients || ""}
                    onChange={handleChange}
                    placeholder="List of ingredients"
                    className="w-full p-2 border border-slate-300 rounded-md"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">How to Use</label>
                  <textarea
                    name="how_to_use"
                    value={formData.how_to_use || ""}
                    onChange={handleChange}
                    placeholder="Usage instructions"
                    className="w-full p-2 border border-slate-300 rounded-md"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Storage Instructions</label>
                  <textarea
                    name="storage_instructions"
                    value={formData.storage_instructions || ""}
                    onChange={handleChange}
                    placeholder="Storage guidelines"
                    className="w-full p-2 border border-slate-300 rounded-md"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="block text-sm font-medium mb-2">Product Image URL</label>
                  <Input
                    name="image_url"
                    value={formData.image_url || ""}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Product"
                      className="mt-4 w-full max-w-sm rounded-lg"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Visibility Flags</CardTitle>
                <CardDescription>Control product visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is_offer"
                    checked={formData.is_offer}
                    onCheckedChange={(checked) => handleCheckboxChange("is_offer", checked as boolean)}
                  />
                  <label htmlFor="is_offer" className="text-sm font-medium cursor-pointer">
                    Is Offer
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is_new_arrival"
                    checked={formData.is_new_arrival}
                    onCheckedChange={(checked) => handleCheckboxChange("is_new_arrival", checked as boolean)}
                  />
                  <label htmlFor="is_new_arrival" className="text-sm font-medium cursor-pointer">
                    Is New Arrival
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleCheckboxChange("is_featured", checked as boolean)}
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium cursor-pointer">
                    Is Featured
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleCheckboxChange("is_active", checked as boolean)}
                  />
                  <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                    Is Active
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent className="pt-6 space-y-3">
                <Button onClick={handleSave} className="w-full" disabled={saving}>
                  {saving ? "Saving..." : "Save Product"}
                </Button>
                <Button variant="outline" onClick={() => navigate("/admin/products")} className="w-full">
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProductEdit;
