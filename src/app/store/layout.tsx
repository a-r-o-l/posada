import { Toaster } from "sonner";
import { IUser, UserProvider } from "@/context/UserContext";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserAvatar from "./components/UserAvatar";
import HeaderShoppingCart from "./components/HeaderShoppingCart";

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

  if (user?.role === "admin") {
    redirect("/admin");
  }
  if (!user?.verified && user.role === "user") {
    redirect(`/signup/extradata?account=${user?.id}`);
  }

  return (
    <UserProvider user={user}>
      <header className="shadow-md top-0 sticky z-50 bg-[#F0F1FF]">
        <nav className="flex flex-row items-center overflow-hidden px-5 h-[10vh]">
          <Link href="/store" className="">
            <div
              style={{ backgroundImage: "url(/logoposada.png)" }}
              className="w-40 h-20 bg-cover bg-center"
            ></div>
          </Link>
          <div className="w-full flex items-center justify-between px-5">
            <div className="w-full hidden lg:flex items-center gap-10">
              <Link href="/store" className="">
                Tienda
              </Link>
              <Link href="/store/account" className="">
                Mi cuenta
              </Link>
              <Link href="/store/purchases" className="">
                Mis compras
              </Link>
            </div>
            <div className="w-full flex items-center justify-end gap-10">
              <UserAvatar user={user} />
              <HeaderShoppingCart />
            </div>
          </div>
        </nav>
      </header>
      <main className="flex flex-col w-full">{children}</main>
      <Toaster richColors={true} />
    </UserProvider>
  );
}
