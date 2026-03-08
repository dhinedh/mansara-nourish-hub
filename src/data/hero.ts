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

export const heroConfig: HeroConfig = {
    home: [
        {
            id: '1',
            image: '/hero-womens-day-home-v2.png',
            title: '',
            subtitle: '',
            ctaText: '',
            ctaLink: '/products'
        },
        {
            id: '2',
            image: '/hero-womens-day-home-v1.png',
            title: '',
            subtitle: '',
            ctaText: '',
            ctaLink: '/offers'
        }
    ],
    newArrivals: {
        image: '/hero-new-arrivals.png',
        title: 'New Launch: Ragi Choco Malt',
        subtitle: 'The perfect blend of tradition and taste. Nutritious Ragi meets premium Cocoa.'
    },
    offers: {
        image: '/hero-womens-day-offer-final.png',
        title: 'Special International Women\'s Day Offer',
        subtitle: 'Celebrate health and wellness with a 20% discount on all Mansara products. Honoring women everywhere!'
    },
    combos: {
        image: '/hero-combos-final.png',
        title: 'Perfect Pairings',
        subtitle: 'Curated combinations for the ultimate taste experience. Save more with our value packs!'
    },
    products: {
        image: '/hero-products.png',
        title: 'Our Clean Range',
        subtitle: 'Pure, wholesome, and made for your well-being.'
    },
    about: {
        image: '/hero-about.png',
        title: 'Our Tradition of Wellness',
        subtitle: 'Handcrafted with care, rooted in heritage.'
    },
    contact: {
        image: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        title: 'Contact Us',
        subtitle: "We'd love to hear from you. Whether you have a question about our products, feedback to share, or would like to collaborate with us."
    },
    cart: {
        image: '/hero-cart.jpg',
        title: 'Your Cart',
        subtitle: 'Review your selection of wholesome goodness.'
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
