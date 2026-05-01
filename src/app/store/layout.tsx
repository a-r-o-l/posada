import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }
  return (
    <>
      <header className="shadow-md top-0 sticky z-50 bg-[#F0F1FF]"></header>
      <main className="flex flex-col w-full">{children}</main>
    </>
  );
}
