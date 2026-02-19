import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    placeholder?: string;
    fallback?: string;
    alt: string;
    className?: string;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
    src,
    placeholder = '/placeholder.svg',
    fallback = 'https://placehold.co/800x800/f5f5f5/999999?text=Product',
    alt,
    className,
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
                className={cn(
                    "w-full h-full object-cover transition-all duration-500",
                    isLoading ? "scale-105 blur-sm opacity-90" : "scale-100 blur-0 opacity-100",
                    className
                )}
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 backdrop-blur-[2px]">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default ProgressiveImage;
