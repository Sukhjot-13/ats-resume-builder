import { NextResponse } from 'next/server';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import ClassicTemplate from '../../../components/resume-templates/ClassicTemplate';
import ModernTemplate from '../../../components/resume-templates/ModernTemplate';
import CreativeTemplate from '../../../components/resume-templates/CreativeTemplate';
import AdviceWithErin1 from '../../../components/resume-templates/AdviceWithErin1';
import AdviceWithErin2 from '../../../components/resume-templates/AdviceWithErin2';

const templates = {
  Classic: ClassicTemplate,
  Modern: ModernTemplate,
  Creative: CreativeTemplate,
  AdviceWithErin1: AdviceWithErin1,
  AdviceWithErin2: AdviceWithErin2,
};

export async function POST(request) {
  try {
    const { resumeData, template } = await request.json();

    const SelectedTemplate = templates[template] || ClassicTemplate;

    const pdfStream = await renderToStream(<SelectedTemplate data={resumeData} />);

    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', 'attachment; filename="resume.pdf"');

    return new NextResponse(pdfStream, { headers });
  } catch (error) {
    console.error('Error rendering PDF:', error);
    return NextResponse.json({ message: 'Error rendering PDF' }, { status: 500 });
  }
}
