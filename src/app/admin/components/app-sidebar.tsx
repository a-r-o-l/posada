"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import AppSideBarMenu from "./AppSideBarMenu";
import { NavUser } from "./nav-user";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { useTheme } from "next-themes";

const user = {
  name: "Cristina Posada",
  email: "cp@example.com",
  avatar: "/cp.png",
};

export function AppSidebar() {
  const theme = useTheme();

  const imageUrl =
    theme.theme === "dark" ? "/posadalogowhite.png" : "/posadalogoblack.png";

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-5">
            <div className="w-60 overflow-hidden">
              <AspectRatio ratio={21 / 9}>
                <Image
                  src={imageUrl}
                  alt="Logo Posada"
                  layout="fill"
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </AspectRatio>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-5">
            <SidebarMenu>
              <AppSideBarMenu />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
