import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_HARDCODED_IMAGE = '/products/urad-classic-front.jpg';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    placeholder?: string;
    fallback?: string;
    alt: string;
    className?: string;
    loading?: 'lazy' | 'eager';
    width?: number;
    height?: number;
    fetchpriority?: 'high' | 'low' | 'auto';
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
    src,
    placeholder,
    fallback = DEFAULT_HARDCODED_IMAGE,
    alt,
    className,
    loading = 'lazy',
    width = 800,
    height = 800,
    ...props
}) => {
    // Hardcode valid product image if src is missing, empty, or placeholder.svg
    const validSrc = (!src || src.includes('placeholder.svg')) ? DEFAULT_HARDCODED_IMAGE : src;
    const [imgSrc, setImgSrc] = useState<string>(validSrc);

    useEffect(() => {
        const nextSrc = (!src || src.includes('placeholder.svg')) ? DEFAULT_HARDCODED_IMAGE : src;
        setImgSrc(nextSrc);
    }, [src]);

    return (
        <div className={cn("relative overflow-hidden w-full h-full bg-slate-100", className)}>
            <img
                {...props}
                src={imgSrc}
                alt={alt}
                width={width}
                height={height}
                loading={loading}
                decoding="async"
                onError={() => {
                    if (imgSrc !== DEFAULT_HARDCODED_IMAGE) {
                        setImgSrc(DEFAULT_HARDCODED_IMAGE);
                    }
                }}
                className={cn(
                    "w-full h-full object-cover transition-all duration-300",
                    className
                )}
            />
        </div>
    );
};

export default ProgressiveImage;

