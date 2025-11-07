
import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const getSecret = (tokenType) => {
  const secret = tokenType === 'access'
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error(`Secret for ${tokenType} token is not defined.`);
  }
  return new TextEncoder().encode(secret);
};

async function verifyAndRefreshTokens(req) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  // 1. Check for valid access token
  if (accessToken) {
    try {
      await jwtVerify(accessToken, getSecret('access'));
      return { isValid: true, newAccessToken: null };
    } catch (error) {
      // Access token is expired or invalid, proceed to refresh
    }
  }

  // 2. Check for valid refresh token
  if (refreshToken) {
    try {
      const { payload } = await jwtVerify(refreshToken, getSecret('refresh'));
      const newAccessToken = await new SignJWT({ userId: payload.userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('15m')
        .sign(getSecret('access'));
      return { isValid: true, newAccessToken };
    } catch (error) {
      // Refresh token is also invalid
      return { isValid: false, newAccessToken: null, clearCookies: true };
    }
  }

  // 3. No tokens found
  return { isValid: false, newAccessToken: null };
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // API Route Protection
  if (pathname.startsWith('/api/user') || pathname.startsWith('/api/resumes')) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    const token = authHeader.split(' ')[1];
    try {
      const { payload } = await jwtVerify(token, getSecret('access'));
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', payload.userId);
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // Frontend Route Protection
  const protectedRoutes = ['/dashboard', '/profile', '/onboarding'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isLoginPage = pathname === '/login';

  if (isProtectedRoute || isLoginPage) {
    const { isValid, newAccessToken, clearCookies } = await verifyAndRefreshTokens(req);

    if (isValid) {
      const response = isLoginPage
        ? NextResponse.redirect(new URL('/dashboard', req.url))
        : NextResponse.next();
      
      if (newAccessToken) {
        response.cookies.set('accessToken', newAccessToken, { path: '/', maxAge: 15 * 60 });
      }
      return response;
    } else {
      const response = isProtectedRoute
        ? NextResponse.redirect(new URL('/login', req.url))
        : NextResponse.next();

      if (clearCookies) {
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/user/:path*', '/api/resumes/:path*', '/dashboard/:path*', '/profile/:path*', '/onboarding/:path*', '/login'],
};
