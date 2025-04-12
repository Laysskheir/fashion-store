"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Category } from "@prisma/client";
import { LogsIcon } from "lucide-react";

interface NavMenuProps {
  categories: (Category & {
    children: Category[];
  })[];
}

const COLORS = [
  "text-pink-500 hover:text-pink-600",
  "text-blue-500 hover:text-blue-600",
  "text-red-500 hover:text-red-600",
  "text-emerald-500 hover:text-emerald-600",
];

export function NavMenu({ categories }: NavMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [colorIndex, setColorIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % COLORS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 top-[var(--navbar-height)] bg-background/80 backdrop-blur-sm" />
      )}
      <NavigationMenu onValueChange={(value) => setIsOpen(value.length > 0)}>
        <NavigationMenuList className="flex-wrap justify-center gap-1">
          <NavigationMenuItem>
            <Link href="/products" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  COLORS[colorIndex],
                  "transition-colors duration-1000 font-semibold italic"
                )}
              >
                <LogsIcon className="mr-2 h-4 w-4" />
                Shop All
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {categories.map((category) => (
            <NavigationMenuItem key={category.id}>
              <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[300px] sm:w-[400px] lg:w-[500px] p-4">
                  {category.children.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {category.children.map((subcategory) => (
                          <ListItem
                            key={subcategory.id}
                            title={subcategory.name}
                            href={`/categories/${subcategory.slug}`}
                            className="col-span-1"
                          />
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <ListItem
                          title={`All ${category.name}`}
                          href={`/categories/${category.slug}`}
                          className="bg-muted/50"
                        >
                          View all products in {category.name}
                        </ListItem>
                      </div>
                    </>
                  ) : (
                    <ListItem
                      title={category.name}
                      href={`/categories/${category.slug}`}
                    />
                  )}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={props.href || ""}
        prefetch={true}
        className={cn(
          "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        {children && (
          <p className="line-clamp-2 mt-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        )}
      </Link>
    </NavigationMenuLink>
  );
});
ListItem.displayName = "ListItem";
