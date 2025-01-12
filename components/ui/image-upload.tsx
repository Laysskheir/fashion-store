import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (files: File[]) => void;
  onRemove: (url: string) => void;
  onDefault?: (url: string) => void;
  value: string[];
  maxFiles?: number;
}

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  onDefault,
  value = [],
  maxFiles = 5,
}: ImageUploadProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      
      // Check if adding new files would exceed the limit
      if (value.length + fileList.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} images`);
        return;
      }
      
      onChange(fileList);
    }
  }, [onChange, value.length, maxFiles]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px]">
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              {onDefault && (
                <Button
                  type="button"
                  onClick={() => onDefault(url)}
                  variant="secondary"
                  size="icon"
                >
                  ★
                </Button>
              )}
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover rounded-lg"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>
      <div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={disabled}
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <Button
          type="button"
          disabled={disabled || value.length >= maxFiles}
          onClick={() => document.getElementById('image-upload')?.click()}
          variant="secondary"
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
      </div>
    </div>
  );
}