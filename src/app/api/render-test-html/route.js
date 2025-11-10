
import { NextResponse } from 'next/server';
import { renderPdf } from '../../../services/pdfRenderService';
import fs from 'fs/promises';
import logger from '@/lib/logger';

export async function GET(request) {
  logger.info({ file: 'src/app/api/render-test-html/route.js', function: 'GET' }, 'Render test HTML route triggered');
  try {
    const resumeData = JSON.parse(await fs.readFile('data.json', 'utf-8'));
    const html = await renderPdf(resumeData, 'Simple.html', true);
    logger.info({ file: 'src/app/api/render-test-html/route.js', function: 'GET' }, 'Test HTML rendered successfully');

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    logger.error({ file: 'src/app/api/render-test-html/route.js', function: 'GET', error: error }, 'Error rendering test HTML');
    return new NextResponse('Error generating resume: ' + error.message, { status: 500 });
  }
}
