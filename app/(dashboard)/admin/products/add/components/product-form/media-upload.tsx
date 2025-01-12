"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  ImageIcon, 
  Trash2, 
  Star, 
  StarOff 
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useProductForm } from "../form-context";

export function MediaUpload() {
  const { form } = useProductForm();
  const images = form.watch("images") || [];

  const onDrop = (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      isDefault: false
    }));

    form.setValue("images", [...images, ...newImages], { 
      shouldValidate: true 
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    form.setValue("images", updatedImages, { 
      shouldValidate: true 
    });
  };

  const toggleDefaultImage = (indexToToggle: number) => {
    const updatedImages = images.map((img, index) => ({
      ...img,
      isDefault: index === indexToToggle
    }));

    form.setValue("images", updatedImages, { 
      shouldValidate: true 
    });
  };

  return (
    <div className="space-y-6">
      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer 
          transition-colors duration-200
          ${isDragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-muted-foreground/30 hover:border-primary'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            {isDragActive 
              ? "Drop images here" 
              : "Drag 'n' drop product images, or click to select files"
            }
          </p>
          <p className="text-xs text-muted-foreground">
            (Maximum file size: 5MB, Supported formats: JPEG, PNG, WebP)
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="relative group border rounded-lg overflow-hidden"
            >
              <Image
                src={image.url}
                alt={`Product image ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  type="button"
                  size="icon"
                  variant={image.isDefault ? "default" : "secondary"}
                  className="opacity-0 group-hover:opacity-100"
                  onClick={() => toggleDefaultImage(index)}
                >
                  {image.isDefault ? <Star /> : <StarOff />}
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}