import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
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
    DialogDescription,
} from "@/components/ui/dialog";
import { Check, X, Trash2, MessageSquare } from "lucide-react";
import { fetchAllReviews, updateReviewStatus, deleteReview } from "@/lib/api";

interface Review {
    _id: string;
    user: { _id: string; name: string };
    product: { _id: string; name: string };
    rating: number;
    comment: string;
    images: string[];
    video: string;
    isApproved: boolean;
    isVerifiedPurchase: boolean;
    createdAt: string;
    adminResponse?: string;
}

const AdminReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [adminResponse, setAdminResponse] = useState("");

    const loadReviews = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("mansara-token");
            if (!token) return;
            const data = await fetchAllReviews(token);
            setReviews(data);
        } catch (error) {
            toast.error("Failed to load reviews");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const handleStatusUpdate = async (id: string, isApproved: boolean) => {
        try {
            const token = localStorage.getItem("mansara-token");
            if (!token) return;
            await updateReviewStatus(id, isApproved, null, token);
            toast.success(`Review ${isApproved ? 'approved' : 'rejected'}`);
            loadReviews();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            const token = localStorage.getItem("mansara-token");
            if (!token) return;
            await deleteReview(id, token);
            toast.success("Review deleted");
            loadReviews();
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    // Filter tabs could be added here (Pending, Approved, All)

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Product Reviews</h1>
                    <p className="text-slate-600 mt-1">Manage verified customer reviews</p>
                </div>

                <div className="bg-white rounded-lg border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
                                </TableRow>
                            ) : reviews.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">No reviews found.</TableCell>
                                </TableRow>
                            ) : (
                                reviews.map((review) => (
                                    <TableRow key={review._id}>
                                        <TableCell className="whitespace-nowrap">{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">{review.product?.name || 'Unknown Product'}</TableCell>
                                        <TableCell>{review.user?.name || 'Unknown User'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-yellow-500">
                                                <span className="font-bold mr-1">{review.rating}</span> ★
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs">
                                            <div className="truncate text-sm">{review.comment}</div>
                                            {(review.images.length > 0 || review.video) && (
                                                <div className="flex gap-1 mt-1">
                                                    {review.images.length > 0 && <span className="text-xs bg-slate-100 px-1 rounded">📷 {review.images.length}</span>}
                                                    {review.video && <span className="text-xs bg-slate-100 px-1 rounded">🎥</span>}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {review.isApproved ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Approved</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pending</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {!review.isApproved && (
                                                    <Button size="icon" variant="ghost" className="text-green-600 hover:bg-green-50" onClick={() => handleStatusUpdate(review._id, true)} title="Approve">
                                                        <Check size={16} />
                                                    </Button>
                                                )}
                                                {review.isApproved && (
                                                    <Button size="icon" variant="ghost" className="text-yellow-600 hover:bg-yellow-50" onClick={() => handleStatusUpdate(review._id, false)} title="Reject">
                                                        <X size={16} />
                                                    </Button>
                                                )}
                                                <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(review._id)} title="Delete">
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

export default AdminReviews;
