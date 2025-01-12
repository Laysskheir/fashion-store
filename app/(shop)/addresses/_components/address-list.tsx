'use client'

import { useState } from 'react'
import { Address } from '@prisma/client'
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddressForm } from './address-form'
import { AddressCard } from './address-card'

type AddressListProps = {
  initialAddresses: Address[]
  userId: string
}

export function AddressList({ initialAddresses, userId }: AddressListProps) {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleAddressUpdate = (updatedAddress: Address) => {
    setAddresses(addresses.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr))
  }

  const handleAddressDelete = (deletedId: string) => {
    setAddresses(addresses.filter(addr => addr.id !== deletedId))
  }

  const handleAddressAdd = (newAddress: Address) => {
    setAddresses([...addresses, newAddress])
    setIsAddingNew(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onUpdate={handleAddressUpdate}
            onDelete={handleAddressDelete}
            userId={userId}
          />
        ))}
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-full min-h-[200px] flex flex-col items-center justify-center">
              <Plus className="h-8 w-8 mb-2" />
              <span>Add New Address</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <AddressForm onSuccess={handleAddressAdd} userId={userId} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

