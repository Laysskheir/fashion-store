import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import LookForm from "../_components/look-form";
import { getAllProducts } from "@/features/products/management/actions/shop/get-all-products";

interface Props {
    params: {
        id: string;
    };
}

export default async function EditLookPage({ params }: Props) {
    const products = await getAllProducts();

    const look = await db.look.findUnique({
        where: {
            id: params.id,
        },
        include: {
            products: true,
        },
    });

    if (!look) {
        notFound();
    }

    return <LookForm products={products} initialData={look} />;
}