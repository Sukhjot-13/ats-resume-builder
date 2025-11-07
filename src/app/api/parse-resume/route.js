import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import fs from 'fs/promises';
import mammoth from 'mammoth';
import { extractText as extractPdfText } from 'unpdf';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Disable Next.js body parser for this route
export const bodyParser = false;

// Helper to extract text from a file buffer
async function extractText(fileBuffer, fileType) {
  if (fileType === 'application/pdf') {
    try {
      const uint8Array = new Uint8Array(fileBuffer);
      const { text } = await extractPdfText(uint8Array);
      return text;
    } catch (error) {
      console.error('Error in PDF parsing:', error);
      throw new Error('Error processing PDF file');
    }
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { // .docx
    const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
    return value;
  }
  throw new Error('Unsupported file type');
}

export async function POST(request) {
  // 1. Parse the uploaded file from FormData
  const formData = await request.formData();
  const file = formData.get('resumeFile');

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  // 2. Extract raw text
  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const rawText = await extractText(fileBuffer, file.type);

    // 3. Construct the Gemini "Parser" Prompt
    const prompt = `
    [TASK]
    You are an expert resume parsing AI. Read the following raw text from a user's resume and extract all structured data.
    Your output MUST be a JSON object in the exact schema provided.
    If a field is not present, return an empty array or null.
    - 'responsibilities' should be an array of strings.
    - 'start_date' and 'end_date' should be in YYYY-MM-DD format if possible, otherwise just text.

    [RAW RESUME TEXT]
    ${rawText}

    [OUTPUT JSON SCHEMA]
    {
      "profile": {
        "full_name": "...",
        "email": "...",
        "headline": "...",
        "generic_summary": "..."
      },
      "work_experience": [
        {
          "job_title": "...",
          "company": "...",
          "start_date": "YYYY-MM-DD",
          "end_date": "YYYY-MM-DD",
          "is_current": false,
          "responsibilities": ["...", "..."]
        }
      ],
      "education": [
        {
          "institution": "...",
          "degree": "...",
          "field_of_study": "...",
          "graduation_date": "YYYY-MM-DD"
        }
      ],
      "skills": [
        { "skill_name": "...", "category": "..." }
      ]
    }
  `;

    // 4. Call Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "");

    // 5. Return the parsed JSON
    try {
      const parsedData = JSON.parse(text);
      return new Response(JSON.stringify(parsedData), { status: 200 });
    } catch (e) {
      return new Response(`AI parsing error: ${text}`, { status: 500 });
    }
  } catch (error) {
    console.error('Error in POST request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

