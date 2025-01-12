'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { Address } from '@prisma/client'

export async function addAddress(data: Omit<Address, 'id'>): Promise<Address> {
  const newAddress = await db.address.create({
    data,
  })
  revalidatePath('/addresses')
  return newAddress
}

export async function updateAddress(id: string, data: Partial<Address>): Promise<Address> {
  const updatedAddress = await db.address.update({
    where: { id },
    data,
  })
  revalidatePath('/addresses')
  return updatedAddress
}

export async function deleteAddress(id: string): Promise<void> {
  await db.address.delete({
    where: { id },
  })
  revalidatePath('/addresses')
}

export async function getAddresses(userId: string): Promise<Address[]> {
  return await db.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' },
  })
}

export async function setDefaultAddress(userId: string, addressId: string): Promise<Address> {
  await db.$transaction([
    db.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    }),
    db.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    }),
  ])
  
  const updatedAddress = await db.address.findUnique({
    where: { id: addressId },
  })

  if (!updatedAddress) {
    throw new Error('Address not found')
  }

  revalidatePath('/addresses')
  return updatedAddress
}

