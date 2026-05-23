import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginPage) {
    const adminUrl = new URL("/admin/notices", req.nextUrl.origin);
    return Response.redirect(adminUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};