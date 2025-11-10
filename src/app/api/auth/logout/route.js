import { NextResponse } from 'next/server';
import logger from '@/lib/logger';

export async function POST() {
  logger.info({ file: 'src/app/api/auth/logout/route.js', function: 'POST' }, 'Logout route triggered');
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    response.cookies.set('accessToken', '', { expires: new Date(0), path: '/' });
    response.cookies.set('refreshToken', '', { expires: new Date(0), path: '/' });
    logger.info({ file: 'src/app/api/auth/logout/route.js', function: 'POST' }, 'User logged out successfully');
    return response;
  } catch (error) {
    logger.error({ file: 'src/app/api/auth/logout/route.js', function: 'POST', error: error.message }, 'Logout error');
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
