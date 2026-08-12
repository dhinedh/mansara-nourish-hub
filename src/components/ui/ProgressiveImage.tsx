import React, { useState, useEffect } from 'react';
import { cn, getCloudinaryBlurUrl } from '@/lib/utils';

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
    const blurPlaceholder = src && src.includes('cloudinary.com') ? getCloudinaryBlurUrl(src) : placeholder;

    const [imgSrc, setImgSrc] = useState<string>(blurPlaceholder);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        setHasError(false);
        const currentBlur = src && src.includes('cloudinary.com') ? getCloudinaryBlurUrl(src) : placeholder;
        setImgSrc(currentBlur);

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
        <div className={cn("relative overflow-hidden w-full h-full bg-slate-100", className)}>
            {/* Low-quality blur background while high-res image loads */}
            {isLoading && blurPlaceholder && blurPlaceholder !== placeholder && (
                <img
                    src={blurPlaceholder}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover filter blur-md scale-105 opacity-90 transition-opacity duration-300"
                />
            )}

            {/* High-res image smoothly fading in */}
            <img
                {...props}
                src={imgSrc}
                alt={alt}
                width={width}
                height={height}
                loading={loading}
                decoding="async"
                className={cn(
                    "w-full h-full object-cover transition-opacity duration-500",
                    isLoading && blurPlaceholder !== placeholder ? "opacity-0" : "opacity-100",
                    className
                )}
            />

            {/* Spinner fallback if no blur placeholder available */}
            {isLoading && (!blurPlaceholder || blurPlaceholder === placeholder) && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

export default ProgressiveImage;

