import { NextResponse } from 'next/server';
import { parseResume } from '../../../services/resumeParsingService';
import logger from '@/lib/logger';

export async function POST(request) {
  logger.info({ file: 'src/app/api/parse-resume/route.js', function: 'POST' }, 'Parse resume route triggered');
  try {
    const formData = await request.formData();
    const file = formData.get('resumeFile');

    if (!file) {
      logger.warn({ file: 'src/app/api/parse-resume/route.js', function: 'POST' }, 'No file uploaded');
      return new Response("No file uploaded", { status: 400 });
    }
    logger.info({ file: 'src/app/api/parse-resume/route.js', function: 'POST', filename: file.name }, 'Processing resume file');

    const parsedData = await parseResume(file);
    logger.info({ file: 'src/app/api/parse-resume/route.js', function: 'POST', filename: file.name }, 'Resume parsed successfully');
    return new Response(JSON.stringify(parsedData), { status: 200 });

  } catch (error) {
    logger.error({ file: 'src/app/api/parse-resume/route.js', function: 'POST', error: error }, 'Error parsing resume');
    return new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}