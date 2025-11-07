
import { NextResponse } from 'next/server';
import { renderPdf } from '../../../services/pdfRenderService';

export async function POST(request) {
  console.log("Received request for PDF preview");
  try {
    const { resumeData, template } = await request.json();
    console.log("Resume data for PDF preview:", JSON.stringify(resumeData, null, 2));
    console.log("Template for PDF preview:", template);

    const pdfBuffer = await renderPdf(resumeData, template);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error) {
    console.error("Error generating PDF preview:", error);
    return new NextResponse('Error generating resume: ' + error.message, { status: 500 });
  }
}
