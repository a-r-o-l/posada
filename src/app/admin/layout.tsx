import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { AuthInitializer } from "@/components/auth-initializer";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/zustand/auth-store-server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentProfile();

  if (!currentUser) {
    redirect("/");
  } else if (currentUser.role !== "admin") {
    redirect("/store");
  }
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col w-full">
          <div className="p-5 flex justify-between">
            <SidebarTrigger variant="outline" />
            <div className="flex items-center gap-5"></div>
          </div>
          <AuthInitializer />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
