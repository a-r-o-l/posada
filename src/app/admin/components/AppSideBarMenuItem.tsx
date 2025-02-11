"use client";
import React from "react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AppSideBarMenuItem({
  item,
  notification,
}: {
  item: {
    title: string;
    url: string;
    icon: React.FC;
    private: boolean;
  };
  role: string;
  notification?: number;
}) {
  const pathname = usePathname();
  const isActive =
    item.url === "/admin"
      ? pathname === item.url
      : pathname.startsWith(item.url);
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild className="h-12 my-2">
        <Link
          href={item.url}
          color="blue"
          className={`justify-between ${
            isActive ? "bg-blue-500 text-white" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <item.icon />
            <span>{item.title}</span>
          </div>
          {!!notification && notification > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
              {notification}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default AppSideBarMenuItem;
