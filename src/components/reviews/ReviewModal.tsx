import React, { useState, useEffect } from 'react';
import { Star, Upload, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createReview, checkReviewEligibility, uploadImage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string | null;
    productName: string;
    productImage: string;
    onReviewSubmitted?: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
    isOpen,
    onClose,
    productId,
    productName,
    productImage,
    onReviewSubmitted
}) => {
    // Fix: Access token immediately from localStorage to avoid context type issues
    const token = localStorage.getItem('mansara-token');

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [checking, setChecking] = useState(true);
    const [canReview, setCanReview] = useState(false);
    const [eligibilityMessage, setEligibilityMessage] = useState('');

    useEffect(() => {
        if (isOpen && productId) {
            if (token) {
                checkEligibility();
            } else {
                setCanReview(false);
                setEligibilityMessage('Please login to review.');
                setChecking(false);
            }
        } else {
            // Reset state when closed
            setRating(0);
            setComment('');
            setImages([]);
            setCanReview(false);
            setEligibilityMessage('');
        }
    }, [isOpen, productId, token]);

    const checkEligibility = async () => {
        if (!productId || !token) return;

        setChecking(true);
        try {
            const result = await checkReviewEligibility(productId, token);
            setCanReview(result.canReview);
            if (!result.canReview) {
                setEligibilityMessage(result.message || 'You are not eligible to review this product.');
            }
        } catch (error) {
            console.error(error);
            setCanReview(false);
            setEligibilityMessage('Failed to verify review eligibility.');
        } finally {
            setChecking(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        if (images.length >= 3) {
            toast.error("You can upload a maximum of 3 images");
            return;
        }

        setUploading(true);
        try {
            const file = e.target.files[0];
            const data = await uploadImage(file);
            setImages(prev => [...prev, data.url]);
            toast.success("Image uploaded!");
        } catch (error) {
            toast.error("Failed to upload image");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (comment.trim().length < 10) {
            toast.error("Please write a review with at least 10 characters");
            return;
        }

        if (!productId || !token) {
            toast.error("Authentication required");
            return;
        }

        setSubmitting(true);
        try {
            await createReview({
                productId,
                rating,
                comment,
                images
            }, token);

            toast.success("Review submitted successfully!");
            if (onReviewSubmitted) onReviewSubmitted();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                        Share your experience with {productName}
                    </DialogDescription>
                </DialogHeader>

                {checking ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : !canReview ? (
                    <div className="py-6 text-center">
                        <p className="text-muted-foreground mb-4">{eligibilityMessage}</p>
                        <Button variant="outline" onClick={onClose}>Close</Button>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {/* Product Info */}
                        <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg">
                            <img
                                src={productImage}
                                alt={productName}
                                className="w-12 h-12 object-cover rounded bg-white"
                            />
                            <p className="font-medium text-sm line-clamp-2">{productName}</p>
                        </div>

                        {/* Star Rating */}
                        <div className="flex flex-col items-center gap-2">
                            <label className="text-sm font-medium text-muted-foreground">Rate this product</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            className={`w-8 h-8 ${(hoverRating || rating) >= star
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-slate-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm font-medium h-5 text-primary">
                                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hoverRating || rating]}
                            </p>
                        </div>

                        {/* Comment */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Your Review</label>
                            <Textarea
                                placeholder="What did you like or dislike?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[100px] resize-none"
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {comment.length}/1000 characters
                            </p>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Add Photos (Optional)</label>
                            <div className="flex gap-3 flex-wrap">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative w-16 h-16 border rounded overflow-hidden group">
                                        <img src={img} alt="Review" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-0 right-0 bg-black/50 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                {images.length < 3 && (
                                    <label className="w-16 h-16 border border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                                        {uploading ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                                                <span className="text-[10px] text-muted-foreground">Add</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="outline" onClick={onClose} disabled={submitting}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={submitting || rating === 0}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Review
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ReviewModal;
