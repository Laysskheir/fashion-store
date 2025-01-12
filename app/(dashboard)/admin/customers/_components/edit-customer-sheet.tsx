"use client"

import { useState } from "react"
import { User } from "@prisma/client"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"

interface EditCustomerSheetProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onUpdate: (user: Partial<User>) => Promise<void>
}

export function EditCustomerSheet({ user, isOpen, onClose, onUpdate }: EditCustomerSheetProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    shippingAddress: user.shippingAddress || "",
    billingAddress: user.billingAddress || "",
    preferredShipping: user.preferredShipping || "standard",
    newsletterSubscribed: user.newsletterSubscribed || false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onUpdate(formData)
      onClose()
    } catch (error) {
      console.error("Failed to update customer:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Edit Customer</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-8">
          <Accordion type="single" collapsible defaultValue="general">
            <AccordionItem value="general">
              <AccordionTrigger>General Information</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="addresses">
              <AccordionTrigger>Addresses</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="shippingAddress">Shipping Address</Label>
                  <Input
                    id="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Input
                    id="billingAddress"
                    value={formData.billingAddress}
                    onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="preferences">
              <AccordionTrigger>Shopping Preferences</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="preferredShipping">Preferred Shipping Method</Label>
                  <Select
                    value={formData.preferredShipping}
                    onValueChange={(value) => setFormData({ ...formData, preferredShipping: value })}
                  >
                    <SelectTrigger id="preferredShipping">
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Shipping</SelectItem>
                      <SelectItem value="express">Express Shipping</SelectItem>
                      <SelectItem value="overnight">Overnight Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="newsletterSubscribed"
                    checked={formData.newsletterSubscribed}
                    onCheckedChange={(checked) => setFormData({ ...formData, newsletterSubscribed: checked })}
                  />
                  <Label htmlFor="newsletterSubscribed">Subscribe to newsletter</Label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

