"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { DatePicker } from "@/components/ui/date-picker"; // updated import path
import { useState } from "react";
import { ProductSelect } from "./product-select";

const promotionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["percentage", "fixed"]),
  value: z.string().min(1, "Discount value is required"),
  startDate: z.date(),
  endDate: z.date(),
  description: z.string().optional(),
  products: z.array(z.string()).optional(),
});

type PromotionFormValues = z.infer<typeof promotionFormSchema>;

const defaultValues: Partial<PromotionFormValues> = {
  type: "percentage",
  description: "",
  products: [],
};

interface PromotionFormProps {
  initialData?: PromotionFormValues;
}

export function PromotionForm({ initialData }: PromotionFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: initialData || defaultValues,
  });

  async function onSubmit(data: PromotionFormValues) {
    try {
      setLoading(true);
      // Add your form submission logic here
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Summer Sale 2024" {...field} />
                </FormControl>
                <FormDescription>
                  The name of your promotion or sale
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How the discount will be calculated
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={form.watch("type") === "percentage" ? 100 : undefined}
                    placeholder={form.watch("type") === "percentage" ? "20" : "10.00"}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {form.watch("type") === "percentage"
                    ? "Enter percentage value (0-100)"
                    : "Enter fixed amount"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker 
                    date={field.value} 
                    setDate={(date) => field.onChange(date)}
                    placeholder="Select start date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <DatePicker 
                    date={field.value} 
                    setDate={(date) => field.onChange(date)}
                    placeholder="Select end date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter promotion details..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Additional details about the promotion
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="products"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Products</FormLabel>
              <FormControl>
                <ProductSelect
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Choose products to apply this promotion to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Promotion"}
        </Button>
      </form>
    </Form>
  );
}
