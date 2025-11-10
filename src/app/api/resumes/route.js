
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Resume from '@/models/resume';
import User from '@/models/user';
import ResumeMetadata from '@/models/resumeMetadata';
import logger from '@/lib/logger';

export async function GET(req) {
  logger.info({ file: 'src/app/api/resumes/route.js', function: 'GET' }, 'Resumes GET route triggered');
  const userId = req.headers.get('x-user-id');
  logger.info({ file: 'src/app/api/resumes/route.js', function: 'GET', userId }, 'Fetching resumes for user');

  if (!userId) {
    logger.warn({ file: 'src/app/api/resumes/route.js', function: 'GET' }, 'Unauthorized request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const user = await User.findById(userId).populate({
      path: 'generatedResumes',
      populate: {
        path: 'metadata',
        model: 'ResumeMetadata'
      }
    }).select('generatedResumes');
    
    if (!user) {
      logger.warn({ file: 'src/app/api/resumes/route.js', function: 'GET', userId }, 'User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    logger.info({ file: 'src/app/api/resumes/route.js', function: 'GET', userId, count: user.generatedResumes.length }, 'Resumes fetched successfully');
    return NextResponse.json(user.generatedResumes);
  } catch (error) {
    logger.error({ file: 'src/app/api/resumes/route.js', function: 'GET', error: error.message }, 'Error fetching resumes');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  logger.info({ file: 'src/app/api/resumes/route.js', function: 'POST' }, 'Resumes POST route triggered');
  const userId = req.headers.get('x-user-id');
  const { content, metadata } = await req.json();
  logger.info({ file: 'src/app/api/resumes/route.js', function: 'POST', userId }, 'Creating new resume for user');

  if (!userId) {
    logger.warn({ file: 'src/app/api/resumes/route.js', function: 'POST' }, 'Unauthorized request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!content) {
    logger.warn({ file: 'src/app/api/resumes/route.js', function: 'POST' }, 'Resume content is required');
    return NextResponse.json({ error: 'Resume content is required' }, { status: 400 });
  }

  await dbConnect();

  try {
    // Create the new resume
    const newResume = new Resume({
      userId,
      content,
    });
    await newResume.save();
    logger.info({ file: 'src/app/api/resumes/route.js', function: 'POST', userId, resumeId: newResume._id }, 'New resume created');

    // Add the new resume's ID to the user's generatedResumes array
    await User.findByIdAndUpdate(userId, {
      $push: { generatedResumes: newResume._id },
    });
    logger.info({ file: 'src/app/api/resumes/route.js', function: 'POST', userId, resumeId: newResume._id }, 'Resume added to user\'s generatedResumes');

    if (metadata) {
      const newMetadata = new ResumeMetadata({
        userId,
        resumeId: newResume._id,
        jobTitle: metadata.jobTitle,
        companyName: metadata.companyName,
      });
      await newMetadata.save();

      newResume.metadata = newMetadata._id;
      await newResume.save();
      logger.info({ file: 'src/app/api/resumes/route.js', function: 'POST', userId, resumeId: newResume._id, metadataId: newMetadata._id }, 'Resume metadata created and linked');
    }

    return NextResponse.json(newResume, { status: 201 });
  } catch (error) {
    logger.error({ file: 'src/app/api/resumes/route.js', function: 'POST', error: error.message }, 'Error creating resume');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
