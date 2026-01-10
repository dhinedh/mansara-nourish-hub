import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Check, Star, Image as ImageIcon, Zap } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchProductReviews, checkReviewEligibility, createReview } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ImageUpload from "@/components/admin/ImageUpload";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProduct } = useStore();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const [reviews, setReviews] = useState<any[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    images: [] as string[],
    video: ""
  });

  const product = slug ? getProduct(slug) : undefined;

  // Update selected image when product loads
  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      loadReviews();
      if (user) {
        checkEligibility();
      }
    }
  }, [product, user]);

  const loadReviews = async () => {
    if (!product) return;
    try {
      const data = await fetchProductReviews(product._id);
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews');
    }
  };

  const checkEligibility = async () => {
    if (!product) return;
    const token = localStorage.getItem("mansara-token");
    if (!token) return;
    try {
      const data = await checkReviewEligibility(product._id, token);
      setCanReview(data.canReview);
    } catch (error) {
      console.error('Failed to check eligibility');
    }
  };

  const handleSubmitReview = async () => {
    if (!product) return;
    const token = localStorage.getItem("mansara-token");
    if (!token) return;

    try {
      setIsReviewLoading(true);
      await createReview({ ...reviewForm, productId: product._id }, token);
      toast({ title: "Review submitted!", description: "Your review is pending approval." });
      setIsReviewModalOpen(false);
      setCanReview(false); // Disable until next purchase? Or just hide button
      loadReviews();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsReviewLoading(false);
    }
  };

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Link to="/products">
            <Button style={{ backgroundColor: '#FDB913', color: '#1F2A7C' }}>
              Browse Products
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart(product as any, 'product');
      }
      setQuantity(1);
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
      toast({
        title: "Added to cart!",
        description: `${quantity}x ${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    setAdding(false);
  };

  const handleBuyNow = async () => {
    if (!product) return;

    // Check stock
    if (product.stock <= 0) {
      toast({
        title: "Out of stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }

    try {
      for (let i = 0; i < quantity; i++) {
        addToCart(product as any, 'product');
      }
      navigate('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to process buy now request.",
        variant: "destructive",
      });
    }
  };

  const displayPrice = product.offerPrice || product.price;
  const hasDiscount = product.offerPrice && product.offerPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.offerPrice!) / product.price) * 100)
    : 0;

  return (
    <Layout>
      <div className="min-h-screen" style={{ backgroundColor: '#FFFDF7' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 items-start">
              {/* Product Image - Sticky */}
              {/* Product Image Gallery - Sticky */}
              <div className="lg:sticky lg:top-24 space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border">
                  <img
                    src={selectedImage || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('placeholder')) {
                        target.src = "https://placehold.co/800x800/f5f5f5/999999?text=Product+Image";
                      }
                    }}
                  />
                </div>
                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === img ? 'border-[#1F2A7C]' : 'border-transparent hover:border-gray-300'
                          }`}
                      >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details - Scrollable */}
              <div className="flex flex-col gap-8">
                {/* 1. Name & Description */}
                <div>
                  <h1 className="text-3xl font-bold mb-2" style={{ color: '#1F2A7C' }}>
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} fill={i < (product.rating || 0) ? "currentColor" : "none"} className={i < (product.rating || 0) ? "" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.numReviews || 0} reviews)</span>
                  </div>

                  {product.short_description && (
                    <p className="text-gray-700 italic mb-4">
                      {product.short_description}
                    </p>
                  )}

                  {product.description && (
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-4xl font-bold" style={{ color: '#1F2A7C' }}>
                      ₹{displayPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          ₹{product.price.toFixed(2)}
                        </span>
                        <span
                          className="px-2 py-1 text-sm font-bold rounded"
                          style={{ backgroundColor: '#FFF2CC', color: '#1F2A7C' }}
                        >
                          {discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {product.weight && (
                    <p className="text-gray-600 mb-4">
                      <span className="font-semibold" style={{ color: '#1F2A7C' }}>Weight:</span> {product.weight}
                    </p>
                  )}

                  {product.stock > 0 && (
                    <p className="text-sm text-gray-500 mb-4">
                      {product.stock < 10 ? `Only ${product.stock} left in stock!` : 'In Stock'}
                    </p>
                  )}

                  {/* Quantity & Add to Cart */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-100 transition-colors"
                        disabled={adding}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="px-6 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-3 hover:bg-gray-100 transition-colors"
                        disabled={adding}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col flex-1 gap-3">
                      <button
                        onClick={handleAddToCart}
                        disabled={adding || product.stock === 0}
                        className="w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-md disabled:opacity-50"
                        style={{ backgroundColor: addSuccess ? '#4CAF50' : '#FDB913', color: '#1F2A7C' }}
                      >
                        {addSuccess ? (
                          <>
                            <Check className="w-5 h-5" />
                            Added to Cart!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5" />
                            {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleBuyNow}
                        disabled={adding || product.stock === 0}
                        className="w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-md disabled:opacity-50 text-white hover:bg-slate-800"
                        style={{ backgroundColor: '#000000' }}
                      >
                        <Zap className="w-5 h-5 fill-current" />
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Key Highlights */}
                {product.highlights && product.highlights.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2" style={{ color: '#1F2A7C', borderColor: 'rgba(31, 42, 124, 0.1)' }}>
                      Key Highlights
                    </h2>
                    <ul className="list-disc pl-5 space-y-2">
                      {product.highlights.map((highlight, index) => (
                        <li key={index} className="text-gray-700">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* 3. Ingredients */}
                {product.ingredients && typeof product.ingredients === 'string' && (
                  <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2" style={{ color: '#1F2A7C', borderColor: 'rgba(31, 42, 124, 0.1)' }}>
                      Ingredients
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {product.ingredients.split(',').map((item, i) => (
                        <span key={i} className="block mb-1">• {item.trim()}</span>
                      ))}
                    </p>
                  </section>
                )}

                {/* 4. How to prepare */}
                {product.howToUse && (
                  <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2" style={{ color: '#1F2A7C', borderColor: 'rgba(31, 42, 124, 0.1)' }}>
                      How to Prepare
                    </h2>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line pl-1">
                      {product.howToUse}
                    </div>
                  </section>
                )}

                {/* 5. Nutrition */}
                {product.nutrition && (
                  <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2" style={{ color: '#1F2A7C', borderColor: 'rgba(31, 42, 124, 0.1)' }}>
                      Nutrition
                    </h2>
                    <p className="text-gray-700">{product.nutrition}</p>
                  </section>
                )}

                {/* 6. Storage */}
                {product.storage && (
                  <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2" style={{ color: '#1F2A7C', borderColor: 'rgba(31, 42, 124, 0.1)' }}>
                      Storage & Shelf Life
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.storage.split('\n').map((line, i) => (
                        line.trim() ? <span key={i} className="block mb-1">• {line.trim()}</span> : null
                      ))}
                    </p>
                  </section>
                )}

                {/* 7. Compliance */}
                {product.compliance && (
                  <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2" style={{ color: '#1F2A7C', borderColor: 'rgba(31, 42, 124, 0.1)' }}>
                      Compliance Details
                    </h2>
                    <p className="text-gray-700">{product.compliance}</p>
                  </section>
                )}

                <div className="p-4 rounded-lg mt-4" style={{ backgroundColor: '#FFF2CC' }}>
                  <h3 className="font-semibold mb-2" style={{ color: '#1F2A7C' }}>
                    The MANSARA Promise
                  </h3>
                  <p className="text-sm text-gray-700">
                    Pure ingredients, honest food, no shortcuts. Every product is made with care,
                    transparency, and a commitment to your wellness.
                  </p>
                </div>

                {/* Reviews Section */}
                <section className="mt-12 border-t pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold" style={{ color: '#1F2A7C' }}>Customer Reviews</h2>
                    {canReview && (
                      <Button onClick={() => setIsReviewModalOpen(true)}>Write a Review</Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {reviews.length === 0 ? (
                      <p className="text-gray-500 italic">No reviews yet.</p>
                    ) : (
                      reviews.map((review) => (
                        <div key={review._id} className="border-b pb-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{review.user?.name || 'Customer'}</span>
                              {review.isVerifiedPurchase && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Check size={10} /> Verified Purchase
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-yellow-500 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                            ))}
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>

                          {(review.images.length > 0 || review.video) && (
                            <div className="flex gap-2 overflow-x-auto">
                              {review.images.map((img: string, idx: number) => (
                                <img key={idx} src={img} alt="Review" className="w-20 h-20 object-cover rounded-lg border" />
                              ))}
                              {review.video && (
                                <a href={review.video} target="_blank" rel="noopener noreferrer" className="w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center text-blue-600 hover:bg-gray-200">
                                  Video
                                </a>
                              )}
                            </div>
                          )}

                          {review.adminResponse && (
                            <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm border-l-4 border-blue-500">
                              <p className="font-semibold text-blue-900 mb-1">Response from Mansara:</p>
                              <p className="text-gray-700">{review.adminResponse}</p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with this product.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-2 mb-4">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                    className={`transition-colors ${reviewForm.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    <Star size={32} fill={reviewForm.rating >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Review</label>
              <textarea
                className="w-full p-2 border rounded-md min-h-[100px]"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="What did you like or dislike?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Add Images (Optional)</label>
              <div className="flex gap-2 flex-wrap">
                {reviewForm.images.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16">
                    <img src={img} className="w-full h-full object-cover rounded" />
                    <button
                      onClick={() => setReviewForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center text-[10px]"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="w-16 h-16 border border-dashed rounded flex items-center justify-center">
                  <ImageUpload
                    onChange={(url) => {
                      if (url) setReviewForm(prev => ({ ...prev, images: [...prev.images, url] }));
                    }}
                    value=""
                    hidePreview
                  >
                    <ImageIcon size={20} className="text-gray-400" />
                  </ImageUpload>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL (Optional)</label>
              <Input
                value={reviewForm.video}
                onChange={(e) => setReviewForm(prev => ({ ...prev, video: e.target.value }))}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitReview} disabled={isReviewLoading} className="bg-[#1F2A7C] text-white">
              {isReviewLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ProductDetail;