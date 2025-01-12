'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from 'sonner'
import { updateAppearance } from '@/actions/settings'

const appearanceSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  fontFamily: z.string(),
})

type AppearanceSettingsValues = z.infer<typeof appearanceSettingsSchema>

export function AppearanceSettingsForm({ initialData }) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AppearanceSettingsValues>({
    resolver: zodResolver(appearanceSettingsSchema),
    defaultValues: initialData || {
      theme: 'system',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      fontFamily: 'Inter',
    },
  })

  async function onSubmit(data: AppearanceSettingsValues) {
    setIsLoading(true)
    try {
      await updateAppearance(data)
      toast.success("Appearance updated")
    } catch (error) {
      toast.error("An error occurred while updating appearance settings.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the default theme for your store.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="primaryColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Color</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Input {...field} type="color" className="w-12 h-12 p-1" />
                  <Input {...field} className="flex-grow" />
                </div>
              </FormControl>
              <FormDescription>
                The main color used throughout your store.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secondaryColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Color</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Input {...field} type="color" className="w-12 h-12 p-1" />
                  <Input {...field} className="flex-grow" />
                </div>
              </FormControl>
              <FormDescription>
                The secondary color used for accents and highlights.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fontFamily"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font Family</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The main font family used for text in your store.
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
