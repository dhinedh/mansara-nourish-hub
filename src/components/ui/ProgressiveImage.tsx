import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    placeholder?: string;
    fallback?: string;
    alt: string;
    className?: string;
    /** Use "eager" only for above-the-fold images (e.g. first hero slide) */
    loading?: 'lazy' | 'eager';
    /** Explicit intrinsic width — prevents CLS; CSS sizing still controlled by className */
    width?: number;
    /** Explicit intrinsic height — prevents CLS; CSS sizing still controlled by className */
    height?: number;
    /** HTML fetchpriority attribute (lowercase) — use "high" for LCP images */
    fetchpriority?: 'high' | 'low' | 'auto';
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
    src,
    placeholder = '/placeholder.svg',
    fallback = 'https://placehold.co/800x800/f5f5f5/999999?text=Product',
    alt,
    className,
    loading = 'lazy',
    width = 800,
    height = 800,
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState<string>(placeholder);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        // Reset state when src changes
        setIsLoading(true);
        setHasError(false);
        setImgSrc(placeholder);

        if (!src) {
            setHasError(true);
            setImgSrc(fallback);
            setIsLoading(false);
            return;
        }

        const img = new Image();
        img.src = src;

        img.onload = () => {
            setImgSrc(src);
            setIsLoading(false);
        };

        img.onerror = () => {
            setHasError(true);
            setImgSrc(fallback);
            setIsLoading(false);
        };

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, placeholder, fallback]);

    return (
        <div className={cn("relative overflow-hidden w-full h-full bg-slate-50", className)}>
            <img
                {...props}
                src={imgSrc}
                alt={alt}
                width={width}
                height={height}
                loading={loading}
                decoding="async"
                className={cn(
                    "w-full h-full object-cover",
                    // Opacity-only transition — stays on the GPU compositor thread,
                    // avoids the "non-composited animations" Lighthouse warning.
                    // (scale-105 blur-sm would force CPU repaints)
                    "transition-opacity duration-500",
                    isLoading ? "opacity-0" : "opacity-100",
                    className
                )}
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

export default ProgressiveImage;
