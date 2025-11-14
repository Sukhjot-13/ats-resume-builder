import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';

/**
 * Formats a date string into "Month Year" format.
 * @param {string} dateString - The date string to format.
 * @returns {string|null} The formatted date string or null if the input is invalid.
 */
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  date.setUTCHours(12);
  const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
  const year = date.getUTCFullYear();
  return `${month} ${year}`;
};

/**
 * Renders a resume to a PDF buffer using a given template.
 * @param {object} resumeData - The resume data to render.
 * @param {string} template - The name of the HTML template to use.
 * @param {boolean} returnHtml - Whether to return the HTML instead of the PDF buffer.
 * @returns {Promise<Buffer|string>} The rendered PDF buffer or HTML string.
 */
export async function renderPdf(resumeData, template, returnHtml = false) {
  // Read the HTML template from the file system
  const templatePath = path.join(process.cwd(), 'src', 'components', 'resume-templates', 'html-templates', template);
  let html = await fs.readFile(templatePath, 'utf-8');

  // Replace placeholders in the HTML with resume data
  html = html.replace(/{profile.full_name}/g, resumeData.profile.full_name || '');
  html = html.replace(/{profile.headline}/g, resumeData.profile.headline || '');
  html = html.replace(/{profile.email}/g, resumeData.profile.email || '');
  html = html.replace(/{profile.phone}/g, resumeData.profile.phone || '');
  html = html.replace(/{profile.location}/g, resumeData.profile.location || '');
  html = html.replace(/{profile.website}/g, resumeData.profile.website ? `| <a href="${resumeData.profile.website}" target="_blank">${resumeData.profile.website}</a>` : '');
  html = html.replace(/{profile.generic_summary}/g, resumeData.profile.generic_summary || '');

  // Replace skills placeholder
  if (resumeData.skills && resumeData.skills.length > 0) {
    let skills;
    if (template === 'test.html' || template === 'Test2.html') {
      skills = resumeData.skills.map(skill => skill.skill_name).join(', ');
    } else {
      skills = resumeData.skills.map(skill => `<li>${skill.skill_name}</li>`).join('');
    }
    html = html.replace(/{skills.list_of_skills}/g, skills);
  } else {
    html = html.replace(/<div class="section skills">[\s\S]*?<\/div>/, '');
  }

  // Replace education placeholder
  let educationHtml = '';
  if (resumeData.education && resumeData.education.length > 0) {
    for (const edu of resumeData.education) {
      const startDate = formatDate(edu.start_date);
      const endDate = edu.is_current ? 'Present' : formatDate(edu.end_date);
      const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : '';

      educationHtml += `
        <div class="education-item">
          <div class="company-date">
            <div><span class="bold">${edu.degree || ''}, ${edu.field_of_study || ''}</span></div>
            <div><em class="date">${dateRange}</em></div>
          </div>
          <p>${edu.institution || ''}</p>
        </div>
      `;
    }
  }
  html = html.replace('<!-- education -->', educationHtml);

  // Replace work experience placeholder
  let workExperienceHtml = '';
  if (resumeData.work_experience && resumeData.work_experience.length > 0) {
    for (const exp of resumeData.work_experience) {
      const startDate = formatDate(exp.start_date);
      const endDate = exp.is_current ? 'Present' : formatDate(exp.end_date);
      const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : '';

      workExperienceHtml += `
        <div class="work-experience-item">
          <div class="company-date">
            <div class="position">${exp.job_title || ''}, ${exp.company || ''}</div>
            <div><em class="date">${dateRange}</em></div>
          </div>
          <ul>
            ${exp.responsibilities ? exp.responsibilities.map(r => `<li>${r}</li>`).join('') : ''}
          </ul>
        </div>
      `;
    }
  }
  html = html.replace('<!-- work_experience -->', workExperienceHtml);

  if (returnHtml) {
    return html;
  }

  // Launch Puppeteer to generate the PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdfBuffer;
}