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
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import { fetchCareers, createCareer, updateCareer, deleteCareer } from "@/lib/api";

interface Career {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    isActive: boolean;
}

const AdminCareers = () => {
    const [items, setItems] = useState<Career[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Career | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        department: "",
        location: "Remote",
        type: "Full-time",
        description: "",
        isActive: true
    });

    const loadItems = async () => {
        try {
            setIsLoading(true);
            const data = await fetchCareers();
            setItems(data);
        } catch (error) {
            toast.error("Failed to load careers");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleOpenModal = (item?: any) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                department: item.department,
                location: item.location,
                type: item.type,
                description: item.description,
                isActive: item.isActive
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: "",
                department: "",
                location: "Remote",
                type: "Full-time",
                description: "",
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("mansara-token");
            if (!token) return;

            if (editingItem) {
                await updateCareer(editingItem._id, formData, token);
                toast.success("Job updated successfully");
            } else {
                await createCareer(formData, token);
                toast.success("Job posted successfully");
            }
            setIsModalOpen(false);
            loadItems();
        } catch (error) {
            toast.error("Failed to save job");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        try {
            const token = localStorage.getItem("mansara-token");
            if (!token) return;
            await deleteCareer(id, token);
            toast.success("Job deleted");
            loadItems();
        } catch (error) {
            toast.error("Failed to delete job");
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Careers</h1>
                        <p className="text-slate-600 mt-1">Manage job openings</p>
                    </div>
                    <Button onClick={() => handleOpenModal()} className="gap-2">
                        <Plus size={18} /> Add New Job
                    </Button>
                </div>

                <div className="bg-white rounded-lg border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Job Title</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                                </TableRow>
                            ) : items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">No job openings found.</TableCell>
                                </TableRow>
                            ) : (
                                items.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>{item.department}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.location}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                                {item.isActive ? 'Active' : 'Closed'}
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
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit Job" : "Post New Job"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Job Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Department</label>
                                <Input
                                    value={formData.department}
                                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border text-sm"
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                >
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                className="w-full min-h-[150px] p-3 rounded-md border text-sm"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Job description and requirements..."
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="active"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="rounded border-gray-300"
                            />
                            <label htmlFor="active" className="text-sm font-medium">Job is Active</label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>{editingItem ? "Update" : "Post"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminCareers;
