import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  // update user's auth session
  return await updateSession(request);
}

export function middleware(request: NextRequest){
  const path = request.nextUrl.pathname

  const isPublicRoute = path === '/login' || path === '/register'

  const hasAuthCookies = request.cookies.getAll().some((cookie) => cookie.name.includes("sb-") && cookie.name.includes("-auth-token") )

if (!isPublicRoute && !hasAuthCookies) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
 
  if (isPublicRoute && hasAuthCookies) {
   
    return NextResponse.redirect(new URL("/", request.url)); 
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
