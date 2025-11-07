import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    const templatePath = path.join(process.cwd(), 'src', 'components', 'resume-templates', 'html-templates', 'test.html');

    const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
    let template = await fs.readFile(templatePath, 'utf-8');

    // Replace profile placeholders
    template = template.replace('{profile.full_name}', data.profile.full_name);
    template = template.replace('{profile.headline}', data.profile.headline);
    template = template.replace('{profile.email}', data.profile.email);
    template = template.replace('{profile.phone}', '123-456-7890');
    template = template.replace('{profile.location}', 'City, STATE');
    template = template.replace('{profile.website}', 'www.website.com');
    template = template.replace('{profile.generic_summary}', data.profile.generic_summary);

    // Replace skills
    const skills = data.skills.map(skill => skill.skill_name).join(', ');
    template = template.replace('{skills.list_of_skills}', skills);

    // Replace education
    const edu = data.education[0];
    template = template.replace('{education.degree}', edu.degree);
    template = template.replace('{education.field_of_study}', edu.field_of_study);
    template = template.replace('{education.institution}', edu.institution);
    template = template.replace('{education.start_date} - {education.end_date}', edu.graduation_date);
    template = template.replace('{education.relevant_coursework}', 'Relevant coursework, study abroad, awards');

    // Replace work experience
    let workExperienceHtml = '';
    for (const exp of data.work_experience) {
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
    template = template.replace(/<!-- Loop through work_experience -->[\s\S]*<\/ul>/, workExperienceHtml);

    // Replace additional info
    template = template.replace('{additional_info.languages}', 'English, Spanish (fluent)');
    template = template.replace('{additional_info.certifications}', 'Online Certification, Course Completion, Registration, License, etc.');
    template = template.replace('{additional_info.awards_activities}', 'Best Person of the Year (2020), Award of the Awards (2020), Top 50 Best Award Winners (2020), Student of the Year (2020)');

    return new NextResponse(template, { headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    return new NextResponse('Error generating resume: ' + error.message, { status: 500 });
  }
}
