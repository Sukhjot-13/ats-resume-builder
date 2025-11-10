
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import Resume from '@/models/resume';
import ResumeMetadata from '@/models/resumeMetadata';
import logger from '@/lib/logger';

export async function GET(req) {
  logger.info({ file: 'src/app/api/user/profile/route.js', function: 'GET' }, 'User profile GET route triggered');
  const userId = req.headers.get('x-user-id');
  logger.info({ file: 'src/app/api/user/profile/route.js', function: 'GET', userId }, 'Fetching user profile');

  await dbConnect();

  try {
    const user = await User.findById(userId).populate('mainResume').select('-__v');
    if (!user) {
      logger.warn({ file: 'src/app/api/user/profile/route.js', function: 'GET', userId }, 'User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    logger.info({ file: 'src/app/api/user/profile/route.js', function: 'GET', userId }, 'User profile fetched successfully');
    return NextResponse.json(user);
  } catch (error) {
    logger.error({ file: 'src/app/api/user/profile/route.js', function: 'GET', error: error }, 'Error fetching user profile');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  logger.info({ file: 'src/app/api/user/profile/route.js', function: 'PUT' }, 'User profile PUT route triggered');
  const userId = req.headers.get('x-user-id');
  const body = await req.json();
  const { name, dateOfBirth, mainResume } = body;
  logger.info({ file: 'src/app/api/user/profile/route.js', function: 'PUT', userId, name, dateOfBirth }, 'Updating user profile');

  await dbConnect();

  try {
    let updateData = { name, dateOfBirth };

    // If mainResume is a full object, create a new resume document
    if (mainResume && typeof mainResume === 'object' && !mainResume._id) {
      const newResume = new Resume({
        userId,
        content: mainResume,
      });
      await newResume.save();
      updateData.mainResume = newResume._id;
      // Add the new resume to the generatedResumes array
      await User.findByIdAndUpdate(userId, {
        $push: { generatedResumes: newResume._id },
      });
      logger.info({ file: 'src/app/api/user/profile/route.js', function: 'PUT', userId, resumeId: newResume._id }, 'New main resume created and linked');

      const metadata = new ResumeMetadata({
        userId,
        resumeId: newResume._id,
        jobTitle: 'Master Resume',
      });
      await metadata.save();

      newResume.metadata = metadata._id;
      await newResume.save();
      logger.info({ file: 'src/app/api/user/profile/route.js', function: 'PUT', userId, resumeId: newResume._id, metadataId: metadata._id }, 'Metadata created for new main resume');

    } else if (mainResume && mainResume._id) {
      // If mainResume is an object with an ID, just use the ID
      updateData.mainResume = mainResume._id;
      logger.info({ file: 'src/app/api/user/profile/route.js', function: 'PUT', userId, resumeId: mainResume._id }, 'Main resume updated to existing resume');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('mainResume').select('-__v');

    if (!user) {
      logger.warn({ file: 'src/app/api/user/profile/route.js', function: 'PUT', userId }, 'User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    logger.info({ file: 'src/app/api/user/profile/route.js', function: 'PUT', userId }, 'User profile updated successfully');

    return NextResponse.json(user);
  } catch (error) {
    logger.error({ file: 'src/app/api/user/profile/route.js', function: 'PUT', error: error }, 'Error updating user profile');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
