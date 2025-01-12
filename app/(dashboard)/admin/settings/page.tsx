import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AppearanceSettingsForm } from './_components/appearance-settings-form'
import { ShippingSettingsForm } from './_components/shipping-settings-form'
import { EmailSettingsForm } from './_components/email-settings-form'
import { GeneralSettingsForm } from './_components/general-settings-form'
import { AdvancedSettingsForm } from './_components/advanced-settings-form'
import { getSettings } from '@/actions/settings'
import { PaymentSettingsForm } from './_components/payment-settings-form'


export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Store Settings</h1>
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <Separator className="mb-8" />
        <Suspense fallback={<div>Loading...</div>}>
          <TabsContent value="general">
            <GeneralSettingsForm initialData={settings} />
          </TabsContent>
          <TabsContent value="appearance">
            <AppearanceSettingsForm initialData={settings?.appearance} />
          </TabsContent>
          <TabsContent value="payment">
            <PaymentSettingsForm initialData={settings?.payment} />
          </TabsContent>
          <TabsContent value="shipping">
            <ShippingSettingsForm initialData={settings?.shipping} />
          </TabsContent>
          <TabsContent value="email">
            <EmailSettingsForm initialData={settings?.email} />
          </TabsContent>
          <TabsContent value="advanced">
            <AdvancedSettingsForm initialData={settings?.advanced} />
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  )
}

