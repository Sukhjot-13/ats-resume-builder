import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import logger from '@/lib/logger';

const dataFilePath = path.join(process.cwd(), 'data.json');

export async function GET() {
  logger.info({ file: 'src/app/api/profile/route.js', function: 'GET' }, 'Profile GET route triggered');
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    logger.info({ file: 'src/app/api/profile/route.js', function: 'GET' }, 'Data read successfully from data.json');
    return NextResponse.json(jsonData);
  } catch (error) {
    logger.error({ file: 'src/app/api/profile/route.js', function: 'GET', error: error }, 'Error reading data file');
    return NextResponse.json({ message: 'Error reading data file' }, { status: 500 });
  }
}

export async function POST(request) {
  logger.info({ file: 'src/app/api/profile/route.js', function: 'POST' }, 'Profile POST route triggered');
  try {
    const newData = await request.json();
    logger.info({ file: 'src/app/api/profile/route.js', function: 'POST' }, 'Writing data to data.json');
    await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2));
    logger.info({ file: 'src/app/api/profile/route.js', function: 'POST' }, 'Data updated successfully in data.json');
    return NextResponse.json({ message: 'Data updated successfully' });
  } catch (error) {
    logger.error({ file: 'src/app/api/profile/route.js', function: 'POST', error: error }, 'Error writing data file');
    return NextResponse.json({ message: 'Error writing data file' }, { status: 500 });
  }
}
