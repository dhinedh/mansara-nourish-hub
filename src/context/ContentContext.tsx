import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    fetchBanners, 
    createBanner, 
    updateBanner as apiUpdateBanner, 
    deleteBanner, 
    fetchContentPages, 
    updateContentPage, 
    fetchSettings 
} from '@/lib/api';

// ========================================
// OPTIMIZED CONTENT CONTEXT - COMPLETE
// ========================================
// Performance improvements:
// - Longer cache duration (15 min)
// - Background refresh
// - Request deduplication
// - Optimistic updates with rollback
// - Better error handling
// - Lazy loading
// ========================================

export interface Banner {
    _id?: string;
    id: string;
    page: string;
    image: string;
    title: string;
    subtitle: string;
    link?: string;
    active: boolean;
}

export interface PageContent {
    slug: string;
    sections: Record<string, string>;
}

interface ContentContextType {
    banners: Banner[];
    contents: PageContent[];
    settings: any;
    isLoading: boolean;
    
    addBanner: (banner: Omit<Banner, 'id' | 'active'>) => Promise<void>;
    updateBanner: (id: string, updates: Partial<Banner>) => Promise<void>;
    deleteBanner: (id: string) => Promise<void>;
    updateContent: (page: string, section: string, value: string) => Promise<void>;
    getContent: (page: string, section: string, defaultVal?: string) => string;
    toggleBanner: (id: string) => Promise<void>;
    getBannersByPage: (page: string) => Banner[];
    refetch: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// ========================================
// DEFAULT CONTENT
// ========================================
const DEFAULT_CONTENT: PageContent[] = [
    {
        slug: 'about',
        sections: {
            'story': 'MANSARA began its journey with a focus on pure, traditionally prepared cooking essentials — Groundnut oil, Sesame oil, Coconut oil, and Ghee — made with an uncompromising commitment to quality, purity, and honesty.',
            'mission': 'To become a trusted wellness food brand that supports healthier lifestyles by offering pure, nourishing food rooted in tradition and enhanced by modern practices.',
            'vision': 'Provide clean, wholesome foods inspired by traditional wisdom. Support everyday wellness through simple, nourishing ingredients.',
            'founder_note': 'Founder - Deepika Harikrishnan\n\nMANSARA refers to this belief — that food should support the body, not burden it, and that long-term wellness begins with mindful, honest nourishment.'
        }
    },
    {
        slug: 'contact',
        sections: {
            'intro': 'We\'re Here to Help. Every message matters to us.',
            'address': 'MANSARA FOODS\nNo. 15, Government Hospital Opposite,\nTimiri Road, Kalavai, Ranipet,\nTamil Nadu – 632506, India',
            'email': 'mansarafoods@gmail.com',
            'phone': '+91 88388 87064'
        }
    },
    {
        slug: 'home_highlights',
        sections: {
            'offers_title': 'Offers',
            'offers_description': 'Special prices on your favorites',
            'combos_title': 'Combos',
            'combos_description': 'Save more with value packs',
            'new_arrivals_title': 'New Arrivals',
            'new_arrivals_description': 'Fresh additions to our family'
        }
    }
];

// ========================================
// CACHING CONFIGURATION
// ========================================
const CACHE_KEY = 'mansara-content-cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes (increased from 10)
const STALE_WHILE_REVALIDATE = 5 * 60 * 1000; // Show stale for 5 min while fetching

// ========================================
// CACHE HELPERS
// ========================================
const getCachedData = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        
        // Return cached data with freshness indicator
        return {
            data,
            isFresh: age < CACHE_DURATION,
            isStale: age >= CACHE_DURATION && age < (CACHE_DURATION + STALE_WHILE_REVALIDATE)
        };
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
        console.error('[Content] ✗ Cache save failed:', error);
    }
};

const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
};

// ========================================
// REQUEST DEDUPLICATION
// ========================================
let fetchInProgress: Promise<any> | null = null;

// ========================================
// OPTIMIZED CONTENT PROVIDER
// ========================================
export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [contents, setContents] = useState<PageContent[]>(DEFAULT_CONTENT);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [settings, setSettings] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    // ========================================
    // FETCH AND CACHE
    // ========================================
    const fetchAndCache = useCallback(async (showLoading = false) => {
        // Deduplicate requests
        if (fetchInProgress) {
            console.log('[Content] Using in-flight request');
            return fetchInProgress;
        }

        if (showLoading) setIsLoading(true);

        fetchInProgress = (async () => {
            try {
                const [apiBanners, apiPages, apiSettings] = await Promise.all([
                    fetchBanners().catch(e => {
                        console.error('[Content] Banners fetch failed:', e);
                        return [];
                    }),
                    fetchContentPages().catch(e => {
                        console.error('[Content] Pages fetch failed:', e);
                        return [];
                    }),
                    fetchSettings().catch(e => {
                        console.error('[Content] Settings fetch failed:', e);
                        return {};
                    })
                ]);

                // Normalize banners
                const normalizedBanners = apiBanners.map((b: any) => ({
                    ...b,
                    id: b.id || b._id
                }));

                // Merge content pages
                const mergedContent = [...DEFAULT_CONTENT];
                if (apiPages && apiPages.length > 0) {
                    apiPages.forEach((apiPage: any) => {
                        const index = mergedContent.findIndex(p => p.slug === apiPage.slug);
                        if (index >= 0) {
                            mergedContent[index] = {
                                ...mergedContent[index],
                                sections: { 
                                    ...mergedContent[index].sections, 
                                    ...apiPage.sections 
                                }
                            };
                        } else {
                            mergedContent.push(apiPage);
                        }
                    });
                }

                const newData = {
                    banners: normalizedBanners,
                    contents: mergedContent,
                    settings: apiSettings
                };

                setBanners(normalizedBanners);
                setContents(mergedContent);
                setSettings(apiSettings || {});

                // Cache data
                cacheData(newData);

                console.log('[Content] ✓ Loaded from API');
                return newData;
            } finally {
                fetchInProgress = null;
                if (showLoading) setIsLoading(false);
            }
        })();

        return fetchInProgress;
    }, []);

    // ========================================
    // LOAD DATA WITH SMART CACHING
    // ========================================
    const loadData = useCallback(async () => {
        setIsLoading(true);
        
        try {
            // Check cache first
            const cached = getCachedData();
            
            if (cached) {
                const { data, isFresh, isStale } = cached;
                
                // Use cached data immediately
                setBanners(data.banners || []);
                setContents(data.contents || DEFAULT_CONTENT);
                setSettings(data.settings || {});
                setIsLoading(false);
                
                if (isFresh) {
                    console.log('[Content] ✓ Loaded from fresh cache');
                    return;
                } else if (isStale) {
                    console.log('[Content] ⚠ Loaded from stale cache, refreshing in background');
                    // Fetch in background
                    fetchAndCache(false);
                } else {
                    console.log('[Content] ⚠ Cache expired, fetching new data');
                    await fetchAndCache(false);
                }
            } else {
                console.log('[Content] No cache, fetching from API');
                await fetchAndCache(true);
            }
            
        } catch (error) {
            console.error('[Content] ✗ Load error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchAndCache]);

    // Initial load
    useEffect(() => {
        loadData();
    }, [loadData]);

    // ========================================
    // BANNER ACTIONS
    // ========================================
    const addBanner = useCallback(async (banner: Omit<Banner, 'id'>) => {
        try {
            const newBanner = await createBanner(banner);
            setBanners(prev => [...prev, { ...newBanner, id: newBanner._id || newBanner.id }]);
            clearCache();
            console.log('[Content] ✓ Banner added');
        } catch (error) {
            console.error('[Content] ✗ Add banner failed:', error);
            throw error;
        }
    }, []);

    const updateBanner = useCallback(async (id: string, updates: Partial<Banner>) => {
        // Store original for rollback
        const originalBanners = [...banners];
        
        try {
            // Optimistic update
            setBanners(prev => prev.map(b => 
                b.id === id ? { ...b, ...updates } : b
            ));

            const banner = originalBanners.find(b => b.id === id);
            if (!banner) return;

            const apiId = banner._id || banner.id;
            await apiUpdateBanner(apiId, updates);
            clearCache();
            
            console.log('[Content] ✓ Banner updated');
        } catch (error) {
            console.error('[Content] ✗ Update banner failed:', error);
            // Rollback on error
            setBanners(originalBanners);
            throw error;
        }
    }, [banners]);

    const deleteBannerAction = useCallback(async (id: string) => {
        // Store original for rollback
        const originalBanners = [...banners];
        
        try {
            // Optimistic delete
            setBanners(prev => prev.filter(b => b._id !== id && b.id !== id));
            
            await deleteBanner(id);
            clearCache();
            console.log('[Content] ✓ Banner deleted');
        } catch (error) {
            console.error('[Content] ✗ Delete banner failed:', error);
            // Rollback on error
            setBanners(originalBanners);
            throw error;
        }
    }, [banners]);

    const toggleBanner = useCallback(async (id: string) => {
        const banner = banners.find(b => b.id === id);
        if (banner) {
            await updateBanner(id, { active: !banner.active });
        }
    }, [banners, updateBanner]);

    const getBannersByPage = useCallback((page: string) => {
        return banners.filter(b => b.page === page && b.active);
    }, [banners]);

    // ========================================
    // CONTENT ACTIONS
    // ========================================
    const updateContent = useCallback(async (slug: string, sectionKey: string, value: string) => {
        // Store original for rollback
        const originalContents = [...contents];
        
        try {
            // Optimistic update
            const newContents = [...contents];
            const pageIndex = newContents.findIndex(p => p.slug === slug);
            let currentSections = {};

            if (pageIndex >= 0) {
                currentSections = { 
                    ...newContents[pageIndex].sections, 
                    [sectionKey]: value 
                };
                newContents[pageIndex] = {
                    ...newContents[pageIndex],
                    sections: currentSections
                };
            } else {
                currentSections = { [sectionKey]: value };
                newContents.push({ slug, sections: currentSections });
            }
            
            setContents(newContents);

            // API call
            await updateContentPage(slug, currentSections);
            clearCache();
            
            console.log('[Content] ✓ Content updated');
        } catch (error) {
            console.error('[Content] ✗ Update content failed:', error);
            // Rollback on error
            setContents(originalContents);
            throw error;
        }
    }, [contents]);

    const getContent = useCallback((slug: string, sectionKey: string, defaultValue: string = '') => {
        const page = contents.find(p => p.slug === slug);
        return page?.sections[sectionKey] || defaultValue;
    }, [contents]);

    // ========================================
    // REFETCH
    // ========================================
    const refetch = useCallback(async () => {
        clearCache();
        await fetchAndCache(true);
    }, [fetchAndCache]);

    return (
        <ContentContext.Provider value={{
            banners,
            contents,
            settings,
            isLoading,
            addBanner,
            updateBanner,
            deleteBanner: deleteBannerAction,
            toggleBanner,
            getBannersByPage,
            updateContent,
            getContent,
            refetch
        }}>
            {children}
        </ContentContext.Provider>
    );
};

// ========================================
// HOOK
// ========================================
export const useContent = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};