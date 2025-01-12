"use client";

import React, { useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Plus 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useProductForm } from "../form-context";

// Predefined color and size options
const COLOR_OPTIONS = [
  "Red", "Blue", "Green", "Yellow", "Black", "White", 
  "Gray", "Pink", "Purple", "Orange", "Brown"
];

const SIZE_OPTIONS = [
  "XS", "S", "M", "L", "XL", "XXL", 
  "2XL", "3XL", "4XL", "One Size"
];

// Utility function to generate SKU
function generateSKU(productName: string): string {
  // Create acronym from product name
  const acronym = productName
    .split(' ')
    .map(word => word[0].toUpperCase())
    .join('');
  
  // Generate random 6-digit number
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  
  return `${acronym}-${randomNumber}`;
}

export function Variants() {
  const { form } = useProductForm();
  const productName = form.watch("name") || "Product";
  const variants = form.watch("variants") || [];

  const addVariant = () => {
    const newVariant = { 
      name: "", 
      sku: generateSKU(productName), 
      price: "", 
      color: "", 
      size: "", 
      inventory: "0"
    };

    form.setValue("variants", [
      ...variants, 
      newVariant
    ], { shouldValidate: true });
  };

  const removeVariant = (indexToRemove: number) => {
    const updatedVariants = variants.filter((_, index) => index !== indexToRemove);
    form.setValue("variants", updatedVariants, { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
        <CardDescription>
          Create different variations of your product
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {variants.map((variant, index) => (
          <div 
            key={index} 
            className="border rounded-lg p-4 space-y-4 relative"
          >
            {/* Remove Variant Button */}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeVariant(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Variant Name */}
              <FormField
                control={form.control}
                name={`variants.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Red T-Shirt Large" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SKU (Auto-generated) */}
              <FormField
                control={form.control}
                name={`variants.${index}.sku`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input 
                        readOnly 
                        value={field.value || generateSKU(productName)} 
                        className="bg-muted cursor-not-allowed"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Color */}
              <FormField
                control={form.control}
                name={`variants.${index}.color`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COLOR_OPTIONS.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Size */}
              <FormField
                control={form.control}
                name={`variants.${index}.size`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SIZE_OPTIONS.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name={`variants.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Inventory */}
              <FormField
                control={form.control}
                name={`variants.${index}.inventory`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        <Button 
          type="button" 
          variant="outline" 
          className="w-full mt-4"
          onClick={addVariant}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Variant
        </Button>
      </CardContent>
    </Card>
  );
}
