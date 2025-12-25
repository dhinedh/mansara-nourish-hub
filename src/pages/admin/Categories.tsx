import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

const AdminCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("name");
            if (error) throw error;
            setCategories(data || []);
        } catch (error: any) {
            toast.error("Failed to fetch categories");
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

    const handleSave = async () => {
        if (!formData.name) {
            toast.error("Name is required");
            return;
        }

        setSaving(true);
        try {
            const slug = generateSlug(formData.name);
            const dataToSave = {
                name: formData.name,
                slug,
                description: formData.description,
            };

            if (editingCategory) {
                const { error } = await supabase
                    .from("categories")
                    .update(dataToSave)
                    .eq("id", editingCategory.id);
                if (error) throw error;
                toast.success("Category updated");
            } else {
                const { error } = await supabase
                    .from("categories")
                    .insert([dataToSave]);
                if (error) throw error;
                toast.success("Category created");
            }

            setIsDialogOpen(false);
            resetForm();
            fetchCategories();
        } catch (error: any) {
            toast.error(error.message || "Failed to save category");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This might affect products linked to this category.")) return;
        try {
            const { error } = await supabase.from("categories").delete().eq("id", id);
            if (error) throw error;
            toast.success("Category deleted");
            fetchCategories();
        } catch (error: any) {
            toast.error("Failed to delete category");
        }
    };

    const resetForm = () => {
        setFormData({ name: "", description: "" });
        setEditingCategory(null);
    };

    const openEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description || "" });
        setIsDialogOpen(true);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
                        <p className="text-slate-600 mt-1">Manage product categories</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus size={20} /> Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Category Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <Input
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Description (Optional)"
                                    />
                                </div>
                                <Button onClick={handleSave} className="w-full" disabled={saving}>
                                    {saving ? "Saving..." : "Save Category"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">Loading...</TableCell>
                                </TableRow>
                            ) : categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">No categories found</TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>{category.slug}</TableCell>
                                        <TableCell>{category.description}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(category)}>
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(category.id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCategories;
