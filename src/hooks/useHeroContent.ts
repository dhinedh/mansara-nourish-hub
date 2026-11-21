import { heroConfig } from '@/data/hero';
export type { HeroSlide, PageHero, HeroConfig } from '@/data/hero';

export const useHeroContent = () => {
    return {
        heroConfig,
        isLoading: false,
        updateHomeSlide: async (..._args: any[]) => { },
        addHomeSlide: async (..._args: any[]) => { },
        updateHomeSlideById: async (..._args: any[]) => { },
        deleteHomeSlide: async (..._args: any[]) => { },
        updateHomeSettings: async (..._args: any[]) => { },
        updatePageHero: async (..._args: any[]) => { },
        refetch: async () => { }
    };
};