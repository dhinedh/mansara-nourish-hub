import React, { useCallback, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, Video as VideoIcon, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/lib/api'; // We can reuse this if it handles generic uploads or create a new one

interface VideoUploadProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
    hidePreview?: boolean;
}

// ========================================
// VIDEO UPLOAD COMPONENT
// ========================================

const VideoUpload: React.FC<VideoUploadProps> = ({
    value,
    onChange,
    disabled,
    className,
    hidePreview
}) => {
    const [preview, setPreview] = useState<string | undefined>(value);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Update internal preview if value changes externally
    React.useEffect(() => {
        setPreview(value);
    }, [value]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        try {
            setIsUploading(true);
            setUploadProgress(0);

            // Create local preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Upload to server
            // Simulate progress for better UX if actual progress isn't available
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 500);

            const response = await uploadImage(file); // Assuming uploadImage handles videos too based on backend logic

            clearInterval(progressInterval);
            setUploadProgress(100);

            onChange(response.url);
            setPreview(response.url);
            console.log('[Upload] ✓ Video upload complete:', response.url);

        } catch (error) {
            console.error('[Upload] ✗ Upload failed:', error);
            alert('Upload failed. Please try again.');
            setPreview(undefined); // Reset on failure
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/*': ['.mp4', '.webm', '.ogg', '.mov']
        },
        maxFiles: 1,
        disabled: disabled || isUploading,
        maxSize: 50 * 1024 * 1024, // 50MB limit for videos
        onDropRejected: (rejections) => {
            rejections.forEach(rejection => {
                if (rejection.errors.some(e => e.code === 'file-too-large')) {
                    alert('File is too large. Maximum size is 50MB.');
                } else {
                    alert('Invalid file type. Please upload a video.');
                }
            });
        }
    });

    const handleRemove = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(undefined);
        onChange('');
    }, [onChange]);

    return (
        <div className={cn("w-full", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-lg text-center cursor-pointer transition-all overflow-hidden flex flex-col items-center justify-center",
                    "min-h-[200px] p-4",
                    isDragActive ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary/50 hover:bg-slate-50",
                    (disabled || isUploading) && "opacity-50 cursor-not-allowed",
                    className
                )}
            >
                <input {...getInputProps()} />

                {/* Loading State */}
                {isUploading && (
                    <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        <span className="text-sm font-medium text-slate-700">
                            Uploading Video... {uploadProgress}%
                        </span>
                    </div>
                )}

                {/* Preview State */}
                {preview && !hidePreview && !isUploading ? (
                    <div className="relative w-full h-full min-h-[200px] bg-black flex items-center justify-center">
                        <video
                            src={preview}
                            className="max-h-[200px] w-full object-contain"
                            controls
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-2 top-2 z-10 w-8 h-8 rounded-full shadow-sm"
                            onClick={handleRemove}
                            disabled={disabled || isUploading}
                            title="Remove video"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    /* Empty State */
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
                            MP4, WebM, MOV (max. 50MB)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoUpload;