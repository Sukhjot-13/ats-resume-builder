
import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import RefreshToken from '@/models/refreshToken';
import logger from '@/lib/logger';
import { createHash } from 'crypto';

function sha256(string) {
  return createHash('sha256').update(string).digest('hex');
}

export async function POST(req) {
  logger.info({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST' }, 'Verify token route triggered');
  
  try {
    const { refreshToken } = await req.json();
    logger.debug({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', refreshToken: refreshToken ? 'present' : 'missing' }, 'Extracted refresh token from body');
    logger.info({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST' }, 'Processing verify token request');

    if (!refreshToken) {
      logger.warn({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST' }, 'Refresh token is required');
      return NextResponse.json({ error: 'Refresh token is required' }, { status: 400 });
    }

    await dbConnect();

    const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET));
    const { userId } = payload;
    logger.info({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', userId }, 'Refresh token verified');
    logger.debug({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', payload }, 'Decoded refresh token payload');

    const hashedToken = sha256(refreshToken);
    logger.debug({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', hashedToken }, 'Hashed refresh token');
    const tokenDoc = await RefreshToken.findOne({ userId, token: hashedToken });
    logger.debug({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', tokenDoc: tokenDoc ? 'found' : 'not found' }, 'Token document from database');

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

    const newHashedRefreshToken = sha256(newRefreshToken);
    await RefreshToken.create({
      userId,
      token: newHashedRefreshToken,
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      ip: req.headers.get('x-forwarded-for') || req.ip,
      userAgent: req.headers.get('user-agent'),
    });
    logger.info({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', userId }, 'Saved new refresh token to database');

    return NextResponse.json({ newAccessToken, newRefreshToken, userId });

  } catch (error) {
    logger.error({ file: 'src/app/api/auth/verify-token/route.js', function: 'POST', error: error }, 'Verify token error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
