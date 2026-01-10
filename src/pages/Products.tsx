import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import PageHero from '@/components/layout/PageHero';
import { useContent } from '@/context/ContentContext';

const Products: React.FC = () => {
  const { products, isLoading, categories: storeCategories } = useStore();
  const { getBannersByPage } = useContent();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const categoryParam = searchParams.get('category');

  const items = getBannersByPage('products');

  // Combine static "All" with dynamic categories
  const displayCategories = [
    { id: 'all', name: 'All Products', value: 'all' },
    ...storeCategories.map(c => ({ id: c.id, name: c.name, value: c.value }))
  ];

  // Initialize selectedCategory from URL if present
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    let result = products;

    // Filter by Category
    if (selectedCategory !== 'all') {
      // Find the category object to get its ID
      const categoryObj = storeCategories.find(c => c.value === selectedCategory || c.slug === selectedCategory);

      if (categoryObj) {
        result = result.filter((p) => {
          // Handle both unpopulated (ID string) and populated (Object) category field
          const pCatId = p.category && typeof p.category === 'object' ? p.category?._id || p.category?.id : p.category;
          return pCatId === categoryObj.id || pCatId === categoryObj._id;
        });
      } else {
        // Fallback: If no category found (maybe data mismatch), try matching by string if p.category is slug (unlikely)
        // or just return empty/all? Better to return empty if category explicitly selected but not found.
        // But for now, let's assume if categoryObj is missing, maybe it's an ID passed as value?
        // Let's also check if selectedCategory matches p.category directly
        result = result.filter(p => p.category === selectedCategory);
      }
    }

    // Filter by Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        (typeof p.category === 'string' && p.category.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, products, searchQuery, storeCategories]);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Banner */}
        <PageHero pageKey="products" />

        {/* Promotional Banners */}
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto mt-8">
          {items.map((banner) => (
            <div key={banner.id} className="relative rounded-2xl overflow-hidden shadow-lg h-48 sm:h-64 cursor-pointer group">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6 text-white">
                <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-2">{banner.title}</h3>
                <p className="text-lg opacity-90">{banner.subtitle}</p>
                {banner.link && (
                  <a href={banner.link} className="mt-4 inline-block bg-white text-primary px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors">
                    Shop Now
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="md:w-64 flex-shrink-0">
              <div className="bg-card rounded-xl p-6 shadow-sm sticky top-24 border border-border/50">
                <h3 className="font-semibold mb-4 text-foreground">
                  Categories
                </h3>
                <div className="space-y-2">
                  {displayCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === category.value
                        ? 'font-semibold bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <p className="text-gray-600 mb-6">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No products found in this category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;