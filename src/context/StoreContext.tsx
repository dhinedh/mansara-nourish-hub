import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchCombos, getCategories } from '@/lib/api';
import {
    products as staticProducts,
    categories as staticCategories,
    combos as staticCombos
} from '@/data/products';

// ========================================
// REFACTORED STORE CONTEXT - API FIRST
// ========================================

export interface Product {
    id: string;
    _id?: string;
    slug: string;
    name: string;
    category: string;
    categoryId?: string;
    price: number;
    offerPrice?: number;
    originalPrice?: number;
    image?: string;
    images?: string[];
    video?: string;
    description?: string;
    ingredients?: string;
    howToUse?: string;
    storage?: string;
    weight?: string;
    isOffer: boolean;
    isNewArrival: boolean;
    isFeatured: boolean;
    isActive: boolean;
    stock: number;
    highlights?: string[];
    nutrition?: string;
    compliance?: string;
    sub_category?: string;
    short_description?: string;
    rating?: number;
    numReviews?: number;
    variants?: {
        weight: string;
        price: number;
        offerPrice?: number;
        originalPrice?: number;
        stock?: number;
        sku?: string;
    }[];
}

export interface Combo {
    id: string;
    slug: string;
    name: string;
    products?: string[];
    originalPrice: number;
    comboPrice: number;
    image: string;
    images?: string[];
    description: string;
    isActive?: boolean;
    stock?: number;
}

export interface Category {
    id: string;
    _id?: string;
    name: string;
    value: string;
    slug: string;
}

interface StoreContextType {
    products: Product[];
    combos: Combo[];
    categories: Category[];
    isLoading: boolean;
    error: string | null;

    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    getProduct: (id: string) => Product | undefined;

    addCombo: (combo: Omit<Combo, 'id'>) => Promise<void>;
    updateCombo: (id: string, updates: Partial<Combo>) => Promise<void>;
    deleteCombo: (id: string) => Promise<void>;

    addCategory: (name: string) => void;
    refetch: () => Promise<void>;
    getCategoryIdBySlug: (slug: string) => string | undefined;
    updateLocalStock: (id: string, newStock: number) => void;
    getCombo: (id: string) => Combo | undefined;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ========================================
// HELPER FUNCTIONS
// ========================================

const normalizeId = (item: any) => ({
    ...item,
    id: item.id || item._id
});

const normalizeCategory = (item: any) => ({
    ...item,
    id: item.id || item._id,
    value: item.slug || item.value || item.name.toLowerCase(),
    slug: item.slug || item.value || item.name.toLowerCase()
});

const extractArray = (data: any, key: string): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data[key] && Array.isArray(data[key])) return data[key];
    const possibleKeys = [key, `${key}s`, 'data', 'items'];
    for (const k of possibleKeys) {
        if (data[k] && Array.isArray(data[k])) return data[k];
    }
    return [];
};

const getToken = () => localStorage.getItem('mansara-token') || '';

const CACHE_KEY = 'mansara-store-cache-v3'; // Bumped version

// ========================================
// STORE PROVIDER
// ========================================

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [categories, setCategories] = useState<Category[]>(staticCategories as any);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(CACHE_KEY);
        if (saved) {
            try {
                const { products: p, combos: c, categories: cat } = JSON.parse(saved);
                if (p) setProducts(p);
                if (c) setCombos(c);
                if (cat) setCategories(cat);
                setIsLoading(false);
            } catch (e) {
                console.error('[Store] Failed to load cache:', e);
            }
        }
    }, []);

    const fetchData = useCallback(async (forceRefresh = false) => {
        if (products.length === 0) setIsLoading(true);
        setError(null);

        try {
            console.log('[Store] Fetching fresh data...');
            const [productsData, combosData, categoriesData] = await Promise.all([
                fetchProducts(forceRefresh),
                fetchCombos(forceRefresh),
                getCategories(forceRefresh)
            ]);

            const apiProducts = extractArray(productsData, 'products').map(normalizeId);
            const apiCombos = extractArray(combosData, 'combos').map(normalizeId);
            const apiCategories = extractArray(categoriesData, 'categories').map(normalizeCategory);

            // 1. Categories Merge
            const mergedCategories = [...staticCategories];
            apiCategories.forEach(apiCat => {
                const index = mergedCategories.findIndex(c => c.slug === apiCat.slug || c.id === apiCat.id);
                if (index >= 0) {
                    mergedCategories[index] = { ...mergedCategories[index], ...apiCat };
                } else {
                    mergedCategories.push(apiCat);
                }
            });

            // 2. Products Merge (API First)
            const resolvedProducts = apiProducts.map(apiP => {
                const staticP = staticProducts.find(p => p.slug === apiP.slug);

                // Robust Pricing Normalization
                const normalizePrice = (p: any) => {
                    const price = p.price || 0;
                    const offerPrice = p.offerPrice;
                    const originalPrice = p.originalPrice;

                    // Truth: If originalPrice exists and is higher than price, it's a discount
                    // If offerPrice exists and is lower than price, it's a discount (legacy)
                    const mrp = originalPrice || (offerPrice && offerPrice < price ? price : price);
                    const selling = offerPrice || price;

                    return {
                        ...p,
                        price: selling,
                        offerPrice: selling < mrp ? selling : undefined,
                        originalPrice: mrp
                    };
                };

                const merged = {
                    ...(staticP || {}),
                    ...apiP,
                    variants: (apiP.variants || staticP?.variants || []).map(normalizePrice)
                };

                return normalizePrice(merged);
            });

            // 3. Combos Merge
            const resolvedCombos = apiCombos.map(apiC => {
                const staticC = staticCombos.find(c => c.slug === apiC.slug);
                return {
                    ...(staticC || {}),
                    ...apiC
                };
            });

            setProducts(resolvedProducts);
            setCombos(resolvedCombos);
            setCategories(mergedCategories);

            // Persist
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                products: resolvedProducts,
                combos: resolvedCombos,
                categories: mergedCategories
            }));

            setIsLoading(false);
        } catch (err: any) {
            console.error('[Store] Fetch error:', err);
            setError(err.message);
            setIsLoading(false);
        }
    }, [products.length]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(true), 600000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const getCategoryIdBySlug = useCallback((slug: string) => {
        return categories.find(c => c.slug === slug || c.value === slug)?.id;
    }, [categories]);

    const addProduct = async (productData: any) => {
        try {
            const token = getToken();
            const { createProduct } = await import('@/lib/api');

            // Convert category slug to ID if needed
            let categoryToSend = productData.category;
            if (productData.category && !productData.category.match(/^[0-9a-fA-F]{24}$/)) {
                const categoryId = getCategoryIdBySlug(productData.category);
                if (categoryId) categoryToSend = categoryId;
            }

            const dataWithId = { ...productData, category: categoryToSend };
            await createProduct(dataWithId, token);
            await fetchData(true);
        } catch (err: any) {
            console.error('[Store] Add product failed:', err);
            throw err;
        }
    };

    const updateProduct = async (id: string, updates: any) => {
        try {
            const token = getToken();
            const { updateProduct: apiUpdate } = await import('@/lib/api');

            // Convert category slug to ID if needed
            let updatesToSend = { ...updates };
            if (updates.category && !updates.category.match(/^[0-9a-fA-F]{24}$/)) {
                const categoryId = getCategoryIdBySlug(updates.category);
                if (categoryId) updatesToSend.category = categoryId;
            }

            // Optimistic update
            setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

            await apiUpdate(id, updatesToSend, token);
            await fetchData(true);
        } catch (err: any) {
            console.error('[Store] Update product failed:', err);
            throw err;
        }
    };

    const deleteProduct = async (id: string) => {
        const token = getToken();
        setProducts(prev => prev.filter(p => p.id !== id));
        const { deleteProduct: apiDelete } = await import('@/lib/api');
        await apiDelete(id, token);
        await fetchData(true);
    };

    const getProduct = (id: string) => products.find(p => p.id === id || p._id === id || p.slug === id);

    const addCombo = async (data: any) => {
        const token = getToken();
        const { createCombo } = await import('@/lib/api');
        await createCombo(data, token);
        await fetchData(true);
    };

    const updateCombo = async (id: string, updates: any) => {
        const token = getToken();
        const { updateCombo: apiUpdate } = await import('@/lib/api');
        await apiUpdate(id, updates, token);
        await fetchData(true);
    };

    const deleteCombo = async (id: string) => {
        const token = getToken();
        const { deleteCombo: apiDelete } = await import('@/lib/api');
        await apiDelete(id, token);
        await fetchData(true);
    };

    const getCombo = (id: string) => combos.find(c => c.id === id || c.slug === id);

    const updateLocalStock = (id: string, newStock: number) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    };

    const value = {
        products,
        combos,
        categories,
        isLoading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        addCombo,
        updateCombo,
        deleteCombo,
        addCategory: (name: string) => { }, // Not implemented
        refetch: () => fetchData(true),
        getCategoryIdBySlug,
        updateLocalStock,
        getCombo
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error('useStore must be used within a StoreProvider');
    return context;
};