// app/actions/settings.ts
'use server'

import { revalidatePath } from "next/cache"
import { StoreSettings, UpdateSettingsData } from "@/types/settings"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function getSettings(): Promise<StoreSettings | null> {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    try {
        const settings = await db.storeSettings.findFirst()
        return settings
    } catch (error) {
        console.error('Error fetching settings:', error)
        throw new Error('Failed to fetch settings')
    }
}

export async function updateSettings(data: UpdateSettingsData) {
    const session = await getSession();

    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    try {
        const settings = await db.storeSettings.upsert({
            where: { id: data.id || 'default' },
            update: {
                ...data,
                updatedAt: new Date(),
            },
            create: {
                ...data,
                id: 'default',
            },
        })

        revalidatePath('/admin/settings')
        return { success: true, settings }
    } catch (error) {
        console.error('Error updating settings:', error)
        throw new Error('Failed to update settings')
    }
}

export async function updateAppearance(data: UpdateSettingsData['appearance']) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    try {
        const settings = await db.storeSettings.update({
            where: { id: 'default' },
            data: {
                appearance: data,
                updatedAt: new Date(),
            },
        })

        revalidatePath('/admin/settings')
        return { success: true, settings }
    } catch (error) {
        console.error('Error updating appearance:', error)
        throw new Error('Failed to update appearance')
    }
}

export async function updatePaymentSettings(data: UpdateSettingsData['payment']) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    try {
        const settings = await db.storeSettings.update({
            where: { id: 'default' },
            data: {
                payment: data,
                updatedAt: new Date(),
            },
        })

        revalidatePath('/admin/settings')
        return { success: true, settings }
    } catch (error) {
        console.error('Error updating payment settings:', error)
        throw new Error('Failed to update payment settings')
    }
}

export async function updateShippingSettings(data: UpdateSettingsData['shipping']) {
    return null
}

export async function updateEmailSettings(data: UpdateSettingsData['email']) {
    return null
}

export async function updateAdvancedSettings(data: UpdateSettingsData['advanced']) {
    return null
}