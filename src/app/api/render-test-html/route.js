
import { NextResponse } from 'next/server';
import { renderPdf } from '../../../services/pdfRenderService';
import fs from 'fs/promises';

export async function GET(request) {
  try {
    const resumeData = JSON.parse(await fs.readFile('data.json', 'utf-8'));
    const html = await renderPdf(resumeData, 'Simple.html', true);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    return new NextResponse('Error generating resume: ' + error.message, { status: 500 });
  }
}
