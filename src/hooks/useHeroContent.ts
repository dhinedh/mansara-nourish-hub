import { useState, useEffect } from 'react';
import { fetchHeroConfig, updateHeroConfig } from '@/lib/api';

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
    homeSettings: {
        interval: number;
    };
}

// Default config remains as fallback/initial state
const DEFAULT_CONFIG: HeroConfig = {
    home: [
        {
            id: '1',
            image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
            title: 'Pure Tradition, Modern Wellness',
            subtitle: 'Experience the authentic taste of South India with our handcrafted, preservative-free foods.',
            ctaText: 'Shop Now',
            ctaLink: '/products'
        },
        {
            id: '2',
            image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
            title: 'Nourish Your Family',
            subtitle: 'Wholesome porridge mixes and essentials made with care for your loved ones.',
            ctaText: 'View Products',
            ctaLink: '/products'
        },
        // ... (other default slides)
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
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        title: 'Combo Offers',
        subtitle: 'Get more value with our carefully curated combo packs. Save more when you buy together!'
    },
    products: {
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        title: 'Our Products',
        subtitle: 'Browse our complete range of pure, nourishing foods'
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
    homeSettings: {
        interval: 5000
    }
};

export const useHeroContent = () => {
    const [heroConfig, setHeroConfig] = useState<HeroConfig>(DEFAULT_CONFIG);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const apiConfig = await fetchHeroConfig();
                // Merge API config with default to ensure structure
                if (apiConfig && Object.keys(apiConfig).length > 0) {
                    // Normalize home slides ids
                    if (apiConfig.home && Array.isArray(apiConfig.home)) {
                        apiConfig.home = apiConfig.home.map((slide: any) => ({
                            ...slide,
                            id: slide.id || slide._id
                        }));
                    }
                    setHeroConfig(prev => ({ ...prev, ...apiConfig }));
                }
            } catch (error) {
                console.error('Failed to load hero config', error);
            }
        };
        loadConfig();
    }, []);

    const saveConfig = (newConfig: HeroConfig) => {
        setHeroConfig(newConfig);
    };

    const updateHomeSlide = async (index: number, slide: HeroSlide) => {
        const newHome = [...heroConfig.home];
        newHome[index] = slide;
        const newConfig = { ...heroConfig, home: newHome };
        saveConfig(newConfig);
        try {
            await updateHeroConfig('home', newHome);
        } catch (e) {
            console.error('Failed to update home slides', e);
        }
    };

    const addHomeSlide = async (slide: HeroSlide) => {
        const newHome = [...heroConfig.home, slide];
        const newConfig = { ...heroConfig, home: newHome };
        saveConfig(newConfig);
        try {
            await updateHeroConfig('home', newHome);
        } catch (e) {
            console.error('Failed to add home slide', e);
        }
    };

    const updateHomeSlideById = async (id: string, slide: HeroSlide) => {
        const newHome = heroConfig.home.map(s => s.id === id ? slide : s);
        const newConfig = { ...heroConfig, home: newHome };
        saveConfig(newConfig);
        try {
            await updateHeroConfig('home', newHome);
        } catch (e) {
            console.error('Failed to update home slide', e);
        }
    };

    const deleteHomeSlide = async (id: string) => {
        const newHome = heroConfig.home.filter(s => s.id !== id);
        const newConfig = { ...heroConfig, home: newHome };
        saveConfig(newConfig);
        try {
            await updateHeroConfig('home', newHome);
        } catch (e) {
            console.error('Failed to delete home slide', e);
        }
    };

    const updateHomeSettings = async (settings: { interval: number }) => {
        const newConfig = { ...heroConfig, homeSettings: settings };
        saveConfig(newConfig);
        try {
            await updateHeroConfig('homeSettings', settings);
        } catch (e) {
            console.error('Failed to update home settings', e);
        }
    };

    const updatePageHero = async (page: keyof HeroConfig, data: PageHero) => {
        if (page === 'home' || page === 'homeSettings') return;
        const newConfig = { ...heroConfig, [page]: data };
        saveConfig(newConfig);
        try {
            await updateHeroConfig(page, data);
        } catch (e) {
            console.error(`Failed to update ${page} hero`, e);
        }
    };

    return {
        heroConfig,
        updateHomeSlide,
        addHomeSlide,
        updateHomeSlideById,
        deleteHomeSlide,
        updateHomeSettings,
        updatePageHero
    };
};
