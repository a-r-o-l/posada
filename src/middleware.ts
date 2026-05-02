import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/mercadopago")) {
    console.log("⏩ [Middleware] Excluyendo webhook de MP");
    return NextResponse.next();
  }
  // Al principio del middleware
  const url = request.nextUrl.pathname;
  console.log("🔵 [Middleware] URL:", url);

  // Detectar si venimos de Mercado Pago
  const referer = request.headers.get("referer");
  if (referer?.includes("mercadopago")) {
    console.log("🟠 [Middleware] ¡VIENE DE MERCADO PAGO!");
    console.log("🟠 [Middleware] Referer:", referer);
    console.log(
      "🟠 [Middleware] Todas las cookies:",
      request.cookies.getAll().map((c) => c.name),
    );
  }
  console.log("🔵 [Middleware] Ejecutando para:", request.nextUrl.pathname);

  const allCookies = request.cookies.getAll();
  const sbCookies = allCookies.filter((c) => c.name.includes("sb-"));
  console.log(`🔵 [Middleware] Cookies sb-* encontradas: ${sbCookies.length}`);

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // 👇 CORREGIDO: 'options' ahora existe
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.log("🔴 [Middleware] Error en getUser:", error.message);
  } else if (user) {
    console.log("🟢 [Middleware] Usuario autenticado:", user.email);
  } else {
    console.log("🟡 [Middleware] No hay usuario autenticado");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
