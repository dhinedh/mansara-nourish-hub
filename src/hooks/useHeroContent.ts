import { useState, useEffect } from 'react';

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
        {
            id: '3',
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
            title: 'Farm to Table Purity',
            subtitle: 'We source the finest ingredients directly from farmers to ensure absolute quality.',
            ctaText: 'Our Story',
            ctaLink: '/about'
        },
        {
            id: '4',
            image: 'https://images.unsplash.com/photo-1540648601004-92e10c3b0620?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80', // Hand holding spices/grain, very tactile and handcrafted feel
            title: 'Handcrafted with Love',
            subtitle: 'Every product is made in small batches to preserve freshness and flavor.',
            ctaText: 'See Offers',
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
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80', // Shopping cart/Groceries
        title: 'Your Cart',
        subtitle: 'Review your selected items before checkout.'
    },
    homeSettings: {
        interval: 5000
    }
};

const STORAGE_KEY = 'mansara_hero_content';

export const useHeroContent = () => {
    const [heroConfig, setHeroConfig] = useState<HeroConfig>(DEFAULT_CONFIG);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setHeroConfig(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse hero config', e);
            }
        }
    }, []);

    const saveConfig = (newConfig: HeroConfig) => {
        setHeroConfig(newConfig);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    };

    const updateHomeSlide = (index: number, slide: HeroSlide) => {
        const newHome = [...heroConfig.home];
        newHome[index] = slide;
        saveConfig({ ...heroConfig, home: newHome });
    };

    const addHomeSlide = (slide: HeroSlide) => {
        saveConfig({ ...heroConfig, home: [...heroConfig.home, slide] });
    };

    const updateHomeSlideById = (id: string, slide: HeroSlide) => {
        const newHome = heroConfig.home.map(s => s.id === id ? slide : s);
        saveConfig({ ...heroConfig, home: newHome });
    };

    const deleteHomeSlide = (id: string) => {
        const newHome = heroConfig.home.filter(s => s.id !== id);
        saveConfig({ ...heroConfig, home: newHome });
    };

    const updateHomeSettings = (settings: { interval: number }) => {
        saveConfig({ ...heroConfig, homeSettings: settings });
    };

    const updatePageHero = (page: keyof HeroConfig, data: PageHero) => {
        if (page === 'home' || page === 'homeSettings') return; // Handled specially
        // @ts-ignore - complex union type mapping
        saveConfig({ ...heroConfig, [page]: data });
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
