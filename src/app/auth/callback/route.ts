// app/auth/callback/route.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const redirectResponse = NextResponse.redirect(
    new URL("/", requestUrl.origin),
  );

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            // Leer desde el cookieStore de Next.js (incluye el code-verifier)
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            // Escribir en la response del redirect para que el browser reciba las cookies
            cookiesToSet.forEach(({ name, value, options }) => {
              redirectResponse.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.log("🔴 [Callback] Error:", error.message);
    }
  }

  return redirectResponse;
}
