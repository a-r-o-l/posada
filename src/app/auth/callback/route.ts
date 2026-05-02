// app/auth/callback/route.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const redirectResponse = NextResponse.redirect(
    new URL("/", requestUrl.origin),
  );

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return (
              request.headers
                .get("cookie")
                ?.split("; ")
                .map((c) => {
                  const [name, ...rest] = c.split("=");
                  return { name, value: rest.join("=") };
                }) ?? []
            );
          },
          setAll(cookiesToSet) {
            // Setear las cookies directamente en la response del redirect
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
