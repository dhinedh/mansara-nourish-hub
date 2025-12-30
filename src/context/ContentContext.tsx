import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchBanners, createBanner, updateBanner as apiUpdateBanner, deleteBanner, fetchContentPages, updateContentPage, fetchSettings } from '@/lib/api';

// Types
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
    slug: string; // e.g., 'about', 'contact'
    sections: Record<string, string>; // key-value pairs for editable text areas
}

interface ContentContextType {
    banners: Banner[];
    contents: PageContent[];
    settings: any;
    addBanner: (banner: Omit<Banner, 'id' | 'active'>) => Promise<void>;
    updateBanner: (id: string, updates: Partial<Banner>) => Promise<void>;
    deleteBanner: (id: string) => Promise<void>;
    updateContent: (page: string, section: string, value: string) => Promise<void>;
    getContent: (page: string, section: string, defaultVal?: string) => string;
    toggleBanner: (id: string) => Promise<void>;
    getBannersByPage: (page: string) => Banner[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const STORAGE_KEY_BANNERS = 'mansara_banners';
const STORAGE_KEY_CONTENT = 'mansara_content';

// Default Data
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

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [contents, setContents] = useState<PageContent[]>(DEFAULT_CONTENT);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [settings, setSettings] = useState<any>({});

    // Load from API on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // Parallel fetch
                const [apiBanners, apiPages, apiSettings] = await Promise.all([
                    fetchBanners(),
                    fetchContentPages(),
                    fetchSettings()
                ]);

                // Normalize banners (ensure id exists from _id)
                const normalizedBanners = apiBanners.map((b: any) => ({
                    ...b,
                    id: b.id || b._id
                }));
                setBanners(normalizedBanners);
                setSettings(apiSettings || {});

                // Merge API pages with defaults to ensure all sections exist
                if (apiPages && apiPages.length > 0) {
                    const mergedContent = [...DEFAULT_CONTENT];
                    apiPages.forEach((apiPage: any) => {
                        const index = mergedContent.findIndex(p => p.slug === apiPage.slug);
                        if (index >= 0) {
                            mergedContent[index] = {
                                ...mergedContent[index],
                                sections: { ...mergedContent[index].sections, ...apiPage.sections }
                            };
                        }
                    });
                    setContents(mergedContent);
                }
            } catch (error) {
                console.error('Failed to load content data', error);
            }
        };
        loadData();
    }, []);

    const toggleBanner = async (id: string) => {
        const banner = banners.find(b => b.id === id);
        if (banner) {
            await updateBanner(id, { active: !banner.active });
        }
    };

    // Actions
    const addBanner = async (banner: Omit<Banner, 'id'>) => {
        try {
            const newBanner = await createBanner(banner);
            setBanners(prev => [...prev, newBanner]);
        } catch (error) {
            console.error('Failed to add banner', error);
        }
    };

    const updateBanner = async (id: string, updates: Partial<Banner>) => {
        try {
            // Optimistic update
            setBanners(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));

            // Find full banner to merge updates if needed, though partial usually fine for our API wrapper if generic
            // For safety with mongoose findByIdAndUpdate, we send the fields we want to update.
            // But we need the _id to call the API if 'id' is our local ID but API expects _id.
            // Let's find the banner first.
            const banner = banners.find(b => b.id === id);
            if (!banner) return;

            // Map 'id' vs '_id'. If id is UUID (local) and _id is missing, we can't update backend unless we rely on something else.
            // But valid synced banners have _id.
            // The API expects the MongoDB _id string.
            const apiId = banner._id || banner.id;

            await apiUpdateBanner(apiId, updates);
        } catch (error) {
            console.error('Failed to update banner', error);
            // Revert on failure? For now just log
        }
    };

    const deleteBannerAction = async (id: string) => {
        try {
            await deleteBanner(id);
            setBanners(prev => prev.filter(b => b._id !== id && b.id !== id)); // Handle both _id (mongo) and id (local legacy)
        } catch (error) {
            console.error('Failed to delete banner', error);
        }
    };

    const getBannersByPage = (page: string) => {
        return banners.filter(b => b.page === page && b.active);
    };

    const updateContent = async (slug: string, sectionKey: string, value: string) => {
        // 1. Optimistic Update
        const newContents = [...contents];
        const pageIndex = newContents.findIndex(p => p.slug === slug);
        let currentSections = {};

        if (pageIndex >= 0) {
            currentSections = { ...newContents[pageIndex].sections, [sectionKey]: value };
            newContents[pageIndex] = {
                ...newContents[pageIndex],
                sections: currentSections
            };
        } else {
            // Should not happen with default content but safe to handle
            currentSections = { [sectionKey]: value };
            newContents.push({ slug, sections: currentSections });
        }
        setContents(newContents);

        // 2. API Call
        try {
            // We need to send ALL sections for the page to the put endpoint or merge on server
            // The endpoint we made expects { sections: ... }
            await updateContentPage(slug, currentSections);
        } catch (error) {
            console.error('Failed to update content', error);
            // Revert ? For now just log error
        }
    };

    const getContent = (slug: string, sectionKey: string, defaultValue: string = '') => {
        const page = contents.find(p => p.slug === slug);
        return page?.sections[sectionKey] || defaultValue;
    };

    return (
        <ContentContext.Provider value={{
            banners,
            contents,
            settings, // Added settings here
            addBanner,
            updateBanner,
            deleteBanner: deleteBannerAction,
            toggleBanner,
            getBannersByPage,
            updateContent,
            getContent
        }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};
