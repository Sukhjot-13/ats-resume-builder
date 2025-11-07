import { NextResponse } from 'next/server';
import { generateTailoredContent } from '../../../services/contentGenerationService';

export async function POST(request) {
  try {
    const { profile, jobDescription, specialInstructions } = await request.json();
    const tailoredData = await generateTailoredContent(profile, jobDescription, specialInstructions);
    return NextResponse.json(tailoredData);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ message: error.message || 'Error generating content' }, { status: 500 });
  }
}