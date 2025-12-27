import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    disabled
}) => {
    const [preview, setPreview] = useState<string | undefined>(value);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
                // In a real app, you would upload to storage here and get a URL
                // For now, we'll pass the base64 string or you could simulate an upload
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
        <div className="w-full">
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all overflow-hidden min-h-[200px] flex flex-col items-center justify-center",
                    isDragActive ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary/50 hover:bg-slate-50",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                <input {...getInputProps()} />

                {value ? (
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
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
