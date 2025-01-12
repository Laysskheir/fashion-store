'use client'

import { useState } from 'react'
import { Address } from '@prisma/client'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Building2, Pencil, Trash2 } from 'lucide-react'
import { AddressForm } from './address-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {setDefaultAddress, deleteAddress} from '../_actions/address-actions'


type AddressCardProps = {
  address: Address
  onUpdate: (address: Address) => void
  onDelete: (id: string) => void
  userId: string
}

export function AddressCard({ address, onUpdate, onDelete, userId }: AddressCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    await deleteAddress(address.id)
    onDelete(address.id)
  }

  const handleSetDefault = async () => {
    setIsLoading(true)
    const updatedAddress = await setDefaultAddress(userId, address.id)
    onUpdate(updatedAddress)
    setIsLoading(false)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            {address.type === 'SHIPPING' ? (
              <Home className="h-5 w-5 text-muted-foreground mt-1" />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground mt-1" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{address.type === 'SHIPPING' ? 'Shipping' : 'Billing'}</h3>
                {address.isDefault && (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Default</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1 mr-4">
                <ul>
                  <li>{address.firstName} {address.lastName}</li>
                  <li>{address.address1}</li>
                  {address.address2 && <li>{address.address2}</li>}
                  <li>{address.city}, {address.state} {address.postalCode}</li>
                  <li>{address.country}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Address</DialogTitle>
                </DialogHeader>
                <AddressForm
                  address={address}
                  onSuccess={(updatedAddress) => {
                    onUpdate(updatedAddress)
                    setIsEditing(false)
                  }}
                  userId={userId}
                />
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your address.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {!address.isDefault && (
              <Button variant="outline" size="sm" className="w-full" onClick={handleSetDefault} disabled={isLoading}>
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  'Set as Default'
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

