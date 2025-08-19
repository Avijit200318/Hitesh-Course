import { NextResponse, NextRequest } from 'next/server'
// export { default } from "next-auth/middleware"
// import { getToken } from "next-auth/jwt"
import jwt, {JwtPayload} from "jsonwebtoken"

interface CustomJwtPayload extends JwtPayload {
  username: string;
  email: string;
  id: string;
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = request.cookies.get("token")?.value || '';
    const url = request.nextUrl;

    const userDetails = await jwt.decode(token) as CustomJwtPayload | null;

    // if we have token and we are going this routes then redirect /dashboard
    if(token && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/verify') || url.pathname === '/')){
        return NextResponse.redirect(new URL(`/profile/${userDetails?.username}`, request.url));
    }

    if(!token && url.pathname.startsWith('/dashboard')){
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

  return NextResponse.next();
}
 
// add where we want our middleware will run ex /sign-in, ..., /dashboard/:path* -> all the routes with path /dashboard

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ],
}