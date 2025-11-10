
import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import RefreshToken from '@/models/refreshToken';
import logger from '@/lib/logger';
import { cookies } from 'next/headers';

async function sha256(string) {
  const textAsBuffer = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function POST(req) {
  logger.info({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST' }, 'Verify token route triggered');
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  logger.info({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST' }, 'Processing verify token request');


  if (!refreshToken) {
    logger.warn({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST' }, 'Refresh token is required');
    return NextResponse.json({ error: 'Refresh token is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET));
    const { userId } = payload;
    logger.info({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', userId }, 'Refresh token verified');

    const hashedToken = await sha256(refreshToken);
    const tokenDoc = await RefreshToken.findOne({ userId, token: hashedToken });

    if (!tokenDoc) {
      await RefreshToken.deleteMany({ userId });
      logger.warn({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', userId }, 'Invalid refresh token, deleted all tokens for user');
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    if (tokenDoc.expiresAt < new Date()) {
      await RefreshToken.findByIdAndDelete(tokenDoc._id);
      logger.warn({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', userId }, 'Expired refresh token');
      return NextResponse.json({ error: 'Expired refresh token' }, { status: 401 });
    }

    // ROTATION
    await RefreshToken.findByIdAndDelete(tokenDoc._id);
    logger.info({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', userId }, 'Rotated refresh token');

    const newAccessToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));

    const newRefreshToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15d')
      .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET));
    
    logger.info({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', userId }, 'Generated new access and refresh tokens');

    const newHashedRefreshToken = await sha256(newRefreshToken);
    await RefreshToken.create({
      userId,
      token: newHashedRefreshToken,
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      ip: req.headers.get('x-forwarded-for') || req.ip,
      userAgent: req.headers.get('user-agent'),
    });
    logger.info({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', userId }, 'Saved new refresh token to database');

    const response = NextResponse.json({ newAccessToken });
    response.cookies.set('refreshToken', newRefreshToken, {
      path: '/',
      maxAge: 15 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;

  } catch (error) {
    logger.error({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', error: error.message }, 'Verify token error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
