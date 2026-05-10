import { redirect } from "next/navigation";

import { AuthInitializer } from "@/components/auth-initializer";
import { getCurrentProfile } from "@/zustand/auth-store-server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentProfile();

  if (!currentUser) {
    redirect("/");
  }

  if (!currentUser?.schools?.length && currentUser?.role === "user") {
    redirect("/onboarding");
  }

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
