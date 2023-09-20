import { url } from "inspector";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export const middleware = async (request: NextRequest) => {
  // Người dùng đăng nhập, token có
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Cho phép req nếu người dùng LogIn hoặc là req cho NextAuth session
  // hoặc nó là '/_next/' ("/_next/static/")
  if (token || pathname.includes("/api/auth") || pathname.includes("/_next")) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Chuyển về LogIn nếu user không có token
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/about/:path*",
// };
