
import { NextRequest ,NextResponse } from "next/server";


const protectedRoutes = ["/chat"];
const authRoutes = ["/signin"];



export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("auth")?.value;
  if (
    protectedRoutes.includes(request.nextUrl.pathname) &&
    (!currentUser || Date.now() > JSON.parse(currentUser).expiredAt)
  ) {
    request.cookies.delete("auth");
    const response = NextResponse.redirect(new URL("/signin", request.url));
    response.cookies.delete("auth");
    return response;
  }
 
  if (authRoutes.includes(request.nextUrl.pathname) && currentUser) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }
}



