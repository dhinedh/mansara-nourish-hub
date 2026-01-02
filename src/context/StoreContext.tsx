import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchCombos, getCategories } from '@/lib/api';

// ========================================
// TYPES
// ========================================
export interface Product {
    id: string;
    slug: string;
    name: string;
    category: string;
    price: number;
    offerPrice?: number;
    image?: string;
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
}

export interface Combo {
    id: string;
    slug: string;
    name: string;
    products?: string[];
    originalPrice: number;
    comboPrice: number;
    image: string;
    description: string;
    isActive?: boolean;
}

export interface Category {
    id: string;
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

    // Actions
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    getProduct: (id: string) => Product | undefined;

    addCombo: (combo: Omit<Combo, 'id'>) => Promise<void>;
    updateCombo: (id: string, updates: Partial<Combo>) => Promise<void>;
    deleteCombo: (id: string) => Promise<void>;

    addCategory: (name: string) => void;
    refetch: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ========================================
// OPTIMIZED STORE CONTEXT
// ========================================

// Helper to normalize IDs
const normalizeId = (item: any) => ({
    ...item,
    id: item.id || item._id
});

// Helper to normalize category
const normalizeCategory = (item: any) => ({
    ...item,
    id: item.id || item._id,
    value: item.slug || item.value || item.name.toLowerCase(),
    slug: item.slug || item.name.toLowerCase().replace(/\s+/g, '-')
});

// Helper to get auth token
const getToken = () => localStorage.getItem('mansara-token');

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ========================================
    // LOAD DATA (WITH CACHING)
    // ========================================
    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Check cache first (5 minute cache)
            const cachedData = getCachedData();
            if (cachedData) {
                setProducts(cachedData.products);
                setCombos(cachedData.combos);
                setCategories(cachedData.categories);
                setIsLoading(false);
                console.log('[Store] ✓ Loaded from cache');

                // Fetch in background to update cache
                fetchAndCache();
                return;
            }

            // Fetch from API
            await fetchAndCache();

        } catch (err: any) {
            console.error('[Store] ✗ Load error:', err.message);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch and cache helper
    const fetchAndCache = async () => {
        const [productsData, combosData, categoriesData] = await Promise.all([
            fetchProducts().catch(e => { console.error('Products fetch error:', e); return []; }),
            fetchCombos().catch(e => { console.error('Combos fetch error:', e); return []; }),
            getCategories().catch(e => { console.error('Categories fetch error:', e); return []; })
        ]);

        console.log('[Store] Raw Data:', {
            products: Array.isArray(productsData) ? productsData.length : typeof productsData,
            combos: Array.isArray(combosData) ? combosData.length : typeof combosData,
            categories: Array.isArray(categoriesData) ? categoriesData.length : typeof categoriesData
        });

        const normalizedProducts = Array.isArray(productsData) ? productsData.map(normalizeId) : [];
        const normalizedCombos = Array.isArray(combosData) ? combosData.map(normalizeId) : [];
        const normalizedCategories = Array.isArray(categoriesData) ? categoriesData.map(normalizeCategory) : [];

        setProducts(normalizedProducts);
        setCombos(normalizedCombos);
        setCategories(normalizedCategories);

        // Cache data
        cacheData({
            products: normalizedProducts,
            combos: normalizedCombos,
            categories: normalizedCategories
        });

        console.log('[Store] ✓ Loaded from API');
    };

    // ========================================
    // CACHING HELPERS
    // ========================================
    const CACHE_KEY = 'mansara-store-cache';
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    const getCachedData = () => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);

            // Check if cache is still valid
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }

            // Cache expired
            return null;
        } catch {
            return null;
        }
    };

    const cacheData = (data: any) => {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('[Store] ✗ Cache save failed:', error);
        }
    };

    const clearCache = () => {
        localStorage.removeItem(CACHE_KEY);
    };

    // ========================================
    // INITIAL LOAD
    // ========================================
    useEffect(() => {
        loadData();
    }, [loadData]);

    // ========================================
    // PRODUCT ACTIONS
    // ========================================
    const addProduct = async (data: Omit<Product, 'id'>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Authentication required');

            const { createProduct } = await import('@/lib/api');
            const newProduct = await createProduct(data, token);

            setProducts(prev => [...prev, normalizeId(newProduct)]);
            clearCache();

            console.log('[Store] ✓ Product added');
        } catch (err: any) {
            console.error('[Store] ✗ Add product failed:', err.message);
            throw err;
        }
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Authentication required');

            const { updateProduct: apiUpdate } = await import('@/lib/api');
            const updated = await apiUpdate(id, updates, token);

            setProducts(prev => prev.map(p =>
                p.id === id ? normalizeId(updated) : p
            ));
            clearCache();

            console.log('[Store] ✓ Product updated');
        } catch (err: any) {
            console.error('[Store] ✗ Update product failed:', err.message);
            throw err;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Authentication required');

            const { deleteProduct: apiDelete } = await import('@/lib/api');
            await apiDelete(id, token);

            setProducts(prev => prev.filter(p => p.id !== id));
            clearCache();

            console.log('[Store] ✓ Product deleted');
        } catch (err: any) {
            console.error('[Store] ✗ Delete product failed:', err.message);
            throw err;
        }
    };

    const getProduct = useCallback((id: string) => {
        return products.find(p => p.id === id || p.slug === id);
    }, [products]);

    // ========================================
    // COMBO ACTIONS
    // ========================================
    const addCombo = async (data: Omit<Combo, 'id'>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Authentication required');

            const { createCombo } = await import('@/lib/api');
            const newCombo = await createCombo(data, token);

            setCombos(prev => [...prev, normalizeId(newCombo)]);
            clearCache();

            console.log('[Store] ✓ Combo added');
        } catch (err: any) {
            console.error('[Store] ✗ Add combo failed:', err.message);
            throw err;
        }
    };

    const updateCombo = async (id: string, updates: Partial<Combo>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Authentication required');

            const { updateCombo: apiUpdate } = await import('@/lib/api');
            const updated = await apiUpdate(id, updates, token);

            setCombos(prev => prev.map(c =>
                c.id === id ? normalizeId(updated) : c
            ));
            clearCache();

            console.log('[Store] ✓ Combo updated');
        } catch (err: any) {
            console.error('[Store] ✗ Update combo failed:', err.message);
            throw err;
        }
    };

    const deleteCombo = async (id: string) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Authentication required');

            const { deleteCombo: apiDelete } = await import('@/lib/api');
            await apiDelete(id, token);

            setCombos(prev => prev.filter(c => c.id !== id));
            clearCache();

            console.log('[Store] ✓ Combo deleted');
        } catch (err: any) {
            console.error('[Store] ✗ Delete combo failed:', err.message);
            throw err;
        }
    };

    // ========================================
    // CATEGORY ACTIONS
    // ========================================
    const addCategory = (name: string) => {
        const newCategory: Category = {
            id: crypto.randomUUID(),
            name,
            value: name.toLowerCase().replace(/\s+/g, '-'),
            slug: name.toLowerCase().replace(/\s+/g, '-')
        };
        setCategories(prev => [...prev, newCategory]);
    };

    // ========================================
    // REFETCH
    // ========================================
    const refetch = async () => {
        clearCache();
        await loadData();
    };

    return (
        <StoreContext.Provider value={{
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
            addCategory,
            refetch
        }}>
            {children}
        </StoreContext.Provider>
    );
};

// ========================================
// HOOK
// ========================================
export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};