
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import Resume from '@/models/resume';
import { editResumeWithAI } from '@/services/aiResumeEditorService';
import logger from '@/lib/logger';

export async function POST(req) {
  logger.info({ file: 'src/app/api/edit-resume-with-ai/route.js', function: 'POST' }, 'Edit resume with AI route triggered');
  const userId = req.headers.get('x-user-id');
  const { resume, query } = await req.json();
  logger.info({ file: 'src/app/api/edit-resume-with-ai/route.js', function: 'POST', userId, query }, 'Processing edit resume with AI request');

  if (!userId) {
    logger.warn({ file: 'src/app/api/edit-resume-with-ai/route.js', function: 'POST' }, 'Unauthorized request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!resume || !query) {
    logger.warn({ file: 'src/app/api/edit-resume-with-ai/route.js', function: 'POST' }, 'Resume and query are required');
    return NextResponse.json({ error: 'Resume and query are required' }, { status: 400 });
  }

  await dbConnect();

  try {
    const editedResumeContent = await editResumeWithAI(resume, query);
    logger.info({ file: 'src/app/api/edit-resume-with-ai/route.js', function: 'POST', userId }, 'Resume content edited by AI');

    const user = await User.findById(userId);
    if (!user) {
      logger.warn({ file: 'src/app/api/edit-resume-with-ai/route.js', function: 'POST', userId }, 'User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await Resume.findByIdAndUpdate(user.mainResume, {
      $set: { content: editedResumeContent },
    });
    logger.info({ file: 'src/app/api/edit-resume-with-ai/route.js', function: 'POST', userId, resumeId: user.mainResume }, 'Updated resume in database');

    const updatedResume = await Resume.findById(user.mainResume);

    return NextResponse.json(updatedResume.content);
  } catch (error) {
    logger.error({ file: 'src/app/api/edit-resume-with-ai/route.js', function: 'POST', error: error }, 'Edit resume with AI error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
