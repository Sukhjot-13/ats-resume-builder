
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import RefreshToken from '@/models/refreshToken';

async function sha256(string) {
  const textAsBuffer = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function POST(req) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    let newUser = !user.name;

    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
    const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
    const refreshTokenExpirationSeconds = 15 * 24 * 60 * 60; // 15 days in seconds

    const accessToken = await new SignJWT({ userId: user._id.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('5m')
      .sign(secret);

    const refreshToken = await new SignJWT({ userId: user._id.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15d')
      .sign(refreshSecret);

    // Hash the refresh token
    const hashedRefreshToken = await sha256(refreshToken);

    // Save the new refresh token to its own collection
    await RefreshToken.create({
      userId: user._id,
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + refreshTokenExpirationSeconds * 1000),
      ip: req.headers.get('x-forwarded-for') || req.ip,
      userAgent: req.headers.get('user-agent'),
    });

    // Remove OTP fields from user
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const response = NextResponse.json({ newUser });

    // Set cookies
    response.cookies.set('accessToken', accessToken, {
      path: '/',
      maxAge: 5 * 60, // 5 minutes
      secure: process.env.NODE_ENV === 'production',
    });
    response.cookies.set('refreshToken', refreshToken, {
      path: '/',
      maxAge: refreshTokenExpirationSeconds,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
