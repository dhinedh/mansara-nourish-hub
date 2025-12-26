import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import PageHero from '@/components/layout/PageHero';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'porridge-mixes', name: 'Porridge Mixes' },
  { id: 'oil-ghee', name: 'Oil & Ghee' }
];

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === selectedCategory));
    }
  }, [selectedCategory]);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Banner */}
        <PageHero pageKey="products" />

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
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === category.id
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