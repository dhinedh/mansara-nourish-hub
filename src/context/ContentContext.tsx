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
// TYPES
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
// OPTIMIZED CONTENT PROVIDER
// ========================================
export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [contents, setContents] = useState<PageContent[]>(DEFAULT_CONTENT);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [settings, setSettings] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    // ========================================
    // CACHING
    // ========================================
    const CACHE_KEY = 'mansara-content-cache';
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

    const getCachedData = () => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
            
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
            console.error('[Content] ✗ Cache save failed:', error);
        }
    };

    const clearCache = () => {
        localStorage.removeItem(CACHE_KEY);
    };

    // ========================================
    // LOAD DATA
    // ========================================
    const loadData = useCallback(async () => {
        setIsLoading(true);
        
        try {
            // Check cache first
            const cachedData = getCachedData();
            if (cachedData) {
                setBanners(cachedData.banners || []);
                setContents(cachedData.contents || DEFAULT_CONTENT);
                setSettings(cachedData.settings || {});
                setIsLoading(false);
                console.log('[Content] ✓ Loaded from cache');
                
                // Fetch in background
                fetchAndCache();
                return;
            }

            await fetchAndCache();
            
        } catch (error) {
            console.error('[Content] ✗ Load error:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchAndCache = async () => {
        const [apiBanners, apiPages, apiSettings] = await Promise.all([
            fetchBanners().catch(() => []),
            fetchContentPages().catch(() => []),
            fetchSettings().catch(() => ({}))
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

        setBanners(normalizedBanners);
        setContents(mergedContent);
        setSettings(apiSettings || {});

        // Cache data
        cacheData({
            banners: normalizedBanners,
            contents: mergedContent,
            settings: apiSettings
        });

        console.log('[Content] ✓ Loaded from API');
    };

    // Initial load
    useEffect(() => {
        loadData();
    }, [loadData]);

    // ========================================
    // BANNER ACTIONS
    // ========================================
    const addBanner = async (banner: Omit<Banner, 'id'>) => {
        try {
            const newBanner = await createBanner(banner);
            setBanners(prev => [...prev, { ...newBanner, id: newBanner._id || newBanner.id }]);
            clearCache();
            console.log('[Content] ✓ Banner added');
        } catch (error) {
            console.error('[Content] ✗ Add banner failed:', error);
            throw error;
        }
    };

    const updateBanner = async (id: string, updates: Partial<Banner>) => {
        try {
            // Optimistic update
            setBanners(prev => prev.map(b => 
                b.id === id ? { ...b, ...updates } : b
            ));

            const banner = banners.find(b => b.id === id);
            if (!banner) return;

            const apiId = banner._id || banner.id;
            await apiUpdateBanner(apiId, updates);
            clearCache();
            
            console.log('[Content] ✓ Banner updated');
        } catch (error) {
            console.error('[Content] ✗ Update banner failed:', error);
            // Revert on error
            await loadData();
            throw error;
        }
    };

    const deleteBannerAction = async (id: string) => {
        try {
            await deleteBanner(id);
            setBanners(prev => prev.filter(b => b._id !== id && b.id !== id));
            clearCache();
            console.log('[Content] ✓ Banner deleted');
        } catch (error) {
            console.error('[Content] ✗ Delete banner failed:', error);
            throw error;
        }
    };

    const toggleBanner = async (id: string) => {
        const banner = banners.find(b => b.id === id);
        if (banner) {
            await updateBanner(id, { active: !banner.active });
        }
    };

    const getBannersByPage = useCallback((page: string) => {
        return banners.filter(b => b.page === page && b.active);
    }, [banners]);

    // ========================================
    // CONTENT ACTIONS
    // ========================================
    const updateContent = async (slug: string, sectionKey: string, value: string) => {
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
            // Revert on error
            await loadData();
            throw error;
        }
    };

    const getContent = useCallback((slug: string, sectionKey: string, defaultValue: string = '') => {
        const page = contents.find(p => p.slug === slug);
        return page?.sections[sectionKey] || defaultValue;
    }, [contents]);

    // ========================================
    // REFETCH
    // ========================================
    const refetch = async () => {
        clearCache();
        await loadData();
    };

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