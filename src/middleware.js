
import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import crypto from 'crypto';
import dbConnect from './lib/mongodb';
import RefreshToken from './models/refreshToken';
import User from './models/user';

const getSecret = (tokenType) => {
  const secret = tokenType === 'access'
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error(`Secret for ${tokenType} token is not defined.`);
  return new TextEncoder().encode(secret);
};

async function verifyAndRefreshTokens(req) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  // 1. Check for valid access token
  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, getSecret('access'));
      return { isValid: true, userId: payload.userId };
    } catch (error) {
      // Expired or invalid, fall through to refresh
    }
  }

  // 2. Check for valid refresh token
  if (!refreshToken) {
    return { isValid: false, reason: 'No refresh token' };
  }

  try {
    // 2a. Verify signature
    const { payload } = await jwtVerify(refreshToken, getSecret('refresh'));
    const { userId } = payload;

    // 2b. Verify against database
    await dbConnect();
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const tokenDoc = await RefreshToken.findOne({ userId, token: hashedToken });

    if (!tokenDoc) {
      // Token not in DB, possibly stolen and replayed. Invalidate all tokens for this user.
      await RefreshToken.deleteMany({ userId });
      return { isValid: false, reason: 'Token not found in DB', clearCookies: true };
    }

    if (tokenDoc.expiresAt < new Date()) {
      await RefreshToken.findByIdAndDelete(tokenDoc._id);
      return { isValid: false, reason: 'Token expired', clearCookies: true };
    }

    // 3. ROTATION: Token is valid, rotate it.
    await RefreshToken.findByIdAndDelete(tokenDoc._id);

    const newAccessToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' }).setExpirationTime('15m').sign(getSecret('access'));
    
    const newRefreshToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' }).setExpirationTime('15d').sign(getSecret('refresh'));

    const newHashedRefreshToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    await RefreshToken.create({
      userId,
      token: newHashedRefreshToken,
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      ip: req.headers.get('x-forwarded-for') || req.ip,
      userAgent: req.headers.get('user-agent'),
    });

    return { isValid: true, userId, newAccessToken, newRefreshToken };

  } catch (error) {
    return { isValid: false, reason: 'Refresh JWT verification failed', clearCookies: true };
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith('/api/user') || pathname.startsWith('/api/resumes');
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
        response.cookies.set('accessToken', authResult.newAccessToken, { path: '/', maxAge: 15 * 60, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
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
  matcher: ['/api/user/:path*', '/api/resumes/:path*', '/dashboard/:path*', '/profile/:path*', '/onboarding/:path*', '/login'],
};
