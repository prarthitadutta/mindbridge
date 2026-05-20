import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Routes that require login
  const protectedRoutes = [
    "/dashboard",
    "/booking",
    "/quiz",
    "/community",
    "/feelings",
    "/probono",
    "/feedback",
  ];

  // Routes that require therapist or admin role
  const therapistRoutes = ["/therapist-dashboard"];

  // Routes that require admin role
  const adminRoutes = ["/admin"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isTherapistRoute = therapistRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Not logged in — redirect to login
  if ((isProtected || isTherapistRoute || isAdminRoute) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in — check role for restricted routes
  if (user && (isTherapistRoute || isAdminRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;

    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isTherapistRoute && role !== "therapist" && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  
  // Redirect pending therapists to under-review page
  if (user && !pathname.startsWith("/under-review") && !pathname.startsWith("/therapist-onboarding")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "pending_therapist" && !pathname.startsWith("/under-review")) {
      return NextResponse.redirect(new URL("/under-review", request.url));
    }
  }

  // Redirect logged-in users away from login/signup
  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};