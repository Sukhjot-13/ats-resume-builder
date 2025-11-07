
import { NextResponse } from 'next/server';
import { renderPdf } from '../../../services/pdfRenderService';

export async function POST(request) {
  try {
    const { resumeData, template } = await request.json();
    const pdfBuffer = await renderPdf(resumeData, template);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error) {
    return new NextResponse('Error generating resume: ' + error.message, { status: 500 });
  }
}
