'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

export interface UploadedImage {
  name: string;
  size: number;
  base64: string;
}

interface ImageUploadProps {
  onImagesChange?: (images: UploadedImage[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  title?: string;
  initialImages?: UploadedImage[];
}

const MAX_IMAGE_NAME_LENGTH = 40;

const getDisplayImageName = (name: string) => {
  if (name.length <= MAX_IMAGE_NAME_LENGTH) {
    return name;
  }

  const extensionIndex = name.lastIndexOf('.');
  const extension = extensionIndex > 0 ? name.slice(extensionIndex) : '';
  const baseName = extension ? name.slice(0, extensionIndex) : name;
  const availableBaseLength = MAX_IMAGE_NAME_LENGTH - extension.length - 3;

  return `${baseName.slice(0, Math.max(1, availableBaseLength))}...${extension}`;
};

export default function ImageUpload({
  onImagesChange,
  maxImages = 4,
  maxFileSize = 5,
  title = 'Project Images',
  initialImages = [],
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const processFiles = useCallback(
    async (files: FileList) => {
      const newImages: UploadedImage[] = [];
      const errors: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name} is not an image`);
          continue;
        }

        // Validate file size
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > maxFileSize) {
          errors.push(`${file.name} exceeds ${maxFileSize}MB limit`);
          continue;
        }

        // Check if we've reached max images
        if (images.length + newImages.length >= maxImages) {
          errors.push(`Maximum ${maxImages} images allowed`);
          break;
        }

        // Convert to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        try {
          const base64 = await base64Promise;
          newImages.push({
            name: file.name,
            size: file.size,
            base64,
          });
        } catch (error) {
          console.error(`Failed to process ${file.name}:`, error);
          errors.push(`Failed to process ${file.name}`);
        }
      }

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange?.(updatedImages);
      setError(errors.join('. '));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [images, maxImages, maxFileSize, onImagesChange]
  );

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onImagesChange?.(updated);
      setError('');
      return updated;
    });
  }, [onImagesChange]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className=" font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg px-8 py-3 text-center transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="w-6 h-6 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">
            Drop images or{' '}
            <button
              type="button"
              onClick={handleBrowseClick}
              className="font-semibold text-gray-900 dark:text-white hover:underline"
            >
              browse
            </button>
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}

      {/* Uploaded Images */}
      <div className="mt-4 space-y-2">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            {/* Thumbnail */}
            <img
              src={image.base64}
              alt={image.name}
              className="w-12 h-12 object-cover rounded border border-gray-200 dark:border-gray-600"
            />

            {/* Image Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {getDisplayImageName(image.name)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(image.size)}
              </p>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={`Remove ${image.name}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Helper Text */}
      {images.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          {images.length} of {maxImages} images
          {maxFileSize && `, ${maxFileSize}MB max each`}
        </p>
      )}

      {images.length === 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Up to {maxImages} images, {maxFileSize}MB each
        </p>
      )}
    </div>
  );
}
