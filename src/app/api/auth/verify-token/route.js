
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import RefreshToken from '@/models/refreshToken';
import {
  verifyToken,
  hashToken,
  generateAccessToken,
  generateRefreshToken,
} from '@/lib/utils';

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

    const { userId } = await verifyToken(refreshToken, 'refresh');

    const hashedToken = hashToken(refreshToken);
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

    const newAccessToken = await generateAccessToken(userId);
    const newRefreshToken = await generateRefreshToken(userId);

    const newHashedRefreshToken = hashToken(newRefreshToken);
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
