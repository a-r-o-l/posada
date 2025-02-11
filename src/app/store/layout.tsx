import { Toaster } from "sonner";
import { UserProvider } from "@/context/UserContext";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { User } from "lucide-react";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

import UserAvatar from "./components/UserAvatar";
import HeaderShoppingCart from "./components/HeaderShoppingCart";

interface Child {
  name: string;
  lastname: string;
  grade: string;
}

interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  password: string;
  imageUrl: string;
  children: Child[];
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

  if (user?.role === "admin") {
    redirect("/admin");
  }

  return (
    <UserProvider user={user}>
      <header className="shadow-md top-0 sticky z-50 bg-blue-600">
        <div className="px-5">
          <nav className="flex flex-col md:flex-row items-center overflow-hidden p-2">
            <Link href="/" className="">
              <div className="w-60 h-32 flex justify-center items-center">
                <AspectRatio ratio={21 / 9}>
                  <Image
                    src={"/posadalogowhite.png"}
                    alt="Logo Posada"
                    layout="fill"
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </AspectRatio>
              </div>
            </Link>
            <div className="w-full flex items-center justify-between px-5">
              <div className="w-full hidden lg:flex items-center gap-10">
                <Link href="/store" className="text-white">
                  Tienda
                </Link>
                <Link href="/store/account" className="text-white">
                  Mi cuenta
                </Link>
                <Link href="/store/purchases" className="text-white">
                  Mis compras
                </Link>
              </div>
              <div className="w-full flex items-center justify-between md:justify-end gap-10">
                <UserAvatar user={user} />
                <HeaderShoppingCart />
              </div>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex flex-col w-full">{children}</main>
      <Toaster richColors={true} />
    </UserProvider>
  );
}
