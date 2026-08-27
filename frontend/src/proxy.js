import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("lms_token")?.value;
  const rawRole = request.cookies.get("lms_role")?.value;
  const { pathname } = request.nextUrl;

  const role = (rawRole || "").toLowerCase().trim();
  const isAdmin = role === "admin";
  const isManager = role.includes("manager") || role.includes("content");
  const isInstructor = role.includes("instructor") || role.includes("teacher");
  const isStudent = role.includes("student") || (!isAdmin && !isManager && !isInstructor);

  // profile access control
  if (pathname.startsWith("/profile")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login?redirect=/profile", request.url));
    }
  }

  // dashboard access control based on role
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // dashboard redirect based on role if accessing /dashboard root
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      if (isAdmin) return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      if (isManager) return NextResponse.redirect(new URL("/dashboard/manager", request.url));
      if (isInstructor) return NextResponse.redirect(new URL("/dashboard/instructor", request.url));
      return NextResponse.redirect(new URL("/dashboard/student", request.url));
    }

    // role-based specific dashboard permission check
    if (pathname.startsWith("/dashboard/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (pathname.startsWith("/dashboard/manager") && !isManager && !isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (pathname.startsWith("/dashboard/instructor") && !isInstructor && !isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (pathname.startsWith("/dashboard/student") && !isStudent && !isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // redirect logged-in users away from login/register pages
  if ((pathname === "/login" || pathname === "/register") && token) {
    if (isAdmin) return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    if (isManager) return NextResponse.redirect(new URL("/dashboard/manager", request.url));
    if (isInstructor) return NextResponse.redirect(new URL("/dashboard/instructor", request.url));
    return NextResponse.redirect(new URL("/dashboard/student", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/profile", "/login", "/register"],
};

