"use client";
import React from "react";
import Logo from "./Logo";
import { DarkMode } from "./dark-mode";
import { Heart, Menu, SearchIcon, UserIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { CartButton } from "./cart-button";
import { NavMenu } from "./nav-menu";
import { NavLink } from "./nav-link";
import Link from "next/link";
import { SearchDrawer } from "./search-drawer";
import UserProfile from "./user-button";
import { Banner } from "./banner";
import { WishlistButton } from "./wishlist-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { useSession } from "@/lib/auth-client";

const navMenu = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Sale",
    path: "/sales",
  },
  {
    name: "Categories",
    path: "/categories",
  },
  {
    name: "Looks",
    path: "/looks",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

export default function Navbar({ categories }: { categories: any[] }) {
  const { data: session } = useSession();

  return (
    <header>
      <Banner />
      <div className="relative">
        {/* Main Navbar */}
        <div className="sticky top-0 bg-background backdrop-blur-md z-30 border-t">
          <nav className="flex items-center justify-between px-4 sm:px-5 py-1 border-b text-foreground">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <SheetHeader className="p-6 pb-2">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] pb-10">
                  <div className="px-6 space-y-6">
                    <div className="space-y-2">
                      {navMenu.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          prefetch={true}
                          className="block px-2 py-2 text-lg font-medium hover:bg-accent rounded-md"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="space-y-1">
                        {categories.map((category) => (
                          <div key={category.id} className="space-y-2">
                            <Link
                              href={`/categories/${category.slug}`}
                              prefetch={true}
                              className="block px-2 py-2 text-base font-medium hover:bg-accent rounded-md"
                            >
                              {category.name}
                            </Link>
                            <div className="ml-4 space-y-1">
                              {category.children.map((subcat) => (
                                <Link
                                  key={subcat.id}
                                  href={`/categories/${subcat.slug}`}
                                  prefetch={true}
                                  className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md"
                                >
                                  {subcat.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Left section with Logo */}
            <div className="flex items-center gap-2 shrink-0 w-[120px] md:w-[180px]">
              <Logo />
            </div>

            {/* Center section with Navigation Links */}
            <div className="hidden md:flex flex-1 items-center justify-center">
              <ul className="flex items-center gap-4 lg:gap-6">
                {navMenu.map((menu, i) => (
                  <li key={i}>
                    <NavLink href={menu.path}>{menu.name}</NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right section with DarkMode toggle and Icons */}
            <div className="flex items-center shrink-0 w-[120px] md:w-[180px] justify-end gap-0.5 md:gap-1">
              <DarkMode className="hidden md:flex" />
              <SearchDrawer>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="border-l ring-0 rounded-none h-12 md:h-14 w-12 md:w-14 shrink-0 hidden md:flex"
                  aria-label="Search"
                >
                  <SearchIcon className="w-4 h-4" />
                </Button>
              </SearchDrawer>
              <WishlistButton className="hidden md:flex" />
              <CartButton className="flex" /> {/* Always show cart */}
              {session?.user ? (
                <UserProfile user={session.user} className="hidden md:flex" />
              ) : (
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="border-l ring-0 rounded-none h-12 md:h-14 w-12 md:w-14 shrink-0 hidden md:flex"
                  aria-label="User Profile"
                  asChild
                >
                  <Link href="/auth/signin" prefetch={true}>
                    <UserIcon className="w-4 h-4" />
                  </Link>
                </Button>
              )}
            </div>
          </nav>

          {/* Categories Menu Row */}
          <div className="hidden md:block border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex justify-center py-1">
              <NavMenu categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
