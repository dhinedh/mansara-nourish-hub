import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useStore, Product } from "@/context/StoreContext";
import ImageUpload from "@/components/admin/ImageUpload";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, addProduct, updateProduct, categories } = useStore();

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: "",
    slug: "",
    category: "",
    price: 0,
    store: 0, // Typo fix: stock
    stock: 0,
    is_offer: false,
    is_new_arrival: false,
    is_featured: false,
    is_active: true,
    highlights: [],
    image_url: "",
    sub_category: "",
    offer_price: 0,
    weight: "",
    short_description: "",
    description: "",
    ingredients: "",
    how_to_use: "",
    storage_instructions: "",
    nutrition: "",
    compliance: ""
  } as any);

  const [highlightsText, setHighlightsText] = useState("");

  useEffect(() => {
    if (id && id !== "new") {
      const product = getProduct(id);
      if (product) {
        setFormData(product);
        if (product.highlights) {
          setHighlightsText(product.highlights.join("\n"));
        }
      } else {
        toast.error("Product not found");
        navigate("/admin/products");
      }
    }
  }, [id, getProduct, navigate]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: id === "new" ? generateSlug(name) : prev.slug,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "stock" || name === "offer_price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleHighlightsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHighlightsText(e.target.value);
    setFormData(prev => ({
      ...prev,
      highlights: e.target.value.split("\n").filter(line => line.trim() !== "")
    }));
  };

  const handleSave = () => {
    if (!formData.name || formData.price <= 0) {
      toast.error("Name and valid price are required");
      return;
    }

    try {
      if (id && id !== "new") {
        updateProduct(id, formData);
        toast.success("Product updated successfully");
      } else {
        addProduct(formData);
        toast.success("Product created successfully");
      }
      navigate("/admin/products");
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

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
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
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
                    className="w-full p-2 border border-slate-300 rounded-md bg-transparent"
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
                    className="w-full p-2 border border-slate-300 rounded-md bg-transparent"
                    rows={7}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Key Highlights (One per line)</label>
                  <textarea
                    value={highlightsText}
                    onChange={handleHighlightsChange}
                    placeholder="• Highlight 1&#10;• Highlight 2"
                    className="w-full p-2 border border-slate-300 rounded-md bg-transparent"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ingredients</label>
                  <textarea
                    name="ingredients"
                    value={formData.ingredients || ""}
                    onChange={handleChange}
                    placeholder="List of ingredients"
                    className="w-full p-2 border border-slate-300 rounded-md bg-transparent"
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
                    className="w-full p-2 border border-slate-300 rounded-md bg-transparent"
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
                  <label className="block text-sm font-medium mb-2">Product Image</label>
                  <div className="space-y-4">
                    <ImageUpload
                      value={formData.image_url}
                      onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                    />
                  </div>
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
                <Button onClick={handleSave} className="w-full">
                  Save Product
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
