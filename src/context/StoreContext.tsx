import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Types ---
export interface Product {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    offer_price?: number;
    image_url?: string;
    stock: number;
    is_offer: boolean;
    is_active: boolean;
    is_new_arrival: boolean;
    is_featured: boolean;
    short_description?: string;
    description?: string;
    highlights?: string[];
    specs?: Record<string, string>;
    sub_category?: string;
    weight?: string;
    ingredients?: string;
    how_to_use?: string;
    storage_instructions?: string;
    nutrition?: string;
    compliance?: string;
}

export interface Combo {
    id: string;
    name: string;
    price: number;
    discount_price?: number;
    image_url?: string;
    is_active: boolean;
    description?: string;
    items?: string[]; // IDs of products in combo
}

export interface Category {
    id: string;
    name: string;
    image?: string;
}

interface StoreContextType {
    products: Product[];
    combos: Combo[];
    categories: Category[];

    // Product Actions
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    getProduct: (id: string) => Product | undefined;

    // Combo Actions
    addCombo: (combo: Omit<Combo, 'id'>) => void;
    updateCombo: (id: string, updates: Partial<Combo>) => void;
    deleteCombo: (id: string) => void;

    // Category Actions
    addCategory: (name: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const KEYS = {
    PRODUCTS: 'mansara_products',
    COMBOS: 'mansara_combos',
    CATEGORIES: 'mansara_categories',
};

// --- Mock Initial Data ---
const INITIAL_PRODUCTS: Product[] = [
    {
        id: 'p1',
        name: 'Traditional Groundnut Oil',
        slug: 'traditional-groundnut-oil',
        category: 'Oil & Ghee',
        price: 350,
        offer_price: 320,
        stock: 50,
        is_offer: true,
        is_active: true,
        is_new_arrival: false,
        is_featured: true,
        image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
        short_description: 'Cold pressed, pure groundnut oil.'
    },
    {
        id: 'p2',
        name: 'Organic Ragi Flour',
        slug: 'organic-ragi-flour',
        category: 'Millet Foods',
        price: 80,
        stock: 100,
        is_offer: false,
        is_active: true,
        is_new_arrival: true,
        is_featured: false,
        image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
        short_description: 'Rich in calcium, sprouted ragi flour.'
    }
];

const INITIAL_COMBOS: Combo[] = [
    {
        id: 'c1',
        name: 'Wellness Starter Pack',
        price: 800,
        discount_price: 750,
        is_active: true,
        image_url: 'https://images.unsplash.com/photo-1615485925763-867862f80931?auto=format&fit=crop&q=80&w=800',
        description: 'Includes Groundnut Oil and Millet Mix'
    }
];

const INITIAL_CATEGORIES: Category[] = [
    { id: 'cat1', name: 'Oil & Ghee' },
    { id: 'cat2', name: 'Millet Foods' },
    { id: 'cat3', name: 'Spices' },
    { id: 'cat4', name: 'Porridge Mixes' },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // Load Initial Data
    useEffect(() => {
        const loadData = (key: string, initial: any, setter: Function) => {
            const saved = localStorage.getItem(key);
            if (saved) {
                try {
                    setter(JSON.parse(saved));
                } catch (e) { setter(initial); }
            } else {
                setter(initial);
            }
        };

        loadData(KEYS.PRODUCTS, INITIAL_PRODUCTS, setProducts);
        loadData(KEYS.COMBOS, INITIAL_COMBOS, setCombos);
        loadData(KEYS.CATEGORIES, INITIAL_CATEGORIES, setCategories);
    }, []);

    // Sync to LocalStorage
    const save = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

    // --- Actions ---

    const addProduct = (data: Omit<Product, 'id'>) => {
        const newProduct = { ...data, id: crypto.randomUUID() };
        const updated = [...products, newProduct];
        setProducts(updated);
        save(KEYS.PRODUCTS, updated);
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
        setProducts(updated);
        save(KEYS.PRODUCTS, updated);
    };

    const deleteProduct = (id: string) => {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        save(KEYS.PRODUCTS, updated);
    };

    const getProduct = (id: string) => products.find(p => p.id === id);

    const addCombo = (data: Omit<Combo, 'id'>) => {
        const newCombo = { ...data, id: crypto.randomUUID() };
        const updated = [...combos, newCombo];
        setCombos(updated);
        save(KEYS.COMBOS, updated);
    };

    const updateCombo = (id: string, updates: Partial<Combo>) => {
        const updated = combos.map(c => c.id === id ? { ...c, ...updates } : c);
        setCombos(updated);
        save(KEYS.COMBOS, updated);
    };

    const deleteCombo = (id: string) => {
        const updated = combos.filter(c => c.id !== id);
        setCombos(updated);
        save(KEYS.COMBOS, updated);
    };

    const addCategory = (name: string) => {
        const newCat = { id: crypto.randomUUID(), name };
        const updated = [...categories, newCat];
        setCategories(updated);
        save(KEYS.CATEGORIES, updated);
    };

    return (
        <StoreContext.Provider value={{
            products,
            combos,
            categories,
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
