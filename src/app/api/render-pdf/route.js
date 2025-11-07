import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';

export async function POST(request) {
  try {
    const { resumeData, template } = await request.json();

    const templatePath = path.join(process.cwd(), 'src', 'components', 'resume-templates', 'html-templates', template);
    let html = await fs.readFile(templatePath, 'utf-8');

    // Replace placeholders
    html = html.replace(/{profile.full_name}/g, resumeData.profile.full_name);
    html = html.replace(/{profile.headline}/g, resumeData.profile.headline);
    html = html.replace(/{profile.email}/g, resumeData.profile.email);
    html = html.replace(/{profile.phone}/g, resumeData.profile.phone);
    html = html.replace(/{profile.location}/g, resumeData.profile.location);
    html = html.replace(/{profile.website}/g, resumeData.profile.website);
    html = html.replace(/{profile.generic_summary}/g, resumeData.profile.generic_summary);

    const skills = resumeData.skills.map(skill => skill.skill_name).join(', ');
    html = html.replace(/{skills.list_of_skills}/g, skills);

    let educationHtml = '';
    for (const edu of resumeData.education) {
      educationHtml += `
        <div class="company-date">
          <div><span class="bold">${edu.degree}, ${edu.field_of_study}</span></div>
          <div><em>${edu.start_date} - ${edu.end_date}</em></div>
        </div>
        <p>${edu.institution}</p>
        <ul class="sub-list">
          <li>${edu.relevant_coursework}</li>
        </ul>
      `;
    }
    html = html.replace('<!-- education -->', educationHtml);

    let workExperienceHtml = '';
    for (const exp of resumeData.work_experience) {
      workExperienceHtml += `
        <div class="company-date">
          <div class="position">${exp.job_title}, ${exp.company}</div>
          <div><em>${exp.start_date} - ${exp.end_date}</em></div>
        </div>
        <ul>
          ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
      `;
    }
    html = html.replace('<!-- work_experience -->', workExperienceHtml);

    html = html.replace(/{additional_info.languages}/g, resumeData.additional_info.languages.join(', '));
    html = html.replace(/{additional_info.certifications}/g, resumeData.additional_info.certifications.join(', '));
    html = html.replace(/{additional_info.awards_activities}/g, resumeData.additional_info.awards_activities.join(', '));

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    return new NextResponse('Error generating resume: ' + error.message, { status: 500 });
  }
}
