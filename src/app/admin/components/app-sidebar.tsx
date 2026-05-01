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

const user = {
  name: "Cristina Posada",
  email: "cp@example.com",
  avatar: "/cp.png",
};

export function AppSidebar() {
  const imageUrl = "/logoposada.png";

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="bg-white">
          <SidebarGroupLabel className="my-5 bg-white">
            <div className="w-60 overflow-hidden bg-white">
              <AspectRatio ratio={21 / 9}>
                <Image
                  src={imageUrl}
                  alt="Logo Posada"
                  layout="fill"
                  priority
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
