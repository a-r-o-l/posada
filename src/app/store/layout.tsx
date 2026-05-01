// import { redirect } from "next/navigation";

import { AuthInitializer } from "@/components/auth-initializer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="shadow-md top-0 sticky z-50 bg-[#F0F1FF]"></header>
      <main className="flex flex-col w-full">
        <AuthInitializer />
        {children}
      </main>
    </>
  );
}
