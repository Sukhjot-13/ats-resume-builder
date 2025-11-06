import { NextResponse } from 'next/server';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import ClassicTemplate from '../../../components/resume-templates/ClassicTemplate';

export async function POST(request) {
  try {
    const { resumeData } = await request.json();

    const pdfStream = await renderToStream(<ClassicTemplate data={resumeData} />);

    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', 'attachment; filename="resume.pdf"');

    return new NextResponse(pdfStream, { headers });
  } catch (error) {
    console.error('Error rendering PDF:', error);
    return NextResponse.json({ message: 'Error rendering PDF' }, { status: 500 });
  }
}
