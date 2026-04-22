// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
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
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // Rutas públicas (no requieren autenticación y no verifican hijos)
  const publicRoutes = ["/login", "/signup", "/onboarding", "/"];

  if (publicRoutes.includes(pathname)) {
    // Para la ruta raíz, simplemente dejamos pasar sin redirecciones
    if (pathname === "/") {
      return response;
    }

    // Para las otras rutas públicas
    if (session) {
      // Si está en onboarding, permitir acceso sin redirigir
      if (pathname === "/onboarding") {
        return response;
      }

      // Verificar si el usuario tiene hijos
      const { data: students } = await supabase
        .from("profile_students")
        .select("id")
        .eq("profile_id", session.user.id)
        .limit(1);

      const hasStudents = students && students.length > 0;

      // Si no tiene hijos, redirigir a onboarding (excepto si ya está en onboarding)
      if (!hasStudents && pathname !== "/onboarding") {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }

      // Si tiene hijos, redirigir según su rol
      const { data: profile } = await supabase
        .from("profile")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const redirectTo = profile?.role === "admin" ? "/sadmin" : "/sstore";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return response;
  }

  // Rutas protegidas
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verificar rol y si tiene hijos
  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verificar si el usuario tiene hijos registrados
  const { data: students } = await supabase
    .from("profile_students")
    .select("id")
    .eq("profile_id", session.user.id)
    .limit(1);

  const hasStudents = students && students.length > 0;

  // Si NO tiene hijos y NO está en la ruta de onboarding, redirigir a onboarding
  if (!hasStudents && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Si TIENE hijos y está en onboarding, redirigir a su destino según rol
  if (hasStudents && pathname === "/onboarding") {
    const redirectTo = profile?.role === "admin" ? "/sadmin" : "/sstore";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Verificar roles para rutas específicas
  if (pathname.startsWith("/sadmin") && profile?.role !== "admin") {
    return NextResponse.redirect(new URL("/sstore", request.url));
  }

  if (pathname.startsWith("/sstore") && profile?.role !== "user") {
    return NextResponse.redirect(new URL("/sadmin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
