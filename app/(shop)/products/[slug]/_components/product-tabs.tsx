import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { FileText, List, Truck, ChevronDown } from 'lucide-react';
import { ProductWithDetails } from "@/features/products/management/types/product.types";

interface ProductTabsProps {
  product: ProductWithDetails;
}

const items = [
  {
    id: "description",
    icon: FileText,
    title: "Description",
    sub: "Product details and specifications",
    content: (product: ProductWithDetails) => (
      product.description ? (
        <div
          className="prose prose-sm max-w-none text-muted-foreground [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-4"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      ) : (
        <p className="text-muted-foreground">No description available.</p>
      )
    ),
  },
  {
    id: "details",
    icon: List,
    title: "Details",
    sub: "Technical specifications and materials",
    content: (product: ProductWithDetails) => (
      <div className="grid gap-4 sm:grid-cols-2">
        {product.brand && (
          <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
            <p className="font-medium mb-1">Brand</p>
            <p className="text-muted-foreground">{product.brand}</p>
          </div>
        )}
        {product.material && (
          <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
            <p className="font-medium mb-1">Material</p>
            <p className="text-muted-foreground">{product.material}</p>
          </div>
        )}
        {product.dimensions && (
          <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
            <p className="font-medium mb-1">Dimensions</p>
            <p className="text-muted-foreground">{product.dimensions}</p>
          </div>
        )}
        {product.weight && (
          <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
            <p className="font-medium mb-1">Weight</p>
            <p className="text-muted-foreground">{product.weight}g</p>
          </div>
        )}
      </div>
    ),
  },
  {
    id: "shipping",
    icon: Truck,
    title: "Shipping",
    sub: "Delivery options and information",
    content: () => (
      <div className="space-y-4">
        <div className="rounded-lg border p-4 flex items-start space-x-4">
          <div className="p-2 rounded-full bg-primary/10">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium mb-1">Free Standard Shipping</h4>
            <p className="text-sm text-muted-foreground">On orders over $50</p>
          </div>
        </div>
        <div className="rounded-lg border p-4 flex items-start space-x-4">
          <div className="p-2 rounded-full bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium mb-1">Express Shipping</h4>
            <p className="text-sm text-muted-foreground">Available at checkout</p>
          </div>
        </div>
        <div className="rounded-lg border p-4 flex items-start space-x-4">
          <div className="p-2 rounded-full bg-primary/10">
            <List className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium mb-1">International Shipping</h4>
            <p className="text-sm text-muted-foreground">Available to select countries</p>
          </div>
        </div>
      </div>
    ),
  },
];

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="description">
      {items.map((item) => (
        <AccordionItem value={item.id} key={item.id} className="py-2">
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between py-2 text-left text-[15px] font-semibold leading-6 transition-all [&[data-state=open]>svg]:rotate-180">
              <span className="flex items-center gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border"
                  aria-hidden="true"
                >
                  <item.icon size={16} strokeWidth={2} className="opacity-60" />
                </span>
                <span className="flex flex-col space-y-1">
                  <span>{item.title}</span>
                  {item.sub && <span className="text-sm font-normal text-muted-foreground">{item.sub}</span>}
                </span>
              </span>
              <ChevronDown
                size={16}
                strokeWidth={2}
                className="shrink-0 opacity-60 transition-transform duration-200"
                aria-hidden="true"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent className="ms-3 pb-2 ps-10 text-muted-foreground">
            {typeof item.content === 'function' ? item.content(product) : item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
