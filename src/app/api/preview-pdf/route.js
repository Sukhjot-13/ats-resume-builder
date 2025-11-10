
import { NextResponse } from 'next/server';
import { renderPdf } from '../../../services/pdfRenderService';
import logger from '@/lib/logger';

export async function POST(request) {
  logger.info({ file: 'src/app/api/preview-pdf/route.js', function: 'POST' }, 'PDF preview route triggered');
  try {
    const { resumeData, template } = await request.json();
    logger.info({ file: 'src/app/api/preview-pdf/route.js', function: 'POST', template }, 'Generating PDF preview');

    const pdfBuffer = await renderPdf(resumeData, template);
    logger.info({ file: 'src/app/api/preview-pdf/route.js', function: 'POST', template }, 'PDF preview generated successfully');

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error) {
    logger.error({ file: 'src/app/api/preview-pdf/route.js', function: 'POST', error: error.message }, 'Error generating PDF preview');
    return new NextResponse('Error generating resume: ' + error.message, { status: 500 });
  }
}
