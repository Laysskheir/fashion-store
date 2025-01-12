"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import {
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  DollarSign,
  Package,
  Tags,
  Layers,
  Info,
  Loader2,
  Building,
} from "lucide-react";
import * as z from "zod";

import {
  Button
} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formProductSchema } from "@/schemas";
import { Category } from "@prisma/client";
import { slugify } from "@/lib/utils";
import { createProduct } from "@/features/products/management/actions/create-product";
import { useUploadThing } from "@/lib/uploadthing";

interface TempImage {
  file: File;
  preview: string;
}

const defaultValues = {
  name: "",
  slug: "",
  description: "",
  price: "",
  comparePrice: "",
  sku: "",
  barcode: "",
  inventory: "0",
  categoryId: "",
  subcategoryId: "",
  brand: "",
  weight: "",
  dimensions: "",
  material: "",
  careInstructions: "",
  isActive: true,
  images: [],
  attributes: [{ name: "", value: "" }],
  variants: [{ name: "", value: "" }],
};

interface AddCategoryFormProps {
  categories: Category[];
  subcategories: Category[];
}

export function ProductForm({
  categories,
  subcategories,
}: AddCategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [showVariants, setShowVariants] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [tempImages, setTempImages] = useState<TempImage[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { startUpload } = useUploadThing("productImage");

  // Filter subcategories based on selected parent category
  const filteredSubcategories = selectedCategoryId
    ? subcategories.filter((sub) => sub.parentId === selectedCategoryId)
    : [];

  const handleCategoryChange = (value: string) => {
    const category = categories.find(cat => cat.id === value);
    if (category) {
      setSelectedCategoryId(value);
      setSelectedSubcategoryId(null);
      // Only set categoryId if no subcategory is selected
      if (!selectedSubcategoryId) {
        form.setValue("categoryId", value);
      }
    }
  };

  const handleSubcategoryChange = (value: string) => {
    const subcategory = subcategories.find(sub => sub.id === value);
    if (subcategory) {
      setSelectedSubcategoryId(value);
      // Update the categoryId to the subcategory id
      form.setValue("categoryId", value);
    }
  };

  const form = useForm({
    resolver: zodResolver(formProductSchema),
    defaultValues,
  });

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
    update: updateVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const onSubmit = async (data: z.infer<typeof formProductSchema>) => {
    try {
      setLoading(true);
      
      // Upload images only when form is being submitted
      let imageUrls: string[] = [];
      if (tempImages.length > 0) {
        const uploadedImages = await startUpload(tempImages.map(img => img.file));
        if (uploadedImages) {
          imageUrls = uploadedImages.map((image) => image.url);
        }
      }

      // Clean up all preview URLs
      tempImages.forEach(img => {
        URL.revokeObjectURL(img.preview);
      });
      setPreviewUrls([]);
      setTempImages([]);

      // Add the image URLs to the form data with proper format
      const finalData = {
        ...data,
        images: imageUrls.map((url, index) => ({
          url,
          isDefault: index === 0
        }))
      };

      const result = await createProduct(finalData);

      if (result.success) {
        toast.success("Product created successfully");
        router.push("/admin/products");
      } else {
        toast.error(result.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="sticky top-0 z-10 bg-background pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Add New Product
              </h1>
              <p className="text-muted-foreground mt-1">
                Create a new product in your store
              </p>
            </div>
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {field.value ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/admin/categories")}
                >
                  Cancel
                </Button>
                <Button disabled={loading} type="submit" className="gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="basic">
                <Info className="w-4 h-4 mr-2" />
                Basic
              </TabsTrigger>
              <TabsTrigger value="media">
                <ImagePlus className="w-4 h-4 mr-2" />
                Media
              </TabsTrigger>
              <TabsTrigger value="pricing">
                <DollarSign className="w-4 h-4 mr-2" />
                Pricing
              </TabsTrigger>
              <TabsTrigger value="attributes">
                <Tags className="w-4 h-4 mr-2" />
                Attributes
              </TabsTrigger>
              <TabsTrigger value="variants">
                <Layers className="w-4 h-4 mr-2" />
                Variants
              </TabsTrigger>
              <TabsTrigger value="organization">
                <Building className="w-4 h-4 mr-2" />
                Organization
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the basic details of your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter product name"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              form.setValue("slug", slugify(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Choose a clear and descriptive name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="product-slug"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          URL-friendly version of the product name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your product..."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include key features and benefits
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter brand name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Add high-quality images of your product. First image will be
                    the default.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Images</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={previewUrls}
                            onChange={(files) => {
                              // Create preview URLs for the new files
                              const newPreviews = files.map(file => URL.createObjectURL(file));
                              setPreviewUrls(newPreviews);
                              
                              // Store the actual files
                              const newTempImages = files.map((file, index) => ({
                                file,
                                preview: newPreviews[index]
                              }));
                              setTempImages(newTempImages);

                              // Update form field with temporary preview URLs
                              field.onChange(newPreviews.map((url, index) => ({
                                url,
                                isDefault: index === 0
                              })));
                            }}
                            onRemove={(previewToRemove) => {
                              // Remove the preview URL and revoke it
                              setPreviewUrls(prev => prev.filter(url => url !== previewToRemove));
                              
                              // Remove the corresponding temp image
                              setTempImages(prev => {
                                const imageToRemove = prev.find(img => img.preview === previewToRemove);
                                if (imageToRemove) {
                                  URL.revokeObjectURL(imageToRemove.preview);
                                }
                                return prev.filter(img => img.preview !== previewToRemove);
                              });

                              // Update form field
                              field.onChange(previewUrls
                                .filter(url => url !== previewToRemove)
                                .map((url, index) => ({
                                  url,
                                  isDefault: index === 0
                                }))
                              );
                            }}
                            maxFiles={10}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload up to 10 images in JPG, PNG format (max 5MB
                          each)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Information</CardTitle>
                  <CardDescription>
                    Set your product's pricing strategy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                $
                              </span>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-6"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="comparePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compare at Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                $
                              </span>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-6"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Original price for showing discounts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Tracking</CardTitle>
                  <CardDescription>
                    Manage your product's stock information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter unique SKU" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter barcode (ISBN, UPC, GTIN)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inventory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Enter quantity in stock"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attributes" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Product Attributes</CardTitle>
                      <CardDescription>
                        Add specific details about your product
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendAttribute({ name: "", value: "" })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Attribute
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {attributeFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-4 mb-4"
                      >
                        <FormField
                          control={form.control}
                          name={`attributes.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="Attribute name (e.g., Material)"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`attributes.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="Value (e.g., Cotton)"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAttribute(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                  <CardDescription>
                    Specify product measurements and care instructions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter weight (e.g., 0.5 kg)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="L x W x H (e.g., 20 x 15 x 5 cm)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="careInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Care Instructions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter care and washing instructions..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="variants" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Product Variants</CardTitle>
                      <CardDescription>
                        Add variations of your product (e.g., different sizes,
                        colors)
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowVariants(!showVariants)}
                    >
                      {showVariants ? (
                        <ChevronUp className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      )}
                      {showVariants ? "Hide Variants" : "Add Variants"}
                    </Button>
                  </div>
                </CardHeader>
                {showVariants && (
                  <CardContent className="space-y-6">
                    <ScrollArea className="h-[600px] pr-4">
                      {variantFields.map((variantField, variantIndex) => (
                        <Card key={variantField.id} className="mb-4">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Variant {variantIndex + 1}
                            </CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeVariant(variantIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`variants.${variantIndex}.sku`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Variant SKU"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`variants.${variantIndex}.price`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                          $
                                        </span>
                                        <Input
                                          type="number"
                                          step="0.01"
                                          placeholder="0.00"
                                          className="pl-6"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`variants.${variantIndex}.inventory`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="0"
                                        placeholder="Quantity"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Options</h4>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const currentVariant = form.getValues(
                                      `variants.${variantIndex}`
                                    );
                                    const currentOptions =
                                      currentVariant.options || [];
                                    updateVariant(variantIndex, {
                                      ...currentVariant,
                                      options: [
                                        ...currentOptions,
                                        { name: "", value: "" },
                                      ],
                                    });
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Option
                                </Button>
                              </div>

                              {variantField.options?.map(
                                (option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className="flex items-center gap-4"
                                  >
                                    <FormField
                                      control={form.control}
                                      name={`variants.${variantIndex}.options.${optionIndex}.name`}
                                      render={({ field }) => (
                                        <FormItem className="flex-1">
                                          <FormControl>
                                            <Input
                                              placeholder="Option name (e.g., Size)"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name={`variants.${variantIndex}.options.${optionIndex}.value`}
                                      render={({ field }) => (
                                        <FormItem className="flex-1">
                                          <FormControl>
                                            <Input
                                              placeholder="Value (e.g., Large)"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        const newOptions =
                                          variantField.options?.filter(
                                            (_, i) => i !== optionIndex
                                          );
                                        form.setValue(
                                          `variants.${variantIndex}.options`,
                                          newOptions
                                        );
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </ScrollArea>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        appendVariant({
                          sku: "",
                          price: "",
                          inventory: "0",
                          options: [],
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variant
                    </Button>
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            {/* Organization Tab */}
            <TabsContent value="organization">
              <Card>
                <CardHeader>
                  <CardTitle>Product Organization</CardTitle>
                  <CardDescription>
                    Organize your product by selecting its category and subcategory
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Category Selection */}
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Category</FormLabel>
                        <Select
                          onValueChange={handleCategoryChange}
                          value={selectedCategoryId || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a main category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories
                              .filter(cat => !cat.parentId) // Only show main categories
                              .map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the main category for your product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subcategory Selection */}
                  {selectedCategoryId && filteredSubcategories.length > 0 && (
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategory</FormLabel>
                          <Select
                            onValueChange={handleSubcategoryChange}
                            value={selectedSubcategoryId || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subcategory" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filteredSubcategories.map((subcategory) => (
                                <SelectItem
                                  key={subcategory.id}
                                  value={subcategory.id}
                                >
                                  {subcategory.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select a more specific subcategory if applicable
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </Form>
  );
}
