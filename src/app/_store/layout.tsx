import Link from "next/link";
// import UserAvatar from "./components/UserAvatar";
import HeaderShoppingCart from "./components/HeaderShoppingCart";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="shadow-md top-0 sticky z-50 bg-[#F0F1FF]">
        <nav className="flex flex-row items-center overflow-hidden px-5 h-[10vh]">
          <Link href="/" className="">
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
                Mi Cuenta
              </Link>
              <Link href="/store/purchases" className="">
                Mis Compras
              </Link>
              <Link href="/store/pictures" className="">
                Mis Fotos
              </Link>
            </div>
            <div className="w-full flex items-center justify-end gap-10">
              {/* <UserAvatar user={user} /> */}
              <HeaderShoppingCart />
            </div>
          </div>
        </nav>
        {/* Fila de enlaces principales solo mobile */}
        <nav className="flex flex-row items-center justify-evenly gap-4 px-2 pb-2 pt-0 text-xs text-gray-700 font-medium lg:hidden mt-3">
          <Link href="/store" className="hover:underline">
            Tienda
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/store/account" className="hover:underline">
            Mi Cuenta
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/store/purchases" className="hover:underline">
            Mis Compras
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/store/pictures" className="hover:underline">
            Mis Fotos
          </Link>
        </nav>
      </header>
      <main className="flex flex-col w-full">{children}</main>
    </>
  );
}
