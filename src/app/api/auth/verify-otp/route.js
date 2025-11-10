
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import RefreshToken from '@/models/refreshToken';
import logger from '@/lib/logger';
import { createHash } from 'crypto';

function sha256(string) {
  return createHash('sha256').update(string).digest('hex');
}

export async function POST(req) {
  logger.info({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', message: 'Verify OTP route triggered' });
  try {
    const { email, otp } = await req.json();
    logger.info({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', email }, 'Processing verify OTP request for email');

    if (!email || !otp) {
      logger.warn({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', email }, 'Email and OTP are required, aborting.');
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    await dbConnect();
    logger.debug({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', email }, 'Database connected');

    const user = await User.findOne({ email });
    logger.debug({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', email, user: user ? user.toObject() : null }, 'Found user');

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      logger.warn({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', email, userId: user?._id, otpMatch: user?.otp === otp, otpExpired: user ? Date.now() > user.otpExpires : null }, 'Invalid or expired OTP');
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    logger.info({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', email, userId: user._id }, 'OTP verified successfully');
    let newUser = !user.name;

    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
    const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
    const refreshTokenExpirationSeconds = 15 * 24 * 60 * 60; // 15 days in seconds

    logger.debug({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', userId: user._id }, 'Generating access token');
    const accessToken = await new SignJWT({ userId: user._id.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('5m')
      .sign(secret);

    logger.debug({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', userId: user._id }, 'Generating refresh token');
    const refreshToken = await new SignJWT({ userId: user._id.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15d')
      .sign(refreshSecret);
    
    logger.info({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', userId: user._id }, 'Generated access and refresh tokens');

    // Hash the refresh token
    const hashedRefreshToken = sha256(refreshToken);
    logger.debug({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', userId: user._id }, 'Hashed refresh token');

    // Save the new refresh token to its own collection
    await RefreshToken.create({
      userId: user._id,
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + refreshTokenExpirationSeconds * 1000),
      ip: req.headers.get('x-forwarded-for') || req.ip,
      userAgent: req.headers.get('user-agent'),
    });
    logger.info({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', userId: user._id }, 'Saved refresh token to database');

    // Remove OTP fields from user
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    logger.info({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', userId: user._id }, 'Cleared OTP from user document');

    const response = NextResponse.json({ newUser });

    // Set cookies
    logger.debug({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', userId: user._id }, 'Setting cookies');
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

    logger.info({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', message: 'Verify OTP process completed successfully' });
    return response;
  } catch (error) {
    logger.error({ file: 'src/app/api/auth/verify-otp/route.js', function: 'POST', error: error }, 'Verify OTP error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
