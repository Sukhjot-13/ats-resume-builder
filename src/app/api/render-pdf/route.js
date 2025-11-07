import { NextResponse } from 'next/server';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
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

async function generatePdfFromHtml(html) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdfBuffer;
}

function populateTemplate(template, data) {
  let populatedTemplate = template;

  // Populate profile data
  for (const key in data.profile) {
    const regex = new RegExp(`{profile.${key}}`, 'g');
    populatedTemplate = populatedTemplate.replace(regex, data.profile[key]);
  }

  // Populate work experience
  const workExperienceHtml = data.work_experience.map(item => `
    <div class="work-experience-item">
      <h3>${item.job_title} at ${item.company}</h3>
      <p>${item.start_date} - ${item.end_date}</p>
      <ul>
        ${item.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
      </ul>
    </div>
  `).join('');
  populatedTemplate = populatedTemplate.replace('{work_experience}', workExperienceHtml);

  // Populate education
  const educationHtml = data.education.map(item => `
    <div class="education-item">
      <h3>${item.institution}</h3>
      <p>${item.degree} in ${item.field_of_study}</p>
      <p>Graduated: ${item.graduation_date}</p>
    </div>
  `).join('');
  populatedTemplate = populatedTemplate.replace('{education}', educationHtml);

  // Populate skills
  const skillsHtml = data.skills.map(item => `<li>${item.skill_name}</li>`).join('');
  populatedTemplate = populatedTemplate.replace('{skills}', skillsHtml);

  return populatedTemplate;
}

export async function POST(request) {
  try {
    const { resumeData, template } = await request.json();

    if (template.endsWith('.html')) {
      const templatePath = path.join(process.cwd(), 'src', 'components', 'resume-templates', 'html-templates', template);
      const htmlTemplate = await fs.readFile(templatePath, 'utf-8');
      const populatedHtml = populateTemplate(htmlTemplate, resumeData);
      const pdfBuffer = await generatePdfFromHtml(populatedHtml);

      const headers = new Headers();
      headers.set('Content-Type', 'application/pdf');
      headers.set('Content-Disposition', 'attachment; filename="resume.pdf"');

      return new NextResponse(pdfBuffer, { headers });

    } else {
      const SelectedTemplate = templates[template] || ClassicTemplate;
      const pdfStream = await renderToStream(<SelectedTemplate data={resumeData} />);

      const headers = new Headers();
      headers.set('Content-Type', 'application/pdf');
      headers.set('Content-Disposition', 'attachment; filename="resume.pdf"');

      return new NextResponse(pdfStream, { headers });
    }
  } catch (error) {
    console.error('Error rendering PDF:', error);
    return NextResponse.json({ message: 'Error rendering PDF' }, { status: 500 });
  }
}
