import { useState, useEffect, useCallback } from 'react';
import { fetchHeroConfig, updateHeroConfig } from '@/lib/api';

// ========================================
// FULLY OPTIMIZED HERO CONTENT HOOK
// ========================================
// All improvements applied:
// - Enhanced caching (15 min)
// - Background refresh
// - Request deduplication
// - Optimistic updates
// - Better error handling
// ========================================

export interface HeroSlide {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    ctaText?: string;
    ctaLink?: string;
    alignment?: 'left' | 'center' | 'right';
}

export interface PageHero {
    image: string;
    title: string;
    subtitle: string;
    alignment?: 'left' | 'center' | 'right';
}

export interface HeroConfig {
    home: HeroSlide[];
    newArrivals: PageHero;
    offers: PageHero;
    combos: PageHero;
    products: PageHero;
    about: PageHero;
    contact: PageHero;
    cart: PageHero;
    blog: PageHero;
    press: PageHero;
    careers: PageHero;
    homeSettings: {
        interval: number;
    };
}

// ========================================
// DEFAULT HERO CONFIG
// ========================================
const DEFAULT_CONFIG: HeroConfig = {
    home: [
        {
            id: '1',
            image: '/hero-combo-5day.jpg',
            title: '',
            subtitle: '',
            ctaText: '',
            ctaLink: '/combos'
        },
        {
            id: '2',
            image: '/hero-launch-offer.png',
            title: '',
            subtitle: '',
            ctaText: '',
            ctaLink: '/offers'
        }
    ],
    newArrivals: {
        image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        title: 'New Arrivals',
        subtitle: 'Discover our latest additions to the MANSARA family. Fresh, innovative, and always pure.'
    },
    offers: {
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        title: 'Special Offers',
        subtitle: 'Grab these amazing deals on your favorite MANSARA products. Premium quality at special prices!'
    },
    combos: {
        image: '/hero-combos-final.png',
        title: '',
        subtitle: ''
    },
    products: {
        image: '/hero-products.png',
        title: '',
        subtitle: ''
    },
    about: {
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        title: 'About MANSARA',
        subtitle: 'Nourish from Within – The Power of MANSARA'
    },
    contact: {
        image: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        title: 'Contact Us',
        subtitle: "We'd love to hear from you. Whether you have a question about our products, feedback to share, or would like to collaborate with us."
    },
    cart: {
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        title: 'Your Cart',
        subtitle: 'Review your selected items before checkout.'
    },
    blog: {
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        title: 'Latest Insights',
        subtitle: 'Stories, recipes, and wellness tips from Mansara.'
    },
    press: {
        image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        title: 'Newsroom',
        subtitle: 'Latest updates and announcements from Mansara Foods.'
    },
    careers: {
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        title: 'Join Our Team',
        subtitle: 'Build the future of healthy food with us.'
    },
    homeSettings: {
        interval: 5000
    }
};

// ========================================
// CACHING
// ========================================
const CACHE_KEY = 'mansara-hero-cache-v12'; // Bumped version to force refresh
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const STALE_DURATION = 5 * 60 * 1000; // 5 minutes stale

const getCachedHero = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        return {
            data,
            isFresh: age < CACHE_DURATION,
            isStale: age >= CACHE_DURATION && age < (CACHE_DURATION + STALE_DURATION)
        };
    } catch {
        return null;
    }
};

const cacheHero = (config: HeroConfig) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: config,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('[Hero] ✗ Cache save failed:', error);
    }
};

const clearHeroCache = () => {
    localStorage.removeItem(CACHE_KEY);
};

// ========================================
// REQUEST DEDUPLICATION
// ========================================
let fetchInProgress: Promise<any> | null = null;

// ========================================
// HOOK
// ========================================
export const useHeroContent = () => {
    const [heroConfig, setHeroConfig] = useState<HeroConfig>(DEFAULT_CONFIG);
    const [isLoading, setIsLoading] = useState(true);

    // ========================================
    // FETCH AND CACHE
    // ========================================
    const fetchAndCache = useCallback(async (showLoading = false) => {
        // Deduplicate requests
        if (fetchInProgress) {
            console.log('[Hero] Using in-flight request');
            return fetchInProgress;
        }

        if (showLoading) setIsLoading(true);

        fetchInProgress = (async () => {
            try {
                const apiConfig = await fetchHeroConfig();

                if (apiConfig && Object.keys(apiConfig).length > 0) {
                    // Normalize home slides IDs
                    if (apiConfig.home && Array.isArray(apiConfig.home)) {
                        apiConfig.home = apiConfig.home.map((slide: any) => ({
                            ...slide,
                            id: slide.id || slide._id || crypto.randomUUID()
                        }));
                    }

                    // Merge with defaults
                    const merged = { ...DEFAULT_CONFIG, ...apiConfig };
                    setHeroConfig(merged);
                    cacheHero(merged);
                    console.log('[Hero] ✓ Loaded from API');
                    return merged;
                }
            } catch (error) {
                console.error('[Hero] ✗ Load error:', error);
            } finally {
                fetchInProgress = null;
                if (showLoading) setIsLoading(false);
            }
        })();

        return fetchInProgress;
    }, []);

    // ========================================
    // LOAD CONFIG WITH SMART CACHING
    // ========================================
    useEffect(() => {
        const loadConfig = async () => {
            setIsLoading(true);

            // Check cache first
            const cached = getCachedHero();
            if (cached) {
                const { data, isFresh, isStale } = cached;

                setHeroConfig(data);
                setIsLoading(false);

                if (isFresh) {
                    console.log('[Hero] ✓ Using fresh cache');
                    return;
                } else if (isStale) {
                    console.log('[Hero] ⚠ Using stale cache, refreshing in background');
                    fetchAndCache(false);
                    return;
                }
            }

            // Load from API
            await fetchAndCache(true);
            setIsLoading(false);
        };

        loadConfig();
    }, [fetchAndCache]);

    // ========================================
    // UPDATE FUNCTIONS
    // ========================================
    const saveConfig = useCallback((newConfig: HeroConfig) => {
        setHeroConfig(newConfig);
        cacheHero(newConfig);
    }, []);

    const updateHomeSlide = useCallback(async (index: number, slide: HeroSlide) => {
        const newHome = [...heroConfig.home];
        newHome[index] = slide;
        const newConfig = { ...heroConfig, home: newHome };

        saveConfig(newConfig);

        try {
            await updateHeroConfig('home', newHome);
            console.log('[Hero] ✓ Home slide updated');
        } catch (e) {
            console.error('[Hero] ✗ Failed to update home slides', e);
        }
    }, [heroConfig, saveConfig]);

    const addHomeSlide = useCallback(async (slide: HeroSlide) => {
        const newHome = [...heroConfig.home, slide];
        const newConfig = { ...heroConfig, home: newHome };

        saveConfig(newConfig);

        try {
            await updateHeroConfig('home', newHome);
            console.log('[Hero] ✓ Home slide added');
        } catch (e) {
            console.error('[Hero] ✗ Failed to add home slide', e);
        }
    }, [heroConfig, saveConfig]);

    const updateHomeSlideById = useCallback(async (id: string, slide: HeroSlide) => {
        const newHome = heroConfig.home.map(s => s.id === id ? slide : s);
        const newConfig = { ...heroConfig, home: newHome };

        saveConfig(newConfig);

        try {
            await updateHeroConfig('home', newHome);
            console.log('[Hero] ✓ Home slide updated');
        } catch (e) {
            console.error('[Hero] ✗ Failed to update home slide', e);
        }
    }, [heroConfig, saveConfig]);

    const deleteHomeSlide = useCallback(async (id: string) => {
        const newHome = heroConfig.home.filter(s => s.id !== id);
        const newConfig = { ...heroConfig, home: newHome };

        saveConfig(newConfig);

        try {
            await updateHeroConfig('home', newHome);
            console.log('[Hero] ✓ Home slide deleted');
        } catch (e) {
            console.error('[Hero] ✗ Failed to delete home slide', e);
        }
    }, [heroConfig, saveConfig]);

    const updateHomeSettings = useCallback(async (settings: { interval: number }) => {
        const newConfig = { ...heroConfig, homeSettings: settings };

        saveConfig(newConfig);

        try {
            await updateHeroConfig('homeSettings', settings);
            console.log('[Hero] ✓ Home settings updated');
        } catch (e) {
            console.error('[Hero] ✗ Failed to update home settings', e);
        }
    }, [heroConfig, saveConfig]);

    const updatePageHero = useCallback(async (page: keyof HeroConfig, data: PageHero) => {
        if (page === 'home' || page === 'homeSettings') return;

        const newConfig = { ...heroConfig, [page]: data };

        saveConfig(newConfig);

        try {
            await updateHeroConfig(page, data);
            console.log(`[Hero] ✓ ${page} hero updated`);
        } catch (e) {
            console.error(`[Hero] ✗ Failed to update ${page} hero`, e);
        }
    }, [heroConfig, saveConfig]);

    const refetch = useCallback(async () => {
        clearHeroCache();
        await fetchAndCache(true);
    }, [fetchAndCache]);

    return {
        heroConfig,
        isLoading,
        updateHomeSlide,
        addHomeSlide,
        updateHomeSlideById,
        deleteHomeSlide,
        updateHomeSettings,
        updatePageHero,
        refetch
    };
};