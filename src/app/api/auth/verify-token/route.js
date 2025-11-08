
import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import RefreshToken from '@/models/refreshToken';

export async function POST(req) {
  console.log('--- In verify-token route ---');
  const body = await req.json();
  console.log('Request body:', body);
  const { refreshToken } = body;
  console.log('Received refresh token:', refreshToken);


  if (!refreshToken) {
    return NextResponse.json({ error: 'Refresh token is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET));
    const { userId } = payload;

    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const tokenDoc = await RefreshToken.findOne({ userId, token: hashedToken });

    if (!tokenDoc) {
      await RefreshToken.deleteMany({ userId });
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    if (tokenDoc.expiresAt < new Date()) {
      await RefreshToken.findByIdAndDelete(tokenDoc._id);
      return NextResponse.json({ error: 'Expired refresh token' }, { status: 401 });
    }

    // ROTATION
    await RefreshToken.findByIdAndDelete(tokenDoc._id);

    const newAccessToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));

    const newRefreshToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15d')
      .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET));

    const newHashedRefreshToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    await RefreshToken.create({
      userId,
      token: newHashedRefreshToken,
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      ip: req.headers.get('x-forwarded-for') || req.ip,
      userAgent: req.headers.get('user-agent'),
    });

    return NextResponse.json({ newAccessToken, newRefreshToken });

  } catch (error) {
    console.error('Error in verify-token route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
