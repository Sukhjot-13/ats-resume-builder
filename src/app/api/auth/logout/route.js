import { NextResponse } from 'next/server';
import logger from '@/lib/logger';

export async function POST() {
  logger.info({ file: 'src/app/api/auth/logout/route.js', function: 'POST', message: 'Logout route triggered' });
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    logger.debug({ file: 'src/app/api/auth/logout/route.js', function: 'POST', message: 'Clearing accessToken cookie' });
    response.cookies.set('accessToken', '', { expires: new Date(0), path: '/' });
    logger.debug({ file: 'src/app/api/auth/logout/route.js', function: 'POST', message: 'Clearing refreshToken cookie' });
    response.cookies.set('refreshToken', '', { expires: new Date(0), path: '/' });
    logger.info({ file: 'src/app/api/auth/logout/route.js', function: 'POST', message: 'User logged out successfully' });
    return response;
  } catch (error) {
    logger.error({ file: 'src/app/api/auth/logout/route.js', function: 'POST', error: error }, 'Logout error');
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
