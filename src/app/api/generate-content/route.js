import { NextResponse } from 'next/server';
import { generateTailoredContent } from '../../../services/contentGenerationService';
import logger from '@/lib/logger';

export async function POST(request) {
  logger.info({ file: 'src/app/api/generate-content/route.js', function: 'POST' }, 'Generate content route triggered');
  try {
    const { resume, jobDescription, specialInstructions } = await request.json();
    logger.info({ file: 'src/app/api/generate-content/route.js', function: 'POST', jobDescription, specialInstructions }, 'Processing generate content request');
    const tailoredData = await generateTailoredContent(resume, jobDescription, specialInstructions);
    logger.info({ file: 'src/app/api/generate-content/route.js', function: 'POST' }, 'Content generated successfully');
    return NextResponse.json(tailoredData);
  } catch (error) {
    logger.error({ file: 'src/app/api/generate-content/route.js', function: 'POST', error: error.message }, 'Error generating content');
    return NextResponse.json({ message: error.message || 'Error generating content' }, { status: 500 });
  }
}