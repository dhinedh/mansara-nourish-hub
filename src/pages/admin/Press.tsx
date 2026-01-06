import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription, // Added
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Newspaper } from "lucide-react";
import { fetchPressReleases, createPressRelease, updatePressRelease, deletePressRelease } from "@/lib/api";

import ImageUpload from "@/components/admin/ImageUpload";

interface PressRelease {
    _id: string;
    title: string;
    summary: string;
    externalLink: string;
    image: string;
    images: string[];
    video: string;
    date: string;
    isPublished: boolean;
}

const AdminPress = () => {
    const [items, setItems] = useState<PressRelease[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PressRelease | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        externalLink: "",
        image: "",
        images: [] as string[],
        video: "",
        date: new Date().toISOString().split('T')[0],
        isPublished: true
    });

    const loadItems = async () => {
        try {
            setIsLoading(true);
            const data = await fetchPressReleases();
            setItems(data);
        } catch (error) {
            toast.error("Failed to load press releases");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleOpenModal = (item?: PressRelease) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                summary: item.summary,
                externalLink: item.externalLink || "",
                image: item.image || "",
                images: item.images || [],
                video: item.video || "",
                date: new Date(item.date).toISOString().split('T')[0],
                isPublished: item.isPublished
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: "",
                summary: "",
                externalLink: "",
                image: "",
                images: [],
                video: "",
                date: new Date().toISOString().split('T')[0],
                isPublished: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("mansara-token");
            if (!token) return;

            console.log('[Press] Submitting data:', formData); // Debug

            if (editingItem) {
                await updatePressRelease(editingItem._id, formData, token);
                toast.success("Press release updated successfully");
            } else {
                await createPressRelease(formData, token);
                toast.success("Press release created successfully");
            }
            setIsModalOpen(false);
            loadItems();
        } catch (error: any) {
            console.error('[Press] Submit error:', error); // Debug
            console.error('[Press] Error response:', error.response?.data); // Debug
            toast.error(error.message || "Failed to save press release");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this press release?")) return;
        try {
            const token = localStorage.getItem("mansara-token");
            if (!token) return;
            await deletePressRelease(id, token);
            toast.success("Press release deleted");
            loadItems();
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Press Releases</h1>
                        <p className="text-slate-600 mt-1">Manage news and press releases</p>
                    </div>
                    <Button onClick={() => handleOpenModal()} className="gap-2">
                        <Plus size={18} /> Add New Release
                    </Button>
                </div>

                <div className="bg-white rounded-lg border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Link</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                                </TableRow>
                            ) : items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">No press releases found.</TableCell>
                                </TableRow>
                            ) : (
                                items.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>
                                            {item.externalLink && (
                                                <a href={item.externalLink} target="_blank" rel="noopener" className="text-blue-500 hover:underline text-sm truncate max-w-[200px] block">
                                                    {item.externalLink}
                                                </a>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${item.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                                {item.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)}>
                                                    <Pencil size={16} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item._id)}>
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

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit Release" : "New Press Release"}</DialogTitle>
                        <DialogDescription>
                            {editingItem ? "Edit the details of the press release." : "Fill in the form to create a new press release."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cover Image</label>
                            <ImageUpload
                                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                                value={formData.image}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Gallery Images (Optional)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative group border rounded-lg overflow-hidden">
                                        <img src={img} alt={`Gallery ${index}`} className="w-full h-24 object-cover" />
                                        <button
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                images: prev.images.filter((_, i) => i !== index)
                                            }))}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                                <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center">
                                    <p className="text-xs text-slate-500 mb-2">Add Image</p>
                                    <ImageUpload
                                        onChange={(url) => {
                                            if (url) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    images: [...prev.images, url]
                                                }));
                                            }
                                        }}
                                        value=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Video URL</label>
                            <Input
                                value={formData.video}
                                onChange={(e) => setFormData(prev => ({ ...prev, video: e.target.value }))}
                                placeholder="https://www.youtube.com/..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="News headline"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Summary</label>
                            <textarea
                                className="w-full p-2 border rounded-md text-sm min-h-[100px]"
                                value={formData.summary}
                                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                                placeholder="Brief summary..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">External Link (Optional)</label>
                            <Input
                                value={formData.externalLink}
                                onChange={(e) => setFormData(prev => ({ ...prev, externalLink: e.target.value }))}
                                placeholder="https://news-site.com/article"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="published"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                className="rounded border-gray-300"
                            />
                            <label htmlFor="published" className="text-sm font-medium">Publish immediately</label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>{editingItem ? "Update" : "Create"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminPress;
