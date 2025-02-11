import { Toaster } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { UserProvider } from "@/context/UserContext";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

interface User {
  id: string;
  name: string;
  role: string;
  password: string;
  imageUrl: string;
}

interface ExtendedSession extends Session {
  token?: {
    token: {
      user?: User;
    };
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: ExtendedSession | null = await auth();

  const user = session?.token?.token?.user;

  if (!session) {
    redirect("/signin");
  }

  if (user?.role === "user") {
    redirect("/store");
  }

  return (
    <UserProvider user={user}>
      <div>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex flex-col w-full">
            <div className="p-5 flex justify-between">
              <SidebarTrigger variant="outline" />
              <div className="flex items-center gap-5"></div>
            </div>
            {children}
          </main>
          <Toaster richColors={true} />
        </SidebarProvider>
      </div>
    </UserProvider>
  );
}
