import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchCombos, getCategories } from '@/lib/api';
import {
    products as staticProducts,
    categories as staticCategories,
    combos as staticCombos
} from '@/data/products';
import { fallbackProducts } from '@/data/fallbackProducts';

import { sortInStockFirst } from '@/lib/utils';

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

const CACHE_KEY = 'mansara-store-cache-v6'; // Bumped version to force cache invalidation

// ========================================
// STORE PROVIDER
// ========================================

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(sortInStockFirst(fallbackProducts as any));
    const [combos, setCombos] = useState<Combo[]>(staticCombos as any);
    const [categories, setCategories] = useState<Category[]>(staticCategories as any);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(CACHE_KEY);
        if (saved) {
            try {
                const { products: p, combos: c, categories: cat } = JSON.parse(saved);
                if (p && p.length > 0) setProducts(sortInStockFirst(p));
                if (c && c.length > 0) setCombos(c);
                if (cat && cat.length > 0) setCategories(cat);
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

            // 2. Products Merge (API First, but clean local descriptions, images & names take priority over generic/empty DB fallbacks)
            const resolvedProducts = apiProducts.map(apiP => {
                const staticP = staticProducts.find(p =>
                    p.slug === apiP.slug ||
                    p.slug === apiP.slug.replace(/-250g$/, '') ||
                    `${p.slug}-250g` === apiP.slug
                );

                const cleanStaticP: any = staticP ? { ...staticP } : {};
                delete cleanStaticP.price;
                delete cleanStaticP.offerPrice;
                delete cleanStaticP.originalPrice;

                // Ensure non-empty arrays and strings don't get erased by blank API values
                const safeImages = (Array.isArray(apiP.images) && apiP.images.length > 0)
                    ? apiP.images
                    : (cleanStaticP.images || (apiP.image ? [apiP.image] : []));

                const safeDescription = (apiP.description && apiP.description.trim().length > 0 && !apiP.description.includes('Authentic South Indian health mix product prepared in Chennai using traditional slow-roasting'))
                    ? apiP.description
                    : (cleanStaticP.description || '');

                const safeIngredients = (apiP.ingredients && apiP.ingredients.trim().length > 0)
                    ? apiP.ingredients
                    : (cleanStaticP.ingredients || '');

                const safeHowToUse = (apiP.howToUse && apiP.howToUse.trim().length > 0)
                    ? apiP.howToUse
                    : (cleanStaticP.howToUse || '');

                const safeStorage = (apiP.storage && apiP.storage.trim().length > 0)
                    ? apiP.storage
                    : (cleanStaticP.storage || '');

                const safeHighlights = (Array.isArray(apiP.highlights) && apiP.highlights.length > 0)
                    ? apiP.highlights
                    : (cleanStaticP.highlights || []);

                const safeShortDesc = (apiP.short_description && apiP.short_description.trim().length > 0)
                    ? apiP.short_description
                    : (cleanStaticP.short_description || '');

                if (apiP.name === 'Rice Podi Mix') {
                    apiP.name = 'Home Style Paruppu Podi';
                }

                // Robust Pricing Normalization
                const normalizePrice = (p: any) => {
                    const price = p.price || 0;
                    const offerPrice = p.offerPrice;
                    const defaultMrp = cleanStaticP.originalPrice || (price > 100 ? 195 : 75);
                    const originalPrice = p.originalPrice || defaultMrp;

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
                    ...cleanStaticP,
                    ...apiP,
                    images: safeImages,
                    description: safeDescription,
                    ingredients: safeIngredients,
                    howToUse: safeHowToUse,
                    storage: safeStorage,
                    highlights: safeHighlights,
                    short_description: safeShortDesc,
                    variants: (apiP.variants && apiP.variants.length > 0 ? apiP.variants : (staticP?.variants || [])).map(normalizePrice)
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

            const sortedProducts = sortInStockFirst(resolvedProducts);
            setProducts(sortedProducts);
            setCombos(resolvedCombos);
            setCategories(mergedCategories);

            // Persist
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                products: sortedProducts,
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

    const getProduct = (id: string) => {
        if (!id) return undefined;
        const direct = products.find(p => p.id === id || p._id === id || p.slug === id);
        if (direct) return direct;

        const with250g = id.endsWith('-250g') ? id : `${id}-250g`;
        const without250g = id.replace(/-250g$/, '');

        const suffixMatch = products.find(p => p.slug === with250g || p.slug === without250g);
        if (suffixMatch) return suffixMatch;

        return staticProducts.find(p =>
            p.id === id ||
            p._id === id ||
            p.slug === id ||
            p.slug === with250g ||
            p.slug === without250g
        );
    };

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