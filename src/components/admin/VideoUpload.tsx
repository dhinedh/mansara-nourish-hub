import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Video as VideoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface VideoUploadProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
    value,
    onChange,
    disabled
}) => {
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file); // API expects 'image' key even for video in current route setup

            try {
                const { uploadImage } = await import('@/lib/api');
                // We're using the same upload endpoint which now handles videos
                const response = await uploadImage(file);
                onChange(response.url);
            } catch (error) {
                console.error('Upload failed', error);
                alert('Video upload failed');
            } finally {
                setUploading(false);
            }
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/*': ['.mp4', '.webm', '.ogg']
        },
        maxFiles: 1,
        disabled: disabled || uploading
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all overflow-hidden min-h-[200px] flex flex-col items-center justify-center",
                    isDragActive ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary/50 hover:bg-slate-50",
                    (disabled || uploading) && "opacity-50 cursor-not-allowed"
                )}
            >
                <input {...getInputProps()} />

                {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-primary font-medium">Uploading video...</p>
                    </div>
                ) : value ? (
                    <>
                        <video
                            src={value}
                            className="absolute inset-0 w-full h-full object-contain bg-black"
                            controls
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-2 top-2 z-10 w-8 h-8 rounded-full shadow-sm"
                            onClick={handleRemove}
                            disabled={disabled}
                            title="Remove video"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 py-4 text-slate-500">
                        <div className="p-4 rounded-full bg-slate-100 mb-2">
                            <VideoIcon className="h-8 w-8" />
                        </div>
                        <div className="text-sm">
                            <span className="font-semibold text-primary text-lg">Click to upload video</span>
                            <br />
                            <span className="text-slate-500">or drag and drop</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            MP4, WebM or Ogg (max. 10MB)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoUpload;
