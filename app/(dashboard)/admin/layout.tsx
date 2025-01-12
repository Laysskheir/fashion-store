import React, { Suspense } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { Toaster } from "sonner";
import Header from "./_components/header";
import Loading from "./loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="p-4">
          <Suspense fallback={<Loading />}>
          {children}
        </Suspense></div>
        <Toaster />
      </SidebarInset>

    </SidebarProvider>
  );
}
