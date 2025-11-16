'use server';

import fs from 'fs/promises';
import path from 'path';

export async function getTemplates() {
  try {
    const templatesDirectory = path.join(process.cwd(), 'src/components/resume-templates/html-templates');
    const filenames = await fs.readdir(templatesDirectory);
    const templates = filenames
      .filter(filename => filename.endsWith('.html'))
      .map(filename => ({
        name: filename.replace('.html', ''),
        path: filename,
      }));
    return templates;
  } catch (error) {
    console.error('Error reading templates directory:', error);
    throw new Error('Error getting templates');
  }
}
