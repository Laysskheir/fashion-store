"use client";

import { useState, useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SliderImageUploadProps {
  form: UseFormReturn<any>;
  defaultImage?: string;
  onFileSelect: (file: File | null) => void;
}

export function SliderImageUpload({ form, defaultImage, onFileSelect }: SliderImageUploadProps) {
  const [preview, setPreview] = useState<string>(defaultImage || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizeImage = async (file: File): Promise<File> => {
    setIsOptimizing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/optimize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to optimize image");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to optimize image");
      }

      // Convert base64 to Blob
      const binaryString = atob(data.optimizedImage.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.optimizedImage.type });

      // Create new File object from Blob
      const optimizedFile = new File([blob], data.optimizedImage.name, {
        type: data.optimizedImage.type
      });

      // Format sizes for display
      const formatSize = (bytes: number) => {
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
      };

      toast.success(
        `Image optimized successfully! Size reduced from ${formatSize(data.optimizedImage.originalSize)} to ${formatSize(data.optimizedImage.optimizedSize)} (${data.optimizedImage.reduction} reduction)`
      );
      
      return optimizedFile;
    } catch (error) {
      console.error("Image optimization error:", error);
      toast.error("Failed to optimize image. Using original file.");
      return file;
    } finally {
      setIsOptimizing(false);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const error = fileRejections[0].errors[0];
        toast.error(error.message);
        return;
      }

      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      try {
        // Create preview immediately
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        
        // Start optimization
        const optimizedFile = await optimizeImage(file);
        
        setSelectedFile(optimizedFile);
        onFileSelect(optimizedFile);
        
        // Set a temporary value in the form
        form.setValue("imageUrl", "pending-upload", {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      } catch (error) {
        console.error("Preview creation failed:", error);
        toast.error('Failed to process image');
        setPreview("");
        setSelectedFile(null);
        onFileSelect(null);
        form.setValue("imageUrl", "", {
          shouldValidate: true
        });
      }
    },
    [form, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 32 * 1024 * 1024,
    disabled: isOptimizing
  });

  const removeImage = useCallback(() => {
    if (preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview("");
    setSelectedFile(null);
    onFileSelect(null);
    form.setValue("imageUrl", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
    toast.success('Image removed');
  }, [preview, form, onFileSelect]);

  return (
    <FormField
      control={form.control}
      name="imageUrl"
      render={({ field }) => (
        <FormItem>
          <Card>
            <CardHeader>
              <CardTitle>Slider Image</CardTitle>
              <CardDescription>
                Add a high-quality image for your slider. Recommended size: 1920x1080px.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 transition-colors",
                      isDragActive ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25",
                      preview ? "h-[400px]" : "h-[200px]",
                      isOptimizing ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                      "relative flex flex-col items-center justify-center gap-2"
                    )}
                  >
                    <input {...getInputProps()} />
                    {isOptimizing ? (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <p className="text-sm">Optimizing image...</p>
                        </div>
                      </div>
                    ) : preview ? (
                      <>
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage();
                            }}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Remove image</span>
                          </Button>
                          <p className="text-white text-center">
                            Drop a new image here or click to replace
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                          {isDragActive ? "Drop the image here" : "Drag & drop or click to upload"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Upload a single image in JPG, PNG, WebP format (max 32MB). Images will be optimized automatically.
              </FormDescription>
              <FormMessage />
            </CardContent>
          </Card>
        </FormItem>
      )}
    />
  );
}
