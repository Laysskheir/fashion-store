"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProductForm } from "../form-context";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { generateSlug } from "@/lib/validators/product";

type Category = {
  id: string;
  name: string;
  level: number;
  parentId?: string | null;
};

export function BasicInfo() {
  const { form, categories, subcategories } = useProductForm();
  const [mainCategories, setMainCategories] = useState<Category[]>([]);

  // Watch form values for dynamic slug generation and category selection
  const productName = form.watch("name");
  const selectedCategoryId = form.watch("categoryId");

  // Automatically generate slug when product name changes
  useEffect(() => {
    if (productName) {
      form.setValue("slug", generateSlug(productName), { 
        shouldValidate: true 
      });
    }
  }, [productName]);

  // Separate main categories
  useEffect(() => {
    const main = categories.filter(cat => cat.level === 0);
    setMainCategories(main);
  }, [categories]);

  // Memoized filtered subcategories
  const filteredSubcategories = useMemo(() => {
    const filtered = selectedCategoryId 
      ? subcategories.filter(subcat => {
        // Ensure the subcategory's parent matches the selected category
        const matchesParent = subcat.parentId === selectedCategoryId;
        return matchesParent;
      })
      : [];
    
    return filtered;
  }, [selectedCategoryId, subcategories]);

  // Handle main category change
  const handleMainCategoryChange = (categoryId: string) => {
    // Reset subcategory when main category changes
    form.setValue("subcategoryId", "");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Provide essential details about your product
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Slug</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Auto-generated URL-friendly name" 
                    {...field} 
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide a detailed description of the product" 
                    className="min-h-[150px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleMainCategoryChange(value);
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mainCategories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory (Optional)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!selectedCategoryId || filteredSubcategories.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue 
                        placeholder={
                          !selectedCategoryId 
                            ? "Select a category first" 
                            : filteredSubcategories.length === 0 
                              ? "No subcategories available" 
                              : "Select a subcategory"
                        } 
                      />
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
                  <Input 
                    placeholder="Enter product brand" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter product material" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
