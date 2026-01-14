import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHeroContent } from '@/hooks/useHeroContent';

const HeroSlider: React.FC = () => {
    const { heroConfig } = useHeroContent();
    const [currentSlide, setCurrentSlide] = useState(0);

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    useEffect(() => {
        const interval = heroConfig.homeSettings?.interval || 5000;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroConfig.home.length);
        }, interval);

        return () => clearInterval(timer);
    }, [heroConfig.home.length, heroConfig.homeSettings?.interval]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroConfig.home.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroConfig.home.length) % heroConfig.home.length);
    };

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }
    };

    return (
        <section
            className="relative h-[600px] w-full overflow-hidden bg-black"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {heroConfig.home.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image - Clickable if link exists */}
                    {slide.ctaLink ? (
                        <Link to={slide.ctaLink} className="absolute inset-0 cursor-pointer block">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
                        </Link>
                    ) : (
                        <div className="absolute inset-0">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
                        </div>
                    )}

                    {/* Content */}
                    <div className={`relative z-20 h-full flex items-center px-4 sm:px-6 lg:px-8 ${slide.alignment === 'left' ? 'justify-start text-left' : slide.alignment === 'right' ? 'justify-end text-right' : 'justify-center text-center'}`}>
                        <div className={`max-w-4xl transform transition-all duration-700 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                            }`}>
                            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                                {slide.title}
                            </h1>
                            <p className="text-lg sm:text-xl md:text-2xl text-zinc-100 mb-8 max-w-2xl font-medium leading-relaxed">
                                {slide.subtitle}
                            </p>
                            {slide.ctaText && slide.ctaLink && (
                                <Link to={slide.ctaLink}>
                                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 btn-shine">
                                        {slide.ctaText}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hidden lg:block"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hidden lg:block"
                aria-label="Next slide"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                {heroConfig.home.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;
