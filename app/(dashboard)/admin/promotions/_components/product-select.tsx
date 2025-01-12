"use client";

import { Check, X } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

// This would come from your API
const products = [
  {
    id: "1",
    name: "Product 1",
  },
  {
    id: "2",
    name: "Product 2",
  },
];

export function ProductSelect({ value = [], onChange }: ProductSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedProducts = products.filter((product) =>
    value.includes(product.id)
  );

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            Select products...
            <X
              className="ml-2 h-4 w-4 shrink-0 opacity-50"
              onClick={() => onChange([])}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Search products..." />
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup heading="Products">
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  onSelect={() => {
                    onChange(
                      value.includes(product.id)
                        ? value.filter((id) => id !== product.id)
                        : [...value, product.id]
                    );
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(product.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {product.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedProducts.map((product) => (
          <Badge
            key={product.id}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {product.name}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() =>
                onChange(value.filter((id) => id !== product.id))
              }
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}
