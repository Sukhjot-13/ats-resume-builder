import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  const { profile, jobDescription } = await request.json();

  const prompt = `
    [TASK]
    You are an expert ATS-friendly resume writer. Your task is to rewrite the user's resume to be tailored for a specific job description.
    You will receive the user's generic resume data and the job description.
    Your output MUST be a JSON object with the same schema as the user's profile data.

    [USER'S GENERIC RESUME DATA]
    ${JSON.stringify(profile, null, 2)}

    [JOB DESCRIPTION]
    ${jobDescription}

    [INSTRUCTIONS]
    1. Rewrite the 'generic_summary' to be a 'tailored_summary' that highlights the user's most relevant skills and experience for the job.
    2. For each 'work_experience' item, rewrite the 'responsibilities' to be 3-5 bullet points that showcase achievements and align with the job description.
    3. Select the most relevant skills from the user's 'skills' list and include them in the 'skills' array.
    4. Ensure the output is a valid JSON object with the same schema as the user's profile data.

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

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "");
    const tailoredData = JSON.parse(text);
    return NextResponse.json(tailoredData);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ message: 'Error generating content' }, { status: 500 });
  }
}
