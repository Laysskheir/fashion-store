
import * as React from "react"

import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  PackageCheck,
  Percent,
  BarChart2,
  MessageSquare,
  Settings,
  Building2,
  CreditCard,
  Truck,
  Receipt,
  Image as ImageIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import AdminLogo from "./admin-logo"

const data = {
  navMain: [
    {
      title: "Store Management",
      url: "/admin",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: "Products",
          url: "/admin/products",
          icon: Package,
        },
        {
          title: "Categories",
          url: "/admin/categories",
          icon: FolderTree,
        },
        {
          title: "Sliders",
          url: "/admin/sliders",
          icon: BarChart2,
        },
        {
          title: "Looks",
          url: "/admin/looks",
          icon: ImageIcon,
        },
        {
          title: "Orders",
          url: "/admin/orders",
          icon: ShoppingCart,
        },
        {
          title: "Customers",
          url: "/admin/customers",
          icon: Users,
        },
        {
          title: "Inventory",
          url: "/admin/inventory",
          icon: PackageCheck,
        },
        {
          title: "Promotions",
          url: "/admin/promotions",
          icon: Percent,
        },

        {
          title: "Reviews",
          url: "/admin/reviews",
          icon: MessageSquare,
        },
        {
          title: "Settings",
          url: "/admin/settings",
          icon: Settings,
        },
      ],
    },
    {
      title: "Store Settings",
      url: "/admin/settings",
      items: [
        {
          title: "Payment",
          url: "/admin/settings/payment",
          icon: CreditCard,
        },
        {
          title: "Shipping",
          url: "/admin/settings/shipping",
          icon: Truck,
        },
        {
          title: "Taxes",
          url: "/admin/settings/taxes",
          icon: Receipt,
        },
      ],
    },
    {
      title: "Integrations",
      url: "/admin/integrations",
      items: [
        {
          title: "Payment Gateways",
          url: "/admin/integrations/payments",
          icon: CreditCard,
        },
        {
          title: "Shipping Providers",
          url: "/admin/integrations/shipping",
          icon: Truck,
        },
        {
          title: "Third-party Apps",
          url: "/admin/integrations/apps",
          icon: Settings,
        }
      ]
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AdminLogo />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="italic">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        className={"hover:bg-muted"}
                        asChild
                        isActive={item.isActive}
                        tooltip={item.title}
                      >
                        <a href={item.url}>
                          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
