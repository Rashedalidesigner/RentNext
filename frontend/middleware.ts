import { NextRequest, NextResponse } from 'next/server';

const publicPrefixes = ['/', '/properties', '/auth/login', '/auth/register', '/payment/success', '/payment/cancel'];

function isPublic(pathname: string) {
  return publicPrefixes.some((prefix) => prefix === '/' ? pathname === '/' : pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const role = request.cookies.get('rentnest_role')?.value?.toUpperCase();
  const loginUrl = new URL('/auth/login', request.url);
  loginUrl.searchParams.set('next', pathname);

  if (!role) return NextResponse.redirect(loginUrl);

  if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
  }
  if (pathname.startsWith('/dashboard/landlord') && role !== 'LANDLORD') {
    return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
  }
  if (pathname.startsWith('/dashboard/tenant') && role !== 'TENANT') {
    return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
