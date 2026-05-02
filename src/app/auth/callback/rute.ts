// app/auth/callback/route.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  console.log("🔵 [Callback] URL recibida:", requestUrl.toString());
  console.log("🔵 [Callback] Code presente:", !!code);

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.log("🔴 [Callback] Error:", error.message);
    } else {
      console.log("🟢 [Callback] Sesión intercambiada exitosamente");
    }
  } else {
    console.log("🟡 [Callback] No hay code en la URL");
  }

  // Redirigir a la página principal
  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
