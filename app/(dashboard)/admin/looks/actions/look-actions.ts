"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type LookFormValues = {
    name: string;
    description?: string;
    image: string;
    isActive: boolean;
    productIds: string[];
};

export const createLook = async (data: LookFormValues) => {
    try {
        const look = await db.look.create({
            data: {
                name: data.name,
                description: data.description,
                image: data.image,
                isActive: data.isActive,
                products: {
                    connect: data.productIds.map((id) => ({ id })),
                },
            },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        revalidatePath("/admin/looks");
        return look;
    } catch (error) {
        console.error("[CREATE_LOOK]", error);
        throw new Error("Failed to create look");
    }
};

export const updateLook = async (id: string, data: LookFormValues) => {
    try {
        // Find the current look to get existing product connections
        const currentLook = await db.look.findUnique({
            where: { id },
            include: {
                products: {
                    select: { productId: true }
                }
            }
        });

        if (!currentLook) {
            throw new Error("Look not found");
        }

        // Determine which products to disconnect and connect
        const currentProductIds = currentLook.products.map(p => p.productId);
        const newProductIds = data.productIds;

        const productsToDisconnect = currentProductIds.filter(
            id => !newProductIds.includes(id)
        );
        const productsToConnect = newProductIds.filter(
            id => !currentProductIds.includes(id)
        );

        // Update the look with selective product connections
        const look = await db.look.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                image: data.image,
                isActive: data.isActive,
                products: {
                    // Disconnect products no longer in the look
                    deleteMany: {
                        productId: { in: productsToDisconnect }
                    },
                    // Connect new products
                    create: productsToConnect.map((productId) => ({
                        product: {
                            connect: { id: productId }
                        }
                    }))
                }
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        });

        revalidatePath("/admin/looks");
        return look;
    } catch (error) {
        console.error("[UPDATE_LOOK]", error);
        throw new Error("Failed to update look");
    }
};

export const deleteLook = async (id: string) => {
    try {
        // First delete all product connections
        await db.look.update({
            where: { id },
            data: {
                products: {
                    deleteMany: {}
                }
            }
        });

        // Then delete the look
        const look = await db.look.delete({
            where: { id }
        });

        revalidatePath("/admin/looks");
        return look;
    } catch (error) {
        console.error("[DELETE_LOOK]", error);
        throw new Error("Failed to delete look");
    }
};

export async function getAdminLooks() {
    try {
        const looks = await db.look.findMany({
            include: {
                products: {
                    include: {
                        product: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return looks;
    } catch (error) {
        console.error("[ADMIN_LOOKS_GET]", error);
        throw new Error("Failed to fetch looks");
    }
}