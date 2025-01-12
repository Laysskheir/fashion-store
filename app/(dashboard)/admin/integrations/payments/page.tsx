"use client"
import React, { useState, useEffect } from "react"
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Icons } from "@/components/Icons"
import { z } from "zod"

// Zod validation schema
const PaymentGatewaySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(['stripe', 'paypal', 'custom']),
  apiKey: z.string().min(10, "API Key must be valid"),
  isLive: z.boolean(),
  webhookSecret: z.string().optional(),
  status: z.enum(['connected', 'pending', 'error']).default('pending')
})

// Payment Gateway Types
type PaymentGateway = z.infer<typeof PaymentGatewaySchema>

export default function PaymentGatewaysPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([])
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch gateways from API
  useEffect(() => {
    async function fetchGateways() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/payment-gateways')
        if (!response.ok) {
          throw new Error('Failed to fetch payment gateways')
        }
        const data = await response.json()
        setGateways(data)
      } catch (error) {
        console.error('Error fetching gateways:', error)
        toast.error('Failed to load payment gateways')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGateways()
  }, [])

  // Add new gateway
  const handleAddGateway = async () => {
    const newGateway: PaymentGateway = {
      id: `custom-${Date.now()}`,
      name: 'New Payment Gateway',
      type: 'custom',
      apiKey: '',
      isLive: false,
      status: 'pending'
    }

    try {
      const validatedGateway = PaymentGatewaySchema.parse(newGateway)
      setSelectedGateway(validatedGateway)
      setIsAddDialogOpen(true)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error('Invalid gateway configuration')
      }
    }
  }

  // Update gateway
  const handleUpdateGateway = async (updatedGateway: PaymentGateway) => {
    try {
      // Validate gateway data
      const validatedGateway = PaymentGatewaySchema.parse(updatedGateway)

      // Send update to backend
      const response = await fetch('/api/payment-gateways', {
        method: updatedGateway.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedGateway)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update gateway')
      }

      const savedGateway = await response.json()

      // Update local state
      setGateways(current =>
        current.map(gw => gw.id === savedGateway.id ? savedGateway : gw)
      )

      toast.success(`Gateway "${savedGateway.name}" updated successfully`)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Gateway update error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update gateway')
    }
  }

  // Delete gateway
  const handleDeleteGateway = async (gatewayId: string) => {
    try {
      const response = await fetch(`/api/payment-gateways/${gatewayId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete gateway')
      }

      setGateways(current => current.filter(gw => gw.id !== gatewayId))
      toast.success("Payment gateway removed")
    } catch (error) {
      console.error('Gateway deletion error:', error)
      toast.error('Failed to remove payment gateway')
    }
  }

  // Test connection
  const handleTestConnection = async (gateway: PaymentGateway) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/payment-gateways/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gateway)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Connection test failed')
      }

      // Update gateway status
      const updatedGateway = { ...gateway, status: 'connected' }
      await handleUpdateGateway(updatedGateway)

      toast.success('Connection successful')
    } catch (error) {
      console.error('Connection test error:', error)

      // Update gateway status to error
      const updatedGateway = { ...gateway, status: 'error' }
      await handleUpdateGateway(updatedGateway)

      toast.error(error instanceof Error ? error.message : 'Connection test failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <RefreshCw className="animate-spin h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <CreditCard className="mr-2" /> Payment Gateways
          </h1>
          <p className="text-muted-foreground">
            Manage and configure your payment integrations
          </p>
        </div>
        <Button onClick={handleAddGateway} disabled={isLoading}>
          <Plus className="mr-2" /> Add Gateway
        </Button>
      </div>

      <Tabs defaultValue="configured">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="configured">Configured Gateways</TabsTrigger>
          <TabsTrigger value="available">Available Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="configured">
          <Card>
            <CardHeader>
              <CardTitle>Configured Payment Gateways</CardTitle>
              <CardDescription>
                Manage your active payment integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gateways.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No payment gateways configured
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Environment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gateways.map((gateway) => (
                      <TableRow key={gateway.id}>
                        <TableCell>{gateway.name}</TableCell>
                        <TableCell className="uppercase">{gateway.type}</TableCell>
                        <TableCell>
                          {gateway.isLive ? 'Production' : 'Sandbox'}
                        </TableCell>
                        <TableCell>
                          {gateway.status === 'connected' ? (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle2 className="mr-1 h-4 w-4" /> Connected
                            </span>
                          ) : gateway.status === 'pending' ? (
                            <span className="text-yellow-600 flex items-center">
                              <RefreshCw className="mr-1 h-4 w-4" /> Pending
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center">
                              <XCircle className="mr-1 h-4 w-4" /> Error
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setSelectedGateway(gateway)
                                setIsAddDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleTestConnection(gateway)}
                              disabled={isLoading}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteGateway(gateway.id!)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle>Available Payment Providers</CardTitle>
              <CardDescription>
                Explore and integrate new payment gateways
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Stripe', logo: 'stripe', type: 'stripe' },
                  { name: 'PayPal', logo: 'paypal', type: 'paypal' },
                ].map((provider) => (
                  <Card
                    key={provider.name}
                    className="hover:border-primary transition-colors cursor-pointer"
                    onClick={() => {
                      const newGateway: PaymentGateway = {
                        name: `${provider.name} Gateway`,
                        type: provider.type as PaymentGateway['type'],
                        apiKey: '',
                        isLive: false,
                        status: 'pending'
                      }
                      setSelectedGateway(newGateway)
                      setIsAddDialogOpen(true)
                    }}
                  >
                    <CardContent className="flex flex-col items-center p-6">
                      {provider.logo === 'stripe' ?
                        <Icons.stripe className="h-8 w-8 mb-4" /> :
                        <Icons.paypal className="h-8 w-8 mb-4" />}
                      <h3 className="font-semibold">{provider.name}</h3>
                      <Button variant="outline" className="mt-4">
                        Connect
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Gateway Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedGateway?.id ? 'Edit Payment Gateway' : 'Add New Payment Gateway'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Gateway Name</Label>
              <Input
                value={selectedGateway?.name || ''}
                onChange={(e) => selectedGateway && setSelectedGateway({
                  ...selectedGateway,
                  name: e.target.value
                })}
              />
            </div>

            <div>
              <Label>Gateway Type</Label>
              <Select
                value={selectedGateway?.type}
                onValueChange={(value) => selectedGateway && setSelectedGateway({
                  ...selectedGateway,
                  type: value as PaymentGateway['type']
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gateway type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>API Key</Label>
              <Input
                type="password"
                value={selectedGateway?.apiKey || ''}
                onChange={(e) => selectedGateway && setSelectedGateway({
                  ...selectedGateway,
                  apiKey: e.target.value
                })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={selectedGateway?.isLive}
                onCheckedChange={(checked) => selectedGateway && setSelectedGateway({
                  ...selectedGateway,
                  isLive: checked
                })}
              />
              <Label>Production Environment</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedGateway && handleUpdateGateway(selectedGateway)}
                disabled={isLoading}
              >
                Save and Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}