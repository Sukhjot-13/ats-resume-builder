
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const getSecret = (tokenType) => {
  const secret = tokenType === 'access'
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error(`Secret for ${tokenType} token is not defined.`);
  return new TextEncoder().encode(secret);
};

async function verifyAndRefreshTokens(req) {
  console.log('--- Verifying tokens ---');
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  console.log('Access Token present:', !!accessToken);
  console.log('Refresh Token present:', !!refreshToken);

  // 1. Check for valid access token
  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, getSecret('access'));
      console.log('Access token is valid');
      return { isValid: true, userId: payload.userId };
    } catch (error) {
      console.log('Access token is invalid or expired, falling back to refresh token');
    }
  }

  // 2. Check for valid refresh token
  if (!refreshToken) {
    console.log('No refresh token found');
    return { isValid: false, reason: 'No refresh token' };
  }

  try {
    console.log('Attempting to verify refresh token by calling API route');
    const response = await fetch(new URL('/api/auth/verify-token', req.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.log('API route returned an error');
      return { isValid: false, reason: 'API token verification failed', clearCookies: true };
    }

    const { newAccessToken, newRefreshToken, userId } = await response.json();
    console.log('Successfully refreshed and rotated tokens via API route');

    return { isValid: true, userId, newAccessToken, newRefreshToken };

  } catch (error) {
    console.error('Error calling verify-token API route:', error);
    return { isValid: false, reason: 'API call to verify-token failed', clearCookies: true };
  }
}

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith('/api/user') || pathname.startsWith('/api/resumes') || pathname.startsWith('/api/edit-resume-with-ai');
  const isProtectedRoute = ['/dashboard', '/profile', '/onboarding'].some(p => pathname.startsWith(p));
  const isLoginPage = pathname === '/login';

  if (isApiRoute || isProtectedRoute || isLoginPage) {
    const authResult = await verifyAndRefreshTokens(req);

    if (authResult.isValid) {
      let response;
      if (isLoginPage) {
        response = NextResponse.redirect(new URL('/dashboard', req.url));
      } else if (isApiRoute) {
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', authResult.userId);
        response = NextResponse.next({ request: { headers: requestHeaders } });
      } else {
        response = NextResponse.next();
      }

      if (authResult.newAccessToken && authResult.newRefreshToken) {
        response.cookies.set('accessToken', authResult.newAccessToken, { path: '/', maxAge: 5 * 60, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        response.cookies.set('refreshToken', authResult.newRefreshToken, { path: '/', maxAge: 15 * 24 * 60 * 60, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      }
      return response;

    } else {
      const response = isProtectedRoute || isApiRoute
        ? NextResponse.redirect(new URL('/login', req.url))
        : NextResponse.next();

      if (authResult.clearCookies) {
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
      }
      
      if(isApiRoute) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/user/:path*', '/api/resumes/:path*', '/api/edit-resume-with-ai/:path*', '/dashboard/:path*', '/profile/:path*', '/onboarding/:path*', '/login'],
};
