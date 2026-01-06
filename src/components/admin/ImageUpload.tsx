import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string; // Added
    hidePreview?: boolean; // Added
    children?: React.ReactNode; // Added
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    disabled,
    className,
    hidePreview,
    children
}) => {
    const [preview, setPreview] = useState<string | undefined>(value);

    // Update internal preview if value changes externally
    React.useEffect(() => {
        setPreview(value);
    }, [value]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
                onChange(result);
            };
            reader.readAsDataURL(file);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 1,
        disabled
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(undefined);
        onChange('');
    };

    return (
        <div className={cn("w-full", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all overflow-hidden flex flex-col items-center justify-center",
                    !children && "min-h-[200px]", // Only enforce height if no children
                    isDragActive ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary/50 hover:bg-slate-50",
                    disabled && "opacity-50 cursor-not-allowed",
                    // If using as a small trigger (children present), remove default border/padding/etc if handled by parent, or keep them? 
                    // Let's keep the border/rounded logic but allow className to override
                    className
                )}
                style={children ? { border: 'none', padding: 0, minHeight: 0 } : undefined} // Reset styles if custom trigger
            >
                <input {...getInputProps()} />

                {value && !hidePreview ? (
                    <>
                        <img
                            src={value}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-contain bg-slate-100"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                            <Upload className="h-8 w-8 mb-2" />
                            <span className="font-medium">Click or drop to replace</span>
                        </div>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-2 top-2 z-10 w-8 h-8 rounded-full shadow-sm"
                            onClick={handleRemove}
                            disabled={disabled}
                            title="Remove image"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </>
                ) : (
                    children ? (
                        children
                    ) : (
                        <div className="flex flex-col items-center gap-2 py-4 text-slate-500">
                            <div className="p-4 rounded-full bg-slate-100 mb-2">
                                <Upload className="h-8 w-8" />
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold text-primary text-lg">Click to upload</span>
                                <br />
                                <span className="text-slate-500">or drag and drop</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                SVG, PNG, JPG or WEBP (max. 5MB)
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
