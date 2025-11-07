
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

async function generatePdfFromHtml(html) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdfBuffer;
}

export async function POST(request) {
  try {
    const { html } = await request.json();
    const globalsCss = await fs.readFile(path.join(process.cwd(), 'src', 'app', 'globals.css'), 'utf-8');

    const fullHtml = `
      <html>
        <head>
          <style>${globalsCss}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    const pdfBuffer = await generatePdfFromHtml(fullHtml);

    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', 'attachment; filename="resume.pdf"');

    return new NextResponse(pdfBuffer, { headers });
  } catch (error) {
    console.error('Error rendering PDF:', error);
    return NextResponse.json({ message: 'Error rendering PDF' }, { status: 500 });
  }
}
