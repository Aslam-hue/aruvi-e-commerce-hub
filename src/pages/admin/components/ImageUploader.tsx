import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUploader = ({ images, onChange, maxImages = 10 }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      if (images.length + newImages.length >= maxImages) break;
      
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Compress if too large
          if (width > 800) {
            height = (height * 800) / width;
            width = 800;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          newImages.push(compressedBase64);

          if (newImages.length === Math.min(files.length, maxImages - images.length)) {
            onChange([...images, ...newImages]);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer backdrop-blur-sm ${
          isDragging
            ? 'border-primary bg-primary/10 scale-105'
            : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 rounded-full bg-gradient-to-br from-primary to-primary/50">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {isDragging ? 'Drop images here' : 'Upload Product Images'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Drag & drop or click to select ({images.length}/{maxImages})
            </p>
          </div>
        </div>
      </motion.div>

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10"
              >
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="rounded-full shadow-xl"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Image number badge */}
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/5">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};
