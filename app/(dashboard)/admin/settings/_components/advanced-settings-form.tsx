'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateAdvancedSettings } from '@/actions/settings'
import { toast } from 'sonner'

const advancedSettingsSchema = z.object({
  maintenanceMode: z.boolean(),
  customCss: z.string(),
  googleAnalyticsId: z.string(),
  facebookPixelId: z.string(),
})

type AdvancedSettingsValues = z.infer<typeof advancedSettingsSchema>

export function AdvancedSettingsForm({ initialData }) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AdvancedSettingsValues>({
    resolver: zodResolver(advancedSettingsSchema),
    defaultValues: initialData || {
      maintenanceMode: false,
      customCss: '',
      googleAnalyticsId: '',
      facebookPixelId: '',
    },
  })

  async function onSubmit(data: AdvancedSettingsValues) {
    setIsLoading(true)
    try {
      await updateAdvancedSettings(data)
      toast.success("Advanced settings updated")
    } catch (error) {
      toast.error("An error occurred while updating advanced settings.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="maintenanceMode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Maintenance Mode
                </FormLabel>
                <FormDescription>
                  Enable maintenance mode to temporarily disable your store.
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
        <FormField
          control={form.control}
          name="customCss"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom CSS</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Add custom CSS to customize your store's appearance.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="googleAnalyticsId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Analytics ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Your Google Analytics tracking ID.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facebookPixelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook Pixel ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Your Facebook Pixel ID for tracking conversions.
              </FormDescription>
              <FormMessage />
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

