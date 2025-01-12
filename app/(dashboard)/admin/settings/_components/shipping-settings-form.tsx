'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from 'sonner'
import { updateShippingSettings } from '@/actions/settings'

const shippingSettingsSchema = z.object({
    freeShippingEnabled: z.boolean(),
    freeShippingThreshold: z.number().min(0).optional(),
    flatRateShippingEnabled: z.boolean(),
    flatRateShippingCost: z.number().min(0).optional(),
    internationalShippingEnabled: z.boolean(),
})

type ShippingSettingsValues = z.infer<typeof shippingSettingsSchema>

export function ShippingSettingsForm({ initialData }) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ShippingSettingsValues>({
        resolver: zodResolver(shippingSettingsSchema),
        defaultValues: initialData || {
            freeShippingEnabled: false,
            freeShippingThreshold: 0,
            flatRateShippingEnabled: false,
            flatRateShippingCost: 0,
            internationalShippingEnabled: false,
        },
    })

    async function onSubmit(data: ShippingSettingsValues) {
        setIsLoading(true)
        try {
            await updateShippingSettings(data)
            toast.success("Shipping settings updated")
        } catch (error) {
            toast.error("An error occurred while updating shipping settings.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="freeShippingEnabled"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Enable Free Shipping
                                </FormLabel>
                                <FormDescription>
                                    Offer free shipping on orders above a certain amount.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {form.watch('freeShippingEnabled') && (
                    <FormField
                        control={form.control}
                        name="freeShippingThreshold"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Free Shipping Threshold</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" min="0" step="0.01" />
                                </FormControl>
                                <FormDescription>
                                    Minimum order amount for free shipping.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="flatRateShippingEnabled"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Enable Flat Rate Shipping
                                </FormLabel>
                                <FormDescription>
                                    Charge a flat rate for shipping.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {form.watch('flatRateShippingEnabled') && (
                    <FormField
                        control={form.control}
                        name="flatRateShippingCost"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Flat Rate Shipping Cost</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" min="0" step="0.01" />
                                </FormControl>
                                <FormDescription>
                                    Cost for flat rate shipping.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="internationalShippingEnabled"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Enable International Shipping
                                </FormLabel>
                                <FormDescription>
                                    Allow shipping to international addresses.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </form>
        </Form>
    )
}
