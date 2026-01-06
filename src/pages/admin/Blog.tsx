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
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";

interface BlogPost {
    _id: string;
    title: string;
    content: string;
    excerpt: string;
    image: string;
    isPublished: boolean;
    createdAt: string;
}

const AdminBlog = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        isPublished: true
    });

    const loadPosts = async () => {
        try {
            setIsLoading(true);
            const data = await fetchBlogPosts();
            setPosts(data);
        } catch (error) {
            toast.error("Failed to load blog posts");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleOpenModal = (post?: BlogPost) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                image: post.image,
                isPublished: post.isPublished
            });
        } else {
            setEditingPost(null);
            setFormData({
                title: "",
                excerpt: "",
                content: "",
                image: "",
                isPublished: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("mansara-token");
            if (!token) return;

            if (editingPost) {
                await updateBlogPost(editingPost._id, formData, token);
                toast.success("Blog post updated successfully");
            } else {
                await createBlogPost(formData, token);
                toast.success("Blog post created successfully");
            }
            setIsModalOpen(false);
            loadPosts();
        } catch (error) {
            toast.error("Failed to save blog post");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            const token = localStorage.getItem("mansara-token");
            if (!token) return;
            await deleteBlogPost(id, token);
            toast.success("Blog post deleted");
            loadPosts();
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Blog Management</h1>
                        <p className="text-slate-600 mt-1">Manage blog posts and articles</p>
                    </div>
                    <Button onClick={() => handleOpenModal()} className="gap-2">
                        <Plus size={18} /> Add New Post
                    </Button>
                </div>

                <div className="bg-white rounded-lg border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                                </TableRow>
                            ) : posts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">No blog posts found.</TableCell>
                                </TableRow>
                            ) : (
                                posts.map((post) => (
                                    <TableRow key={post._id}>
                                        <TableCell>
                                            {post.image ? (
                                                <img src={post.image} alt={post.title} className="w-10 h-10 object-cover rounded" />
                                            ) : (
                                                <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
                                                    <FileText size={16} className="text-slate-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{post.title}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                                {post.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(post)}>
                                                    <Pencil size={16} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(post._id)}>
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
                        <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
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
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter post title"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Excerpt</label>
                            <Input
                                value={formData.excerpt}
                                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                placeholder="Short summary for listing"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content</label>
                            <textarea
                                className="w-full min-h-[200px] p-3 rounded-md border text-sm"
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Write your post content here (Markdown or HTML)..."
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
                        <Button onClick={handleSubmit}>{editingPost ? "Update" : "Create"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminBlog;
