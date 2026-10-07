'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Check, Loader2, Image as ImageIcon, Plus } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface ImageUploaderProps {
  primaryImage: string;
  onPrimaryImageChange: (url: string) => void;
  galleryImages: string[];
  onGalleryImagesChange: (urls: string[]) => void;
}

export function ImageUploader({
  primaryImage,
  onPrimaryImageChange,
  galleryImages,
  onGalleryImagesChange,
}: ImageUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          successCount++;
          if (!primaryImage && i === 0) {
            onPrimaryImageChange(data.url);
          } else {
            onGalleryImagesChange([...galleryImages, data.url]);
          }
        } else {
          toast(data.error || `Upload failed for ${file.name}`, 'error');
        }
      } catch {
        toast(`Upload failed for ${file.name}`, 'error');
      }
    }

    setIsUploading(false);
    if (successCount > 0) {
      toast(`Successfully uploaded ${successCount} image(s) to ImgBB!`, 'success');
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    const url = manualUrl.trim();
    if (!primaryImage) {
      onPrimaryImageChange(url);
    } else if (!galleryImages.includes(url)) {
      onGalleryImagesChange([...galleryImages, url]);
    }
    setManualUrl('');
    setShowManualInput(false);
    toast('Image URL added!', 'success');
  };

  const handleRemoveImage = (url: string) => {
    if (primaryImage === url) {
      if (galleryImages.length > 0) {
        onPrimaryImageChange(galleryImages[0]);
        onGalleryImagesChange(galleryImages.slice(1));
      } else {
        onPrimaryImageChange('');
      }
    } else {
      onGalleryImagesChange(galleryImages.filter((img) => img !== url));
    }
  };

  const handleSetAsPrimary = (url: string) => {
    if (primaryImage === url) return;
    const oldPrimary = primaryImage;
    onPrimaryImageChange(url);
    if (oldPrimary) {
      const updatedGallery = galleryImages.filter((img) => img !== url);
      onGalleryImagesChange([oldPrimary, ...updatedGallery]);
    }
  };

  const allImages = [
    ...(primaryImage ? [{ url: primaryImage, isPrimary: true }] : []),
    ...galleryImages.map((url) => ({ url, isPrimary: false })),
  ];

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
          isUploading
            ? 'border-emerald-500 bg-emerald-50/50'
            : 'border-gray-200 hover:border-[#0B5D36] hover:bg-[#f8fbf9]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="w-8 h-8 text-[#0B5D36] animate-spin" />
            <p className="text-xs font-bold text-[#0B5D36]">Uploading to ImgBB CDN...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0B5D36] flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">
                Click to upload or drag and drop images
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                PNG, JPG, WEBP (Hosted securely on ImgBB CDN)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Manual URL fallback toggle */}
      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[#0B5D36] hover:underline font-semibold flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Image URL manually</span>
        </button>
        <span className="text-gray-400 text-[11px]">
          {allImages.length} {allImages.length === 1 ? 'image' : 'images'} added
        </span>
      </div>

      {showManualInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/... or https://i.ibb.co/..."
            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-4 py-2 bg-[#0B5D36] text-white rounded-xl text-xs font-semibold hover:bg-[#074528]"
          >
            Add
          </button>
        </div>
      )}

      {/* Image Thumbnails Previews (matching reference design!) */}
      {allImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
          {allImages.map(({ url, isPrimary }, idx) => (
            <div
              key={idx}
              className={`relative group aspect-square rounded-2xl border-2 p-1.5 bg-[#f8faf9] flex items-center justify-center overflow-hidden transition-all ${
                isPrimary ? 'border-[#0B5D36] shadow-xs' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={url}
                alt={`Product image ${idx + 1}`}
                className="w-full h-full object-contain mix-blend-multiply"
              />

              {/* Badges & Actions Overlay */}
              {isPrimary && (
                <span className="absolute top-1.5 left-1.5 bg-[#0B5D36] text-white text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs z-10">
                  Primary
                </span>
              )}

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-20">
                {!isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleSetAsPrimary(url)}
                    title="Set as Primary Image"
                    className="p-1.5 bg-white text-[#0B5D36] rounded-lg hover:scale-110 transition-transform"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  title="Remove Image"
                  className="p-1.5 bg-red-600 text-white rounded-lg hover:scale-110 transition-transform"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
