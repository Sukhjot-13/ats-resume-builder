import { NextResponse } from 'next/server';
import PdfResumeRenderer from '@/components/preview/PdfResumeRenderer';
import ClassicTemplate from '@/components/resume-templates/pdf-templates/ClassicTemplate';

export async function POST(request) {
  try {
    const { resumeData } = await request.json();

    // Basic validation
    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    const pdfBuffer = await PdfResumeRenderer({ resumeData, Template: ClassicTemplate });

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
