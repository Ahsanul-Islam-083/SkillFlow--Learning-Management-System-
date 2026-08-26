import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("lms_token")?.value;
  const role = request.cookies.get("lms_role")?.value;
  const { pathname } = request.nextUrl;

  // dashboard protection and role-based access control
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // access control based on user role
    if (pathname.startsWith("/dashboard/admin") && role !== "Admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (pathname.startsWith("/dashboard/manager") && role !== "Content Manager" && role !== "Admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (pathname.startsWith("/dashboard/instructor") && role !== "Instructor" && role !== "Admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (pathname.startsWith("/dashboard/student") && role !== "Student" && role !== "Admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // stop logged in users to redirect to login or register page
  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/dashboard/student", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};