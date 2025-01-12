"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  Loader, 
  DollarSignIcon, 
  FolderTreeIcon, 
  ImageIcon, 
  Info, 
  LayersIcon, 
  ListChecksIcon 
} from "lucide-react";
import { Category } from "@prisma/client";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom Hooks and Utilities
import { useUploadThing } from "@/lib/uploadthing";
import { createProduct } from "@/features/products/management/actions/admin/create-product";
import { updateProduct } from "@/features/products/management/actions/admin/update-product";

// Local Imports
import { ProductFormProvider } from "../form-context";
import { ProductFormData } from "./types";
import { productFormSchema, validateProductForm } from "./validation-helpers";

// Section Components (to be created)
import { BasicInfo } from "./basic-info";
import { Pricing } from "./pricing";
import { Variants } from "./variants";
import { Attributes } from "./attributes";
import { Organization } from "./organization";
import { MediaUpload } from "./media-upload";

// Interfaces and Types
interface ProductFormProps {
  categories: Category[];
  subcategories: Category[];
  product?: any;
  isEditing?: boolean;
}

// Helper function to get default form values
function getDefaultValues(product?: any): ProductFormData {
  if (!product) return {
    name: "",
    slug: "",
    description: "",
    basePrice: "",
    categoryId: "",
    brand: "",
    weight: "",
    dimensions: "",
    material: "",
    careInstructions: "",
    isActive: true,
    images: [],
    variants: [],
    attributes: [],
    subcategoryId: ""
  };

  return {
    ...product,
    basePrice: product.basePrice.toString(),
    weight: product.weight || "",
    subcategoryId: product.subcategoryId || "",
    isActive: product.isActive ?? true,
    attributes: (product.attributes || []).map((attr: any) => ({
      name: attr.name || "",
      value: attr.value || ""
    })),
    images: (product.images || []).map((img: any) => ({
      url: img.url,
      isDefault: img.isDefault || false,
      file: null
    })),
    variants: (product.variants || []).map((variant: any) => ({
      ...variant,
      price: variant.price.toString(),
      comparePrice: variant.comparePrice?.toString() || "",
      inventory: variant.inventory.toString()
    }))
  };
}

// Image upload and data preprocessing
async function preprocessFormData(
  data: ProductFormData, 
  startUpload: (files: File[]) => Promise<{ url: string }[]>
) {
  // Handle image uploads
  const images = data.images || [];
  
  if (images.length === 0) {
    throw new Error("Please add at least one product image");
  }

  // Check for default image
  if (!images.some(img => img.isDefault)) {
    throw new Error("Please select a default image");
  }

  // Handle new image uploads
  const newImages = images.filter(img => img.file);
  let uploadedUrls: string[] = [];

  if (newImages.length > 0) {
    const imageFiles = newImages.map(img => img.file).filter(Boolean) as File[];
    if (imageFiles.length > 0) {
      const uploadResult = await startUpload(imageFiles);
      uploadedUrls = uploadResult.map(result => result.url);
    }
  }

  // Prepare final images data
  const finalImages = images.map((img, index) => {
    if (img.file) {
      const uploadedUrl = uploadedUrls[newImages.indexOf(img)];
      if (!uploadedUrl) {
        throw new Error("Failed to get uploaded image URL");
      }
      return {
        url: uploadedUrl,
        isDefault: img.isDefault
      };
    }
    return {
      url: img.url,
      isDefault: img.isDefault
    };
  });

  // Clean up attributes and variants
  const cleanAttributes = (data.attributes || [])
    .map(attr => ({
      name: attr.name?.trim() || "",
      value: attr.value?.trim() || ""
    }))
    .filter(attr => attr.name !== "" || attr.value !== "");

  const cleanVariants = data.variants.map(variant => ({
    name: variant.name.trim(),
    sku: variant.sku,
    price: variant.price,
    comparePrice: variant.comparePrice?.trim() || null,
    inventory: variant.inventory.toString(),
    color: variant.color,
    size: variant.size,
    isActive: variant.isActive ?? true
  }));

  // Prepare final form data
  return {
    name: data.name.trim(),
    slug: data.slug.trim(),
    description: data.description.trim(),
    basePrice: data.basePrice,
    categoryId: data.categoryId,
    brand: data.brand.trim(),
    weight: data.weight ? String(data.weight).trim() : null,
    dimensions: data.dimensions?.trim() || null,
    material: data.material?.trim() || null,
    careInstructions: data.careInstructions?.trim() || null,
    subcategoryId: data.subcategoryId || null,
    isActive: data.isActive ?? true,
    images: finalImages,
    variants: cleanVariants,
    attributes: cleanAttributes
  };
}

export function ProductForm({ 
  categories, 
  subcategories, 
  product, 
  isEditing = false 
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { startUpload } = useUploadThing("productImage");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getDefaultValues(product)
  });

  // Track form errors
  const formErrors = form.formState.errors;

  // Count errors per tab
  const tabErrors = {
    basic: Object.keys(formErrors).filter(key => 
      ['name', 'slug', 'description', 'categoryId', 'subcategoryId', 'brand', 'material'].includes(key)
    ).length,
    media: Object.keys(formErrors).filter(key => 
      ['images'].includes(key)
    ).length,
    pricing: Object.keys(formErrors).filter(key => 
      ['basePrice'].includes(key)
    ).length,
    variants: Object.keys(formErrors).filter(key => 
      key.startsWith('variants')
    ).length,
    organization: Object.keys(formErrors).filter(key => 
      ['weight', 'dimensions', 'careInstructions'].includes(key)
    ).length
  };

  const onSubmit = useCallback(async (data: ProductFormData) => {
    const { isValid, errors } = validateProductForm(data);
    
    if (!isValid) {
      Object.entries(errors).forEach(([key, message]) => {
        toast.error(message);
        form.setError(key as any, { type: 'manual', message });
      });
      return;
    }

    try {
      setLoading(true);

      const finalData = await preprocessFormData(data, startUpload);

      if (isEditing && product?.id) {
        await updateProduct(product.id, finalData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(finalData);
        toast.success("Product created successfully");
      }

      router.refresh();
      router.push("/admin/products");
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [form, isEditing, product, router, startUpload]);

  return (
    <ProductFormProvider
      form={form}
      isEditing={isEditing}
      categories={categories}
      subcategories={subcategories}
      product={product}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-background pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {isEditing ? "Edit Product" : "Add New Product"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isEditing 
                    ? "Update an existing product" 
                    : "Create a new product in your store"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/products")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={loading}
                  className="gap-2"
                >
                  {loading && <Loader className="h-4 w-4 animate-spin" />}
                  {loading
                    ? (isEditing ? "Updating..." : "Creating...")
                    : (isEditing ? "Update Product" : "Create Product")}
                </Button>
              </div>
            </div>
          </div>

          {/* Tabbed Sections */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Info className="h-4 w-4" /> Basic Info
                {tabErrors.basic > 0 && (
                  <Badge variant={"destructive"} className="rounded-full px-2">{tabErrors.basic}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Media
                {tabErrors.media > 0 && (
                  <Badge variant={"destructive"} className="rounded-full px-2">{tabErrors.media}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2">
                <DollarSignIcon className="h-4 w-4" /> Pricing
                {tabErrors.pricing > 0 && (
                  <Badge variant={"destructive"} className="rounded-full px-2">{tabErrors.pricing}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="variants" className="flex items-center gap-2">
                <LayersIcon className="h-4 w-4" /> Variants
                {tabErrors.variants > 0 && (
                  <Badge variant={"destructive"} className="rounded-full px-2">{tabErrors.variants}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="organization" className="flex items-center gap-2">
                <FolderTreeIcon className="h-4 w-4" /> Organization
                {tabErrors.organization > 0 && (
                  <Badge variant={"destructive"} className="rounded-full px-2">{tabErrors.organization}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <BasicInfo />
            </TabsContent>
            <TabsContent value="media">
              <MediaUpload />
            </TabsContent>
            <TabsContent value="pricing">
              <Pricing />
            </TabsContent>
            <TabsContent value="variants">
              <Variants />
            </TabsContent>
            <TabsContent value="organization">
              <Organization />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </ProductFormProvider>
  );
}
