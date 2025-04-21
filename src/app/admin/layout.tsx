import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { IUser, UserProvider } from "@/context/UserContext";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

// interface User {
//   id: string;
//   name: string;
//   role: string;
//   password: string;
//   imageUrl: string;
// }

interface ExtendedSession extends Session {
  token?: {
    token: {
      user?: IUser;
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

  if (!session || !user) {
    redirect("/signin");
  }

  if (user?.role === "user" || user?.role === "superuser") {
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
        </SidebarProvider>
      </div>
    </UserProvider>
  );
}
