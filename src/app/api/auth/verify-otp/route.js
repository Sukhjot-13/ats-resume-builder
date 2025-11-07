
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';

export async function POST(req) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    let newUser = false;
    if (!user.name) {
      newUser = true;
    }

    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
    const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);

    const accessToken = await new SignJWT({ userId: user._id.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(secret);

    const refreshToken = await new SignJWT({ userId: user._id.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15d')
      .sign(refreshSecret);

    return NextResponse.json({ accessToken, refreshToken, newUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
