import Link from "next/link";
import { Card } from "../ui/card";
import { Category } from "@prisma/client";

interface CollectionCardProps {
  title: string;
  description: string;
  href: string;
  className?: string;
}

function CollectionCard({ title, description, href }: CollectionCardProps) {
  return (
    <Link href={href}>
      <Card className="p-6 shadow-md shadow-primary-foreground group hover:scale-105 transition-all duration-300 ease-in-out">
        <h3 className="text-2xl font-bold mb-2 group-hover:underline ">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </Card>
    </Link>
  );
}

export default function TopCollections({ subcategories }: { subcategories: Category[] }) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Collections
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary font-serif">
            Discover Your Style
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((category) => (
            <CollectionCard
              key={category.id}
              title={category.name}
              description={`${category.name} - Discover the latest trends in ${category.name.toLowerCase()}'s fashion and accessories.`}
              href={`/categories/${category.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
