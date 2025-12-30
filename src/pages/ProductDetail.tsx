import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/hooks/use-toast';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProduct } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const product = slug ? getProduct(slug) : undefined;

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
              <div className="lg:sticky lg:top-24">
                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50 border">
                  <img
                    src={product.image}
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
              </div>

              {/* Product Details - Scrollable */}
              <div className="flex flex-col gap-8">
                {/* 1. Name & Description */}
                <div>
                  <h1 className="text-3xl font-bold mb-4" style={{ color: '#1F2A7C' }}>
                    {product.name}
                  </h1>

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

                    <button
                      onClick={handleAddToCart}
                      disabled={adding || product.stock === 0}
                      className="flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-md disabled:opacity-50"
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
                {product.ingredients && (
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;