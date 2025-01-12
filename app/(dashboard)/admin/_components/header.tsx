"use client";

import React from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import {
  UserIcon,
  Loader2,
  Settings,
  Users,
  BarChart3,
  LogOut,
  Building2,
  Shield,
  Bell
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DarkMode } from "@/components/layouts/dark-mode";
import { NotificationsButton } from "./notifications-button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
}

interface User {
  name?: string | null;
  image?: string | null;
  email?: string | null;
  role?: string | null;
}

const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    path: `/${segments.slice(0, index + 1).join("/")}`,
    isLast: index === segments.length - 1,
  }));
};

const UserDropdown: React.FC<{ user: User }> = ({ user }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="relative border-l ring-0 rounded-none h-14 w-14 hidden md:flex shrink-0"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.image ?? ""} alt={`${user.name}'s avatar`} />
          <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end">
      <DropdownMenuLabel>
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href="/admin/dashboard" className="flex items-center cursor-pointer">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/users" className="flex items-center cursor-pointer">
            <Users className="w-4 h-4 mr-2" />
            User Management
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/organizations" className="flex items-center cursor-pointer">
            <Building2 className="w-4 h-4 mr-2" />
            Organizations
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/roles" className="flex items-center cursor-pointer">
            <Shield className="w-4 h-4 mr-2" />
            Roles & Permissions
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href="/admin/settings" className="flex items-center cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/notifications" className="flex items-center cursor-pointer">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-red-600 focus:text-red-600 cursor-pointer"
        onClick={() => signOut()}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const BreadcrumbNav: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <Breadcrumb>
    <BreadcrumbList>
      {items.map((item) => (
        <React.Fragment key={item.path}>
          <BreadcrumbItem>
            {item.isLast ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={item.path}>{item.label}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {!item.isLast && <BreadcrumbSeparator />}
        </React.Fragment>
      ))}
    </BreadcrumbList>
  </Breadcrumb>
);


const ErrorHeader: React.FC<{ error: Error }> = ({ error }) => (
  <div className="flex h-16 shrink-0 items-center border-b px-4 bg-background">
    <Alert variant="destructive" className="w-full">
      <AlertDescription>
        Failed to load user session: {error.message}
      </AlertDescription>
    </Alert>
  </div>
);

export default function Header() {
  const { data: session, error } = useSession();
  const pathname = usePathname();

  if (error) {
    return <ErrorHeader error={error} />;
  }

  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger className="-ml-1" />
      <BreadcrumbNav items={breadcrumbs} />
      <div className="ml-auto flex items-center gap-2">
        <NotificationsButton />
        <DarkMode />
        {session?.user ? <UserDropdown user={session.user} /> : null}
      </div>
    </div>
  );
}