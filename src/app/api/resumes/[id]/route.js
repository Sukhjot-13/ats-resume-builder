
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Resume from '@/models/resume';
import User from '@/models/user';
import ResumeMetadata from '@/models/resumeMetadata';
import logger from '@/lib/logger';

export async function GET(req, context) {
  logger.info({ file: 'src/app/api/resumes/[id]/route.js', function: 'GET' }, 'Resume by ID GET route triggered');
  const userId = req.headers.get('x-user-id');
  const { id } = await context.params;
  logger.info({ file: 'src/app/api/resumes/[id]/route.js', function: 'GET', userId, resumeId: id }, 'Fetching resume by ID');

  if (!userId) {
    logger.warn({ file: 'src/app/api/resumes/[id]/route.js', function: 'GET' }, 'Unauthorized request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const resume = await Resume.findOne({ _id: id, userId }).select('-__v');

    if (!resume) {
      logger.warn({ file: 'src/app/api/resumes/[id]/route.js', function: 'GET', userId, resumeId: id }, 'Resume not found');
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    logger.info({ file: 'src/app/api/resumes/[id]/route.js', function: 'GET', userId, resumeId: id }, 'Resume fetched successfully');

    return NextResponse.json(resume);
  } catch (error) {
    logger.error({ file: 'src/app/api/resumes/[id]/route.js', function: 'GET', error: error }, 'Error fetching resume by ID');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  logger.info({ file: 'src/app/api/resumes/[id]/route.js', function: 'DELETE' }, 'Resume by ID DELETE route triggered');
  const userId = req.headers.get('x-user-id');
  const { id } = await context.params;
  logger.info({ file: 'src/app/api/resumes/[id]/route.js', function: 'DELETE', userId, resumeId: id }, 'Deleting resume by ID');

  if (!userId) {
    logger.warn({ file: 'src/app/api/resumes/[id]/route.js', function: 'DELETE' }, 'Unauthorized request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    // Find and delete the resume, ensuring it belongs to the user
    const resume = await Resume.findOneAndDelete({ _id: id, userId });

    if (!resume) {
      logger.warn({ file: 'src/app/api/resumes/[id]/route.js', function: 'DELETE', userId, resumeId: id }, 'Resume not found for deletion');
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Remove the resume reference from the user's generatedResumes array
    await User.findByIdAndUpdate(userId, {
      $pull: { generatedResumes: id },
    });
    logger.info({ file: 'src/app/api/resumes/[id]/route.js', function: 'DELETE', userId, resumeId: id }, 'Resume reference removed from user');

    // Delete the associated metadata
    await ResumeMetadata.findOneAndDelete({ resumeId: id });
    logger.info({ file: 'src/app/api/resumes/[id]/route.js', function: 'DELETE', userId, resumeId: id }, 'Associated resume metadata deleted');

    logger.info({ file: 'src/app/api/resumes/[id]/route.js', function: 'DELETE', userId, resumeId: id }, 'Resume deleted successfully');
    return NextResponse.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    logger.error({ file: 'src/app/api/resumes/[id]/route.js', function: 'DELETE', error: error }, 'Error deleting resume by ID');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
