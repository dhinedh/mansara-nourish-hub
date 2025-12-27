import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface Banner {
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
    addBanner: (banner: Omit<Banner, 'id'>) => void;
    updateBanner: (id: string, updates: Partial<Banner>) => void;
    deleteBanner: (id: string) => void;
    updateContent: (slug: string, sectionKey: string, value: string) => void;
    getContent: (slug: string, sectionKey: string, defaultValue?: string) => string;
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
    const [banners, setBanners] = useState<Banner[]>([]);
    const [contents, setContents] = useState<PageContent[]>(DEFAULT_CONTENT);

    // Load from Storage
    useEffect(() => {
        const savedBanners = localStorage.getItem(STORAGE_KEY_BANNERS);
        const savedContent = localStorage.getItem(STORAGE_KEY_CONTENT);

        if (savedBanners) {
            try {
                setBanners(JSON.parse(savedBanners));
            } catch (e) { console.error('Failed to parse banners', e); }
        }

        if (savedContent) {
            try {
                const parsedContent = JSON.parse(savedContent);
                // Merge with default to ensure all keys exist if we add new ones later
                setContents(parsedContent);
            } catch (e) {
                console.error('Failed to parse content', e);
            }
        }
    }, []);

    // Save to Storage helper
    const saveBanners = (newBanners: Banner[]) => {
        setBanners(newBanners);
        localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(newBanners));
    };

    const saveContents = (newContents: PageContent[]) => {
        setContents(newContents);
        localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(newContents));
    };

    // Actions
    const addBanner = (banner: Omit<Banner, 'id'>) => {
        const newBanner = { ...banner, id: crypto.randomUUID() };
        saveBanners([...banners, newBanner]);
    };

    const updateBanner = (id: string, updates: Partial<Banner>) => {
        const newBanners = banners.map(b => b.id === id ? { ...b, ...updates } : b);
        saveBanners(newBanners);
    };

    const deleteBanner = (id: string) => {
        const newBanners = banners.filter(b => b.id !== id);
        saveBanners(newBanners);
    };

    const updateContent = (slug: string, sectionKey: string, value: string) => {
        const newContents = [...contents];
        const pageIndex = newContents.findIndex(p => p.slug === slug);

        if (pageIndex >= 0) {
            newContents[pageIndex] = {
                ...newContents[pageIndex],
                sections: {
                    ...newContents[pageIndex].sections,
                    [sectionKey]: value
                }
            };
        } else {
            // Create new page entry if not exists
            newContents.push({
                slug,
                sections: { [sectionKey]: value }
            });
        }
        saveContents(newContents);
    };

    const getContent = (slug: string, sectionKey: string, defaultValue: string = '') => {
        const page = contents.find(p => p.slug === slug);
        return page?.sections[sectionKey] || defaultValue;
    };

    return (
        <ContentContext.Provider value={{
            banners,
            contents,
            addBanner,
            updateBanner,
            deleteBanner,
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
