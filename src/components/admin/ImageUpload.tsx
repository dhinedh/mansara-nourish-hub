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
            {preview ? (
                <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-slate-200 group">
                    <img
                        src={preview}
                        alt="Upload"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={handleRemove}
                            disabled={disabled}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                        isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:bg-slate-50",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                        <Upload className="h-8 w-8" />
                        <p className="font-medium">
                            {isDragActive ? "Drop the image here" : "Drag & drop an image here"}
                        </p>
                        <p className="text-xs">or click to select file</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
