"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Car,
  ClipboardList,
  Package,
  CreditCard,
  CalendarDays,
  BarChart3,
  Settings,
  ChevronRight,
  FileText,
  ClipboardCheck,
  MessageSquare,
  Wrench,
  ShoppingCart,
  Megaphone,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Work Orders", href: "/work-orders", icon: ClipboardList },
      { title: "Estimates", href: "/estimates", icon: FileText },
      { title: "Inspections", href: "/inspections", icon: ClipboardCheck },
    ],
  },
  {
    label: "People",
    items: [
      { title: "Customers", href: "/customers", icon: Users },
      { title: "Vehicles", href: "/vehicles", icon: Car },
      { title: "Technicians", href: "/technicians", icon: Wrench },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Calendar", href: "/calendar", icon: CalendarDays },
      { title: "Inventory", href: "/inventory", icon: Package },
      { title: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart },
      { title: "Payments", href: "/payments", icon: CreditCard },
    ],
  },
  {
    label: "Growth",
    items: [
      { title: "Communications", href: "/communications", icon: MessageSquare },
      { title: "Marketing", href: "/marketing", icon: Megaphone },
      { title: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      {/* Logo */}
      <SidebarHeader className="px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Image src="/logo.png" alt="FleetFlow" width={32} height={32} className="shrink-0" />
          <span className="font-bold text-lg tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
            FleetFlow
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-muted-foreground/60 uppercase text-[10px] tracking-widest mb-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={
                        <Link href={item.href} prefetch={true} className="flex items-center gap-3">
                          <item.icon className="size-4 shrink-0" />
                          <span>{item.title}</span>
                          {active && <ChevronRight className="ml-auto size-3 text-primary/60" />}
                        </Link>
                      }
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-150",
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <Link href="/settings" prefetch={true} className="flex items-center gap-3">
                  <Settings className="size-4 shrink-0" />
                  <span>Settings</span>
                </Link>
              }
              tooltip="Settings"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <button className="flex items-center gap-3 w-full">
                  <Avatar className="size-6 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                      BL
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="text-xs font-medium text-foreground">Blake</span>
                    <span className="text-[10px] text-muted-foreground">Admin</span>
                  </div>
                </button>
              }
              tooltip="Account"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
