'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updatePaymentSettings } from '@/actions/settings'
import { toast } from 'sonner'

const paymentSettingsSchema = z.object({
  stripeEnabled: z.boolean(),
  stripePublishableKey: z.string().min(1).optional(),
  stripeSecretKey: z.string().min(1).optional(),
  paypalEnabled: z.boolean(),
  paypalClientId: z.string().min(1).optional(),
  paypalSecret: z.string().min(1).optional(),
})

type PaymentSettingsValues = z.infer<typeof paymentSettingsSchema>

export function PaymentSettingsForm({ initialData }) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PaymentSettingsValues>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: initialData || {
      stripeEnabled: false,
      stripePublishableKey: '',
      stripeSecretKey: '',
      paypalEnabled: false,
      paypalClientId: '',
      paypalSecret: '',
    },
  })

  async function onSubmit(data: PaymentSettingsValues) {
    setIsLoading(true)
    try {
      await updatePaymentSettings(data)
      toast.success("Payment settings updated")
    } catch (error) {
      toast.error("An error occurred while updating payment settings.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="stripeEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Enable Stripe Payments
                </FormLabel>
                <FormDescription>
                  Allow customers to pay using Stripe.
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
        {form.watch('stripeEnabled') && (
          <>
            <FormField
              control={form.control}
              name="stripePublishableKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Publishable Key</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>
                    Your Stripe publishable key.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stripeSecretKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Secret Key</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>
                    Your Stripe secret key.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name="paypalEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Enable PayPal Payments
                </FormLabel>
                <FormDescription>
                  Allow customers to pay using PayPal.
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
        {form.watch('paypalEnabled') && (
          <>
            <FormField
              control={form.control}
              name="paypalClientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PayPal Client ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Your PayPal client ID.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paypalSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PayPal Secret</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>
                    Your PayPal secret.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}

