import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Plus, Trash2, Package } from "lucide-react";
import { useStore, Combo } from "@/context/StoreContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminCombos = () => {
  const { combos, addCombo, updateCombo, deleteCombo } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Combo, 'id'>>({
    name: '',
    slug: '',
    originalPrice: 0,
    comboPrice: 0,
    image: '',
    images: [],
    description: '',
    isActive: true
  });

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name) {
      if (!editingId) {
        // Simple slug generation
        const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, slug }));
      }
    }
  }, [formData.name, editingId]);

  const handleEdit = (combo: Combo) => {
    setEditingId(combo.id);
    setFormData({
      name: combo.name,
      slug: combo.slug,
      originalPrice: combo.originalPrice,
      comboPrice: combo.comboPrice,
      image: combo.image,
      images: combo.images || (combo.image ? [combo.image] : []),
      description: combo.description,
      isActive: combo.isActive !== undefined ? combo.isActive : true
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      originalPrice: 0,
      comboPrice: 0,
      image: '',
      images: [],
      description: '',
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || formData.originalPrice <= 0) {
      toast.error("Name and valid price are required");
      return;
    }

    try {
      if (editingId) {
        await updateCombo(editingId, formData);
        toast.success("Combo updated successfully");
      } else {
        await addCombo(formData);
        toast.success("Combo created successfully");
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save combo");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this combo?")) {
      deleteCombo(id)
        .then(() => toast.success("Combo deleted"))
        .catch(() => toast.error("Failed to delete combo"));
    }
  };

  const toggleStatus = (id: string, currentStatus: boolean | undefined) => {
    // If undefined, assume true (active), so negate to false
    const isActive = currentStatus !== undefined ? currentStatus : true;
    const newStatus = !isActive;

    updateCombo(id, { isActive: newStatus })
      .then(() => toast.success(`Combo ${newStatus ? 'activated' : 'deactivated'}`))
      .catch(() => toast.error("Failed to update status"));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Combos</h1>
            <p className="text-slate-600 mt-1">Manage combo offers</p>
          </div>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus size={20} /> Add Combo
          </Button>
        </div>

        {combos.length === 0 ? (
          <Card className="border-dashed bg-slate-50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
              <Package className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No combo offers found</p>
              <Button onClick={handleAddNew} variant="link" className="mt-2">Create one now</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {combos.map((combo) => (
              <Card key={combo.id} className="overflow-hidden group">
                <div className="relative h-48 bg-slate-100">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Combo+Image')}
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(combo.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  {combo.isActive === false && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded font-bold uppercase">Deactivated</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{combo.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 min-h-[2.5em]">
                    {combo.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-primary">₹{combo.comboPrice || combo.originalPrice}</span>
                    {combo.comboPrice && combo.comboPrice < combo.originalPrice && (
                      <span className="line-through text-sm text-slate-400">₹{combo.originalPrice}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => toggleStatus(combo.id, combo.isActive)}
                      variant="outline"
                      size="sm"
                    >
                      {combo.isActive !== false ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      onClick={() => handleEdit(combo)}
                      size="sm"
                      className="gap-2"
                    >
                      <Edit2 size={14} /> Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit/Create Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Combo' : 'New Combo'}</DialogTitle>
              <DialogDescription>
                Configure the combo offer details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug" className="text-right">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="col-span-3"
                  placeholder="url-friendly-name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="originalPrice" className="text-right">Price (₹)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comboPrice" className="text-right">Offer Price</Label>
                <Input
                  id="comboPrice"
                  type="number"
                  value={formData.comboPrice || ''}
                  onChange={(e) => setFormData({ ...formData, comboPrice: Number(e.target.value) })}
                  className="col-span-3"
                  placeholder="Optional"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Images</Label>
                <div className="col-span-3 space-y-4">
                  <p className="text-sm text-muted-foreground">Add multiple images. First image is the main cover.</p>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Existing Images */}
                    {(formData.images || (formData.image ? [formData.image] : [])).map((img, index) => (
                      <div key={index} className="relative group">
                        <ImageUpload
                          value={img}
                          onChange={(url) => {
                            setFormData(prev => {
                              const newImages = [...(prev.images || (prev.image ? [prev.image] : []))];
                              if (!url) {
                                newImages.splice(index, 1);
                              } else {
                                newImages[index] = url;
                              }
                              return {
                                ...prev,
                                images: newImages,
                                image: newImages[0] || ""
                              };
                            });
                          }}
                        />
                        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs z-10">
                          {index === 0 ? "Main" : `#${index + 1}`}
                        </div>
                      </div>
                    ))}

                    {/* Add New Image Button */}
                    <div className="aspect-square">
                      <ImageUpload
                        onChange={(url) => {
                          if (url) {
                            setFormData(prev => {
                              const currentImages = prev.images || (prev.image ? [prev.image] : []);
                              const newImages = [...currentImages, url];
                              return {
                                ...prev,
                                images: newImages,
                                image: newImages[0] || ""
                              };
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="desc" className="text-right">Description</Label>
                <Input
                  id="desc"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCombos;
