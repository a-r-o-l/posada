import { createServerClient } from "@supabase/ssr";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Excluir rutas que no necesitan manejo de sesión
  if (
    request.nextUrl.pathname.startsWith("/api/mercadopago") ||
    request.nextUrl.pathname.startsWith("/auth/callback")
  ) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Primero actualizar el request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Crear una nueva response
          supabaseResponse = NextResponse.next({ request });
          // Luego poner las cookies en la response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set({
              name,
              value,
              ...options,
            } as ResponseCookie),
          );
        },
      },
    },
  );

  // Refrescar la sesión si el token expiró.
  // Usamos getSession() en vez de getUser() para evitar llamadas de red
  // que puedan fallar y borrar las cookies de sesión por error.
  await supabase.auth.getSession();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
