import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "./components/app-sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SidebarProvider>
        {/* <AppSidebar /> */}
        <main className="flex flex-col w-full">
          <div className="p-5 flex justify-between">
            <SidebarTrigger variant="outline" />
            <div className="flex items-center gap-5"></div>
          </div>
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
