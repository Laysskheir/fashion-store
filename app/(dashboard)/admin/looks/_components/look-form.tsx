"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader, Trash } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger } from "@/components/ui/multi-select";
import { createLook, updateLook } from "../actions/look-actions";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    image: z.string().min(1, "Image is required"),
    isActive: z.boolean().default(true),
    productIds: z.array(z.string())
        .min(1, "At least one product is required")
        .refine((ids) => new Set(ids).size === ids.length, {
            message: "Duplicate products are not allowed"
        }),
});

type LookFormValues = z.infer<typeof formSchema>;

type Product = {
    id: string;
    name: string;
};

type Look = {
    id: string;
    name: string;
    description?: string;
    image: string;
    isActive: boolean;
    products: Product[];
};

type Props = {
    products: Product[];
    initialData?: Look;
};

export default function LookForm({ products, initialData }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Look" : "Create Look";
    const description = initialData ? "Edit your look details" : "Fill in the details below to create a new look";
    const toastMessage = initialData ? "Look updated successfully" : "Look created successfully";
    const action = initialData ? "Save changes" : "Create Look";

    const form = useForm<LookFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            image: initialData?.image || "",
            isActive: initialData?.isActive ?? true,
            productIds: initialData?.products.map(p => p.id) || [],
        },
    });

    const onSubmit = async (data: LookFormValues) => {
        try {
            setLoading(true);

            if (initialData) {
                await updateLook(initialData.id, data);
            } else {
                await createLook(data);
            }

            router.push("/admin/looks");
            router.refresh();
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={() => router.push("/admin/looks")}
                loading={loading}
            />
            <div className="flex-1 space-y-4 p-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/admin/looks")}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Heading title={title} description={description} />

                </div>
                <Separator className="my-6" />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 w-full"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-semibold">Look Details</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Basic information about the look
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={loading}
                                                        placeholder="Enter look name"
                                                        {...field}
                                                        className="w-full"
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
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        disabled={loading}
                                                        placeholder="Enter look description"
                                                        {...field}
                                                        className="resize-none h-32"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>Active Status</FormLabel>
                                                    <FormDescription>
                                                        This look will be visible in the store when active
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-semibold">Look Image</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Upload an image for the look
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <ImageUpload
                                                        value={field.value ? [field.value] : []}
                                                        disabled={loading}
                                                        onChange={(url) => field.onChange(url[0])}
                                                        onRemove={() => field.onChange("")}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="productIds"
                                render={({ field }) => {
                                    // Create a map of product IDs to names for easy lookup
                                    const productMap = new Map(
                                        products.map(product => [product.id, product.name])
                                    );

                                    // Get selected product names
                                    const selectedProductNames = field.value
                                        ?.map(productId => productMap.get(productId))
                                        .filter(Boolean) as string[];

                                    // Check for duplicates
                                    const hasDuplicates = new Set(field.value).size !== field.value.length;

                                    return (
                                        <FormItem>
                                            <FormLabel>Products</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <MultiSelector
                                                        values={field.value || []}
                                                        onValuesChange={field.onChange}
                                                    >
                                                        <MultiSelectorTrigger 
                                                            className={hasDuplicates 
                                                                ? "border-destructive" 
                                                                : ""
                                                        }
                                                        >
                                                            <div className="flex flex-wrap gap-1 items-center w-full">
                                                                {selectedProductNames.map((name, index) => (
                                                                    <span 
                                                                        key={index} 
                                                                        className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs mr-1"
                                                                    >
                                                                        {name}
                                                                    </span>
                                                                ))}
                                                                <MultiSelectorInput 
                                                                    placeholder={selectedProductNames.length 
                                                                        ? "" 
                                                                        : "Select products..."
                                                                    } 
                                                                    className={`flex-grow ${hasDuplicates 
                                                                        ? "text-destructive" 
                                                                        : ""
                                                                    }`}
                                                                />
                                                            </div>
                                                        </MultiSelectorTrigger>
                                                        <MultiSelectorContent>
                                                            <MultiSelectorList>
                                                                {products.map((product) => (
                                                                    <MultiSelectorItem
                                                                        key={product.id}
                                                                        value={product.id}
                                                                        textValue={product.name}
                                                                    >
                                                                        {product.name}
                                                                    </MultiSelectorItem>
                                                                ))}
                                                            </MultiSelectorList>
                                                        </MultiSelectorContent>
                                                    </MultiSelector>
                                                    
                                                    {hasDuplicates && (
                                                        <p className="text-xs text-destructive mt-1">
                                                            Duplicate products are not allowed
                                                        </p>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                disabled={loading}
                                variant="outline"
                                type="button"
                                onClick={() => router.push("/admin/looks")}
                            >
                                Cancel
                            </Button>
                            <Button disabled={loading} type="submit">
                                {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                                {action}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    );
}