import { heroConfig } from '@/data/hero';
export type { HeroSlide, PageHero, HeroConfig } from '@/data/hero';

export const useHeroContent = () => {
    return {
        heroConfig,
        isLoading: false,
        updateHomeSlide: async () => { },
        addHomeSlide: async () => { },
        updateHomeSlideById: async () => { },
        deleteHomeSlide: async () => { },
        updateHomeSettings: async () => { },
        updatePageHero: async () => { },
        refetch: async () => { }
    };
};