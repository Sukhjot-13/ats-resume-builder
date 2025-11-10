import { NextResponse } from 'next/server';
import { renderPdf } from '../../../services/pdfRenderService';
import logger from '@/lib/logger';

export async function POST(request) {
  logger.info({ file: 'src/app/api/render-pdf/route.js', function: 'POST' }, 'Render PDF route triggered');
  try {
    const { resumeData, template } = await request.json();
    logger.info({ file: 'src/app/api/render-pdf/route.js', function: 'POST', template }, 'Generating PDF for download');
    const pdfBuffer = await renderPdf(resumeData, template);
    logger.info({ file: 'src/app/api/render-pdf/route.js', function: 'POST', template }, 'PDF generated successfully');

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    logger.error({ file: 'src/app/api/render-pdf/route.js', function: 'POST', error: error }, 'Error generating PDF');
    return new NextResponse('Error generating resume: ' + error.message, { status: 500 });
  }
}