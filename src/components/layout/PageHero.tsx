import React from 'react';
import { useHeroContent, HeroConfig } from '@/hooks/useHeroContent';

interface PageHeroProps {
    pageKey: keyof Omit<HeroConfig, 'home'>;
    children?: React.ReactNode;
}

const PageHero: React.FC<PageHeroProps> = ({ pageKey, children }) => {
    const { heroConfig } = useHeroContent();
    const content = heroConfig[pageKey];

    if (!content) return null;

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={content.image}
                    alt={content.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            </div>

            {/* Content */}
            <div className={`w-full px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] mx-auto relative z-10 flex flex-col ${content.alignment === 'left' ? 'items-start text-left' : content.alignment === 'right' ? 'items-end text-right' : 'items-center text-center'}`}>
                <div className="animate-fade-in-up">
                    {children}

                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                        {content.title}
                    </h1>
                    <p className="text-zinc-200 text-lg max-w-2xl leading-relaxed font-medium">
                        {content.subtitle}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PageHero;
