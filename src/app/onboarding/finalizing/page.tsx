"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/supabase/supabase";

const MAX_RETRIES = 8;
const RETRY_MS = 800;

export default function FinalizingOnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const checkReadyAndRedirect = async (attempt = 0) => {
      if (cancelled) return;

      await supabase.auth.refreshSession();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/?login=true");
        return;
      }

      const [
        { data: profile, error: profileError },
        { count, error: childrenError },
      ] = await Promise.all([
        supabase
          .from("profile")
          .select("schools")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("profile_students")
          .select("id", { count: "exact", head: true })
          .eq("profile_id", user.id),
      ]);

      const hasSchools =
        !profileError &&
        Array.isArray(profile?.schools) &&
        profile.schools.length > 0;
      const hasChildren = !childrenError && (count ?? 0) > 0;

      if (hasSchools || hasChildren) {
        window.location.assign("/store");
        return;
      }

      if (attempt >= MAX_RETRIES) {
        router.replace("/onboarding");
        return;
      }

      setTimeout(() => {
        checkReadyAndRedirect(attempt + 1);
      }, RETRY_MS);
    };

    checkReadyAndRedirect();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border p-6 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
          <Loader2 className="h-7 w-7 text-blue-600 animate-spin" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          Guardando tus preferencias
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Estamos sincronizando tu cuenta para llevarte a la tienda.
        </p>
      </div>
    </div>
  );
}
