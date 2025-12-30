import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProducts, fetchCombos, uploadImage } from '@/lib/api';

// --- Types ---
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
    // Keeping some legacy optional fields just in case to prevent immediate breaks, but preferring above
    short_description?: string;
    sub_category?: string;
}

export interface Combo {
    id: string;
    slug: string;
    name: string;
    products?: string[]; // IDs
    originalPrice: number;
    comboPrice: number;
    image: string;
    description: string;
    // Legacy support
    isActive?: boolean;
}

export interface Category {
    id: string;
    name: string;
    value: string; // value to match backend enum
}

interface StoreContextType {
    products: Product[];
    combos: Combo[];
    categories: Category[];

    isLoading: boolean;
    error: string | null;

    // Product Actions
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    getProduct: (id: string) => Product | undefined;

    // Combo Actions
    addCombo: (combo: Omit<Combo, 'id'>) => Promise<void>;
    updateCombo: (id: string, updates: Partial<Combo>) => Promise<void>;
    deleteCombo: (id: string) => Promise<void>;

    // Category Actions (Still local likely, or derived)
    addCategory: (name: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_CATEGORIES: Category[] = [];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load Data from API
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                // Dynamic import to avoid circular dep issues if any, though explicit import is fine too
                const { fetchProducts, fetchCombos, getCategories } = await import('@/lib/api');

                const [productsData, combosData, categoriesData] = await Promise.all([
                    fetchProducts(),
                    fetchCombos(),
                    getCategories()
                ]);

                const mapId = (item: any) => ({ ...item, id: item.id || item._id });

                const mapCategory = (item: any) => ({
                    ...item,
                    id: item.id || item._id,
                    value: item.slug || item.value // Ensure value exists for frontend compatibility
                });

                setProducts(productsData.map(mapId));
                setCombos(combosData.map(mapId));
                setCategories(categoriesData.map(mapCategory));
            } catch (err: any) {
                console.error("Failed to load store data:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    // --- Actions ---

    // Helper to get token
    const getToken = () => localStorage.getItem('mansara-token');

    const addProduct = async (data: Omit<Product, 'id'>) => {
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication required");
            const { createProduct } = await import('@/lib/api');
            const newProduct = await createProduct(data, token);
            setProducts([...products, { ...newProduct, id: newProduct._id || newProduct.id }]);
        } catch (err: any) {
            console.error("Failed to add product:", err);
            setError(err.message);
            throw err;
        }
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication required");
            const { updateProduct } = await import('@/lib/api');
            const updated = await updateProduct(id, updates, token);
            const mapId = (item: any) => ({ ...item, id: item._id || item.id });
            setProducts(products.map(p => p.id === id ? mapId(updated) : p));
        } catch (err: any) {
            console.error("Failed to update product:", err);
            setError(err.message);
            throw err;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication required");
            const { deleteProduct } = await import('@/lib/api');
            await deleteProduct(id, token);
            setProducts(products.filter(p => p.id !== id));
        } catch (err: any) {
            console.error("Failed to delete product:", err);
            setError(err.message);
            throw err;
        }
    };

    const getProduct = (id: string) => products.find(p => p.id === id || p.slug === id);

    const addCombo = async (data: Omit<Combo, 'id'>) => {
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication required");
            const { createCombo } = await import('@/lib/api');
            const newCombo = await createCombo(data, token);
            setCombos([...combos, { ...newCombo, id: newCombo._id || newCombo.id }]);
        } catch (err: any) {
            console.error("Failed to add combo:", err);
            setError(err.message);
            throw err;
        }
    };

    const updateCombo = async (id: string, updates: Partial<Combo>) => {
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication required");
            const { updateCombo } = await import('@/lib/api');
            const updated = await updateCombo(id, updates, token);
            const mapId = (item: any) => ({ ...item, id: item._id || item.id });
            setCombos(combos.map(c => c.id === id ? mapId(updated) : c));
        } catch (err: any) {
            console.error("Failed to update combo:", err);
            setError(err.message);
            throw err;
        }
    };

    const deleteCombo = async (id: string) => {
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication required");
            const { deleteCombo } = await import('@/lib/api');
            await deleteCombo(id, token);
            setCombos(combos.filter(c => c.id !== id));
        } catch (err: any) {
            console.error("Failed to delete combo:", err);
            setError(err.message);
            throw err;
        }
    };

    const addCategory = (name: string) => {
        // Categories are currently hardcoded/local-only or could be moved to DB later
        setCategories([...categories, { id: crypto.randomUUID(), name, value: name.toLowerCase() }]);
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
            addCategory
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
