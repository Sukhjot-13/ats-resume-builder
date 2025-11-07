
import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

export async function POST(req) {
  const refreshTokenCookie = req.cookies.get('refreshToken');

  if (!refreshTokenCookie) {
    return NextResponse.json({ error: 'Refresh token not found' }, { status: 401 });
  }

  const refreshToken = refreshTokenCookie.value;

  try {
    const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
    const { payload } = await jwtVerify(refreshToken, refreshSecret);

    const { userId } = payload;

    // Generate a new access token
    const accessSecret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
    const newAccessToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(accessSecret);

    return NextResponse.json({ accessToken: newAccessToken });

  } catch (error) {
    console.error('Refresh token verification error:', error);
    return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
  }
}
