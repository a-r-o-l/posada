import { redirect } from "next/navigation";

import { AuthInitializer } from "@/components/auth-initializer";
import { createClient } from "@/supabase/server";
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

  if (currentUser?.role === "user") {
    const hasSchools =
      Array.isArray(currentUser?.schools) && currentUser.schools.length > 0;

    if (!hasSchools) {
      const supabase = await createClient();
      const { count, error } = await supabase
        .from("profile_students")
        .select("id", { count: "exact", head: true })
        .eq("profile_id", currentUser.id);

      const hasChildren = !error && (count ?? 0) > 0;

      if (!hasChildren) {
        redirect("/onboarding");
      }
    }
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
