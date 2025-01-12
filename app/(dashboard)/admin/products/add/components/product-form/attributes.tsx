"use client";

import React from "react";
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
import { Trash2, Plus } from "lucide-react";
import { useProductForm } from "../form-context";

export function Attributes() {
  const { form } = useProductForm();
  const attributes = form.watch("attributes") || [];

  const addAttribute = () => {
    form.setValue("attributes", [
      ...attributes, 
      { name: "", value: "" }
    ], { shouldValidate: true });
  };

  const removeAttribute = (indexToRemove: number) => {
    const updatedAttributes = attributes.filter((_, index) => index !== indexToRemove);
    form.setValue("attributes", updatedAttributes, { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Attributes</CardTitle>
        <CardDescription>
          Add custom attributes to provide more details about your product
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {attributes.map((_, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <FormField
              control={form.control}
              name={`attributes.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attribute Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Color, Size" 
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
                <FormItem>
                  <FormLabel>Attribute Value</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Red, Large" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end space-x-2">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeAttribute(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button 
          type="button" 
          variant="outline" 
          className="w-full mt-4"
          onClick={addAttribute}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Attribute
        </Button>
      </CardContent>
    </Card>
  );
}
