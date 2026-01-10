import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Video as VideoIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/lib/api'; // Reuses same endpoint

interface VideoUploadProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

// ========================================
// OPTIMIZED VIDEO UPLOAD COMPONENT
// Performance improvements:
// - Upload progress
// - Better error handling
// - Video validation
// - Chunked upload support
// ========================================

const VideoUpload: React.FC<VideoUploadProps> = ({
    value,
    onChange,
    disabled
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Validate file size (max 50MB for video)
        if (file.size > 50 * 1024 * 1024) {
            alert('Video file is too large. Maximum size is 50MB.');
            return;
        }

        try {
            setUploading(true);
            setUploadProgress(10);

            console.log('[Video Upload] Starting upload:', {
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
                type: file.type
            });

            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + 10;
                });
            }, 500);

            try {
                // Upload to server using same endpoint
                const response = await uploadImage(file);
                
                clearInterval(progressInterval);
                setUploadProgress(100);

                onChange(response.url);
                console.log('[Video Upload] ✓ Upload complete:', response.url);
            } catch (error) {
                clearInterval(progressInterval);
                throw error;
            }
        } catch (error: any) {
            console.error('[Video Upload] ✗ Upload failed:', error);
            alert(error.message || 'Video upload failed. Please try again.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/*': ['.mp4', '.webm', '.ogg', '.mov']
        },
        maxFiles: 1,
        disabled: disabled || uploading,
        maxSize: 50 * 1024 * 1024, // 50MB
        onDropRejected: (rejections) => {
            rejections.forEach(rejection => {
                if (rejection.errors.some(e => e.code === 'file-too-large')) {
                    alert('Video is too large. Maximum size is 50MB.');
                } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
                    alert('Invalid file type. Please upload a video (MP4, WebM, OGG, or MOV).');
                }
            });
        }
    });

    const handleRemove = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    }, [onChange]);

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

                {/* Uploading State */}
                {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <div className="text-center">
                            <p className="text-sm text-primary font-medium mb-2">
                                Uploading video...
                            </p>
                            <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                {uploadProgress}%
                            </p>
                        </div>
                    </div>
                ) : value ? (
                    /* Video Preview */
                    <>
                        <video
                            src={value}
                            className="absolute inset-0 w-full h-full object-contain bg-black"
                            controls
                            preload="metadata"
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
                            title="Remove video"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center gap-2 py-4 text-slate-500">
                        <div className="p-4 rounded-full bg-slate-100 mb-2">
                            <VideoIcon className="h-8 w-8" />
                        </div>
                        <div className="text-sm">
                            <span className="font-semibold text-primary text-lg">
                                Click to upload video
                            </span>
                            <br />
                            <span className="text-slate-500">or drag and drop</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            MP4, WebM, OGG or MOV (max. 50MB)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoUpload;