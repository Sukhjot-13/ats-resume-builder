
import { NextResponse } from 'next/server';
import { renderPdf } from '../../../services/pdfRenderService';

export async function POST(request) {
  try {
    const { resumeData, template } = await request.json();

    if (!resumeData || !template) {
      return new NextResponse('Missing resumeData or template', { status: 400 });
    }

    const html = await renderPdf(resumeData, template, true); // The `true` likely means return HTML

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error generating resume HTML:', error);
    return new NextResponse('Error generating resume HTML: ' + error.message, { status: 500 });
  }
}
